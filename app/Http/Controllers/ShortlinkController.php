<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShortlinkRequest;
use App\Http\Requests\UpdateShortlinkRequest;
use App\Models\Shortlink;
use App\Models\Tag;
use App\Services\AuditLogService;
use App\Services\SlugService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ShortlinkController extends Controller
{
    /**
     * Display a listing of shortlinks.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = Shortlink::query()
            ->with(['tags:id,name,slug', 'user:id,name,email'])
            ->when(! $isAdmin, function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->when($request->query('search'), function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('destination_url', 'like', "%{$search}%");
                });
            })
            ->when($request->query('status'), function ($q, $status) {
                if ($status === 'expired') {
                    $q->expired();
                } elseif ($status === 'active') {
                    $q->active();
                } else {
                    $q->where('status', $status);
                }
            })
            ->when($request->query('tag'), function ($q, $tagSlug) {
                $q->whereHas('tags', function ($sub) use ($tagSlug) {
                    $sub->where('tags.slug', $tagSlug);
                });
            })
            ->when($isAdmin && $request->query('user_id'), function ($q, $userId) {
                $q->where('user_id', $userId);
            })
            ->latest();

        $shortlinks = $query->paginate(15)->withQueryString();

        // Transform collection to mask password
        $shortlinks->through(function (Shortlink $link) {
            return [
                'id' => $link->id,
                'user_id' => $link->user_id,
                'slug' => $link->slug,
                'title' => $link->title,
                'description' => $link->description,
                'destination_url' => $link->destination_url,
                'has_password' => $link->isPasswordProtected(),
                'status' => $link->status,
                'is_expired' => $link->isExpired(),
                'expires_at' => $link->expires_at?->toIso8601String(),
                'click_count' => $link->click_count,
                'last_clicked_at' => $link->last_clicked_at?->toIso8601String(),
                'created_at' => $link->created_at?->toIso8601String(),
                'tags' => $link->tags,
                'user' => $link->user,
            ];
        });

        $tags = Tag::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('shortlinks/index', [
            'shortlinks' => $shortlinks,
            'tags' => $tags,
            'filters' => $request->only(['search', 'status', 'tag', 'user_id']),
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Show the form for creating a new shortlink.
     */
    public function create(): Response
    {
        $tags = Tag::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('shortlinks/create', [
            'tags' => $tags,
            'appUrl' => config('app.url'),
        ]);
    }

    /**
     * Store a newly created shortlink in storage.
     */
    public function store(StoreShortlinkRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $slug = ! empty($validated['slug'])
            ? trim($validated['slug'])
            : SlugService::generate();

        $shortlink = Shortlink::create([
            'user_id' => $user->id,
            'slug' => $slug,
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'destination_url' => $validated['destination_url'],
            'password_hash' => ! empty($validated['password']) ? Hash::make($validated['password']) : null,
            'status' => $validated['status'] ?? 'active',
            'expires_at' => ! empty($validated['expires_at']) ? $validated['expires_at'] : null,
            'click_count' => 0,
        ]);

        if (! empty($validated['tags'])) {
            $shortlink->tags()->sync($validated['tags']);
        }

        AuditLogService::log(
            action: 'SHORTLINK_CREATED',
            entityType: 'Shortlink',
            entityId: $shortlink->id,
            metadata: [
                'slug' => $shortlink->slug,
                'destination_url' => $shortlink->destination_url,
            ],
            user: $user
        );

        return redirect()->route('shortlinks.show', $shortlink)
            ->with('success', 'Shortlink berhasil dibuat.');
    }

    /**
     * Display the specified shortlink.
     */
    public function show(Request $request, Shortlink $shortlink): Response
    {
        $user = $request->user();

        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses ke shortlink ini.');
        }

        $shortlink->load(['tags:id,name,slug', 'user:id,name,email', 'qrCode']);

        // Recent 10 clicks
        $recentClicks = $shortlink->clickEvents()
            ->latest('clicked_at')
            ->limit(10)
            ->get();

        return Inertia::render('shortlinks/show', [
            'shortlink' => [
                'id' => $shortlink->id,
                'user_id' => $shortlink->user_id,
                'slug' => $shortlink->slug,
                'title' => $shortlink->title,
                'description' => $shortlink->description,
                'destination_url' => $shortlink->destination_url,
                'has_password' => $shortlink->isPasswordProtected(),
                'status' => $shortlink->status,
                'is_expired' => $shortlink->isExpired(),
                'expires_at' => $shortlink->expires_at?->toIso8601String(),
                'click_count' => $shortlink->click_count,
                'last_clicked_at' => $shortlink->last_clicked_at?->toIso8601String(),
                'created_at' => $shortlink->created_at?->toIso8601String(),
                'tags' => $shortlink->tags,
                'user' => $shortlink->user,
                'qr_code' => $shortlink->qrCode,
            ],
            'recentClicks' => $recentClicks,
            'appUrl' => config('app.url'),
        ]);
    }

    /**
     * Show the form for editing the specified shortlink.
     */
    public function edit(Request $request, Shortlink $shortlink): Response
    {
        $user = $request->user();

        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses ke shortlink ini.');
        }

        $shortlink->load(['tags:id,name,slug']);
        $tags = Tag::orderBy('name')->get(['id', 'name', 'slug']);

        return Inertia::render('shortlinks/edit', [
            'shortlink' => [
                'id' => $shortlink->id,
                'slug' => $shortlink->slug,
                'title' => $shortlink->title,
                'description' => $shortlink->description,
                'destination_url' => $shortlink->destination_url,
                'has_password' => $shortlink->isPasswordProtected(),
                'status' => $shortlink->status,
                'expires_at' => $shortlink->expires_at ? $shortlink->expires_at->format('Y-m-d\TH:i') : '',
                'tag_ids' => $shortlink->tags->pluck('id')->all(),
            ],
            'tags' => $tags,
            'appUrl' => config('app.url'),
        ]);
    }

    /**
     * Update the specified shortlink in storage.
     */
    public function update(UpdateShortlinkRequest $request, Shortlink $shortlink): RedirectResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $updateData = [
            'slug' => trim($validated['slug']),
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'destination_url' => $validated['destination_url'],
            'status' => $validated['status'] ?? $shortlink->status,
            'expires_at' => ! empty($validated['expires_at']) ? $validated['expires_at'] : null,
        ];

        if (! empty($validated['remove_password'])) {
            $updateData['password_hash'] = null;
        } elseif (! empty($validated['password'])) {
            $updateData['password_hash'] = Hash::make($validated['password']);
        }

        $shortlink->update($updateData);

        if (isset($validated['tags'])) {
            $shortlink->tags()->sync($validated['tags']);
        }

        AuditLogService::log(
            action: 'SHORTLINK_UPDATED',
            entityType: 'Shortlink',
            entityId: $shortlink->id,
            metadata: [
                'slug' => $shortlink->slug,
            ],
            user: $user
        );

        return redirect()->route('shortlinks.show', $shortlink)
            ->with('success', 'Shortlink berhasil diperbarui.');
    }

    /**
     * Remove the specified shortlink from storage.
     */
    public function destroy(Request $request, Shortlink $shortlink): RedirectResponse
    {
        $user = $request->user();

        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses ke shortlink ini.');
        }

        $shortlink->delete();

        AuditLogService::log(
            action: 'SHORTLINK_DELETED',
            entityType: 'Shortlink',
            entityId: $shortlink->id,
            metadata: [
                'slug' => $shortlink->slug,
            ],
            user: $user
        );

        return redirect()->route('shortlinks.index')
            ->with('success', 'Shortlink berhasil dihapus.');
    }

    /**
     * Toggle status between active and disabled.
     */
    public function toggle(Request $request, Shortlink $shortlink): RedirectResponse
    {
        $user = $request->user();

        if (! $user->isAdmin() && $shortlink->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki hak akses ke shortlink ini.');
        }

        $newStatus = $shortlink->status === 'active' ? 'disabled' : 'active';
        $shortlink->update(['status' => $newStatus]);

        $action = $newStatus === 'active' ? 'SHORTLINK_ENABLED' : 'SHORTLINK_DISABLED';

        AuditLogService::log(
            action: $action,
            entityType: 'Shortlink',
            entityId: $shortlink->id,
            metadata: [
                'slug' => $shortlink->slug,
                'status' => $newStatus,
            ],
            user: $user
        );

        return back()->with('success', "Status shortlink diubah menjadi {$newStatus}.");
    }
}
