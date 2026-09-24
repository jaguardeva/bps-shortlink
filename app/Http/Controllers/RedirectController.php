<?php

namespace App\Http\Controllers;

use App\Jobs\RecordClickEvent;
use App\Models\Shortlink;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class RedirectController extends Controller
{
    /**
     * Handle the incoming request to redirect shortlink.
     */
    public function __invoke(Request $request, string $slug)
    {
        $shortlink = Shortlink::where('slug', $slug)->first();

        if (! $shortlink) {
            return Inertia::render('errors/404', [
                'message' => 'Tautan yang Anda cari tidak ditemukan.',
            ])->toResponse($request)->setStatusCode(Response::HTTP_NOT_FOUND);
        }

        // Check if disabled
        if ($shortlink->status === 'disabled') {
            return Inertia::render('errors/410', [
                'title' => 'Tautan Dinonaktifkan',
                'message' => 'Tautan ini telah dinonaktifkan oleh pemiliknya atau administrator.',
                'slug' => $slug,
            ])->toResponse($request)->setStatusCode(Response::HTTP_GONE);
        }

        // Check if expired
        if ($shortlink->isExpired()) {
            return Inertia::render('errors/410', [
                'title' => 'Tautan Kedaluwarsa',
                'message' => 'Tautan ini telah kedaluwarsa pada '.($shortlink->expires_at?->translatedFormat('d F Y H:i') ?? 'masa lalu').'.',
                'slug' => $slug,
            ])->toResponse($request)->setStatusCode(Response::HTTP_GONE);
        }

        // Check if password protected
        if ($shortlink->isPasswordProtected()) {
            $unlocked = $request->session()->get('unlocked_shortlinks', []);
            if (! in_array($shortlink->id, $unlocked, true)) {
                return redirect()->route('shortlink.password', ['slug' => $slug]);
            }
        }

        // Record click async via Queue
        RecordClickEvent::dispatch(
            $shortlink->id,
            $request->ip(),
            $request->userAgent(),
            $request->header('referer'),
            now()->toDateTimeString()
        );

        // Immediate click count & last clicked timestamp update
        $shortlink->increment('click_count');
        $shortlink->updateQuietly(['last_clicked_at' => now()]);

        return redirect()->away($shortlink->destination_url);
    }
}
