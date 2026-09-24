<?php

namespace App\Http\Controllers;

use App\Models\Shortlink;
use App\Services\AuditLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ShortlinkPasswordController extends Controller
{
    /**
     * Show the password prompt for a shortlink.
     */
    public function show(Request $request, string $slug): Response|RedirectResponse
    {
        $shortlink = Shortlink::where('slug', $slug)->firstOrFail();

        if (! $shortlink->isPasswordProtected()) {
            return redirect()->route('redirect', ['slug' => $slug]);
        }

        $unlocked = $request->session()->get('unlocked_shortlinks', []);
        if (in_array($shortlink->id, $unlocked, true)) {
            return redirect()->route('redirect', ['slug' => $slug]);
        }

        return Inertia::render('shortlink-password', [
            'slug' => $shortlink->slug,
            'title' => $shortlink->title ?: $shortlink->slug,
            'description' => $shortlink->description,
        ]);
    }

    /**
     * Verify the entered password.
     */
    public function verify(Request $request, string $slug)
    {
        $shortlink = Shortlink::where('slug', $slug)->firstOrFail();

        $throttleKey = 'verify-pass:'.$shortlink->id.'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'password' => "Terlalu banyak percobaan yang gagal. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        $request->validate([
            'password' => ['required', 'string'],
        ]);

        if (! Hash::check($request->password, $shortlink->password_hash)) {
            RateLimiter::hit($throttleKey, 60);

            AuditLogService::log(
                action: 'SHORTLINK_PASSWORD_FAILED',
                entityType: Shortlink::class,
                entityId: $shortlink->id,
                metadata: [
                    'slug' => $shortlink->slug,
                    'ip' => $request->ip(),
                ]
            );

            throw ValidationException::withMessages([
                'password' => 'Kata sandi yang Anda masukkan salah.',
            ]);
        }

        RateLimiter::clear($throttleKey);

        $unlocked = $request->session()->get('unlocked_shortlinks', []);
        $unlocked[] = $shortlink->id;
        $request->session()->put('unlocked_shortlinks', array_unique($unlocked));

        return redirect()->route('redirect', ['slug' => $shortlink->slug]);
    }
}
