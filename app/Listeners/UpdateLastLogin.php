<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Request;

class UpdateLastLogin
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        if ($event->user instanceof User) {
            $event->user->updateQuietly([
                'last_login_at' => now(),
                'last_login_ip' => Request::ip(),
            ]);

            AuditLogService::log(
                action: 'LOGIN_SUCCESS',
                entityType: 'User',
                entityId: $event->user->id,
                metadata: [
                    'guard' => $event->guard,
                    'ip' => Request::ip(),
                ],
                user: $event->user
            );
        }
    }
}
