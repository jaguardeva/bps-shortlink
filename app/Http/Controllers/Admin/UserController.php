<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\AuditLog;
use App\Models\Role;
use App\Models\Shortlink;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $roleFilter = $request->query('role');
        $statusFilter = $request->query('status');

        $query = User::query()
            ->with(['roles'])
            ->withCount('shortlinks')
            ->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter) {
            $query->whereHas('roles', function ($q) use ($roleFilter) {
                $q->where('roles.name', $roleFilter);
            });
        }

        if ($statusFilter) {
            $query->where('status', $statusFilter);
        }

        $users = $query->paginate(15)->withQueryString();
        $roles = Role::all(['id', 'name']);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => [
                'search' => $search,
                'role' => $roleFilter,
                'status' => $statusFilter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => Role::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'],
            'email_verified_at' => now(),
        ]);

        $user->roles()->attach($validated['role']);

        AuditLogService::log(
            action: 'USER_CREATED',
            entityType: User::class,
            entityId: $user->id,
            metadata: [
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role_id' => $validated['role'],
            ]
        );

        return redirect()->route('admin.users.index')
            ->with('success', "Pengguna {$user->name} berhasil ditambahkan.");
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): Response
    {
        $user->load('roles');

        $shortlinksCount = Shortlink::where('user_id', $user->id)->count();
        $activeShortlinksCount = Shortlink::where('user_id', $user->id)->where('status', 'active')->count();
        $totalClicks = Shortlink::where('user_id', $user->id)->sum('click_count');

        $recentShortlinks = Shortlink::where('user_id', $user->id)
            ->with('tags')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentActivity = AuditLog::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        return Inertia::render('admin/users/show', [
            'targetUser' => $user,
            'stats' => [
                'total_shortlinks' => $shortlinksCount,
                'active_shortlinks' => $activeShortlinksCount,
                'total_clicks' => (int) $totalClicks,
            ],
            'recentShortlinks' => $recentShortlinks,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');

        return Inertia::render('admin/users/edit', [
            'targetUser' => $user,
            'roles' => Role::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->validated();

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'status' => $validated['status'],
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);
        $user->roles()->sync([$validated['role']]);

        AuditLogService::log(
            action: 'USER_UPDATED',
            entityType: User::class,
            entityId: $user->id,
            metadata: [
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role_id' => $validated['role'],
                'password_changed' => ! empty($validated['password']),
            ]
        );

        return redirect()->route('admin.users.index')
            ->with('success', "Data pengguna {$user->name} berhasil diperbarui.");
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggle(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menonaktifkan akun Anda sendiri.');
        }

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        AuditLogService::log(
            action: 'USER_STATUS_TOGGLED',
            entityType: User::class,
            entityId: $user->id,
            metadata: ['old_status' => $user->getOriginal('status'), 'new_status' => $newStatus]
        );

        return back()->with('success', "Status pengguna {$user->name} berhasil diubah menjadi {$newStatus}.");
    }

    /**
     * Force reset user password.
     */
    public function resetPassword(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        AuditLogService::log(
            action: 'USER_PASSWORD_RESET',
            entityType: User::class,
            entityId: $user->id
        );

        return back()->with('success', "Kata sandi pengguna {$user->name} berhasil direset.");
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $userName = $user->name;
        $userId = $user->id;

        $user->delete();

        AuditLogService::log(
            action: 'USER_DELETED',
            entityType: User::class,
            entityId: $userId,
            metadata: ['name' => $userName]
        );

        return redirect()->route('admin.users.index')
            ->with('success', "Pengguna {$userName} berhasil dihapus.");
    }
}
