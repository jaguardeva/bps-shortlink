<?php

namespace App\Http\Controllers;

use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user profile page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user()->load('roles');

        return Inertia::render('profile/index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'roles' => $user->roles->pluck('name')->all(),
                'last_login_at' => $user->last_login_at?->toISOString(),
                'last_login_ip' => $user->last_login_ip,
                'created_at' => $user->created_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Update user profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        AuditLogService::log(
            action: 'PROFILE_UPDATED',
            entityType: get_class($user),
            entityId: $user->id,
            metadata: ['name' => $user->name, 'email' => $user->email]
        );

        return back()->with('success', 'Profil akun berhasil diperbarui.');
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed', Password::defaults()],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        AuditLogService::log(
            action: 'PASSWORD_CHANGED',
            entityType: get_class($user),
            entityId: $user->id
        );

        return back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
