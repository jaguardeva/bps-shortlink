<?php

namespace App\Listeners;

use App\Services\AuditLogService;
use Illuminate\Auth\Events\Failed;
use Illuminate\Support\Facades\Request;

class LogFailedLogin
{
    /**
     * Handle the event.
     */
    public function handle(Failed $event): void
    {
        AuditLogService::log(
            action: 'LOGIN_FAILED',
            entityType: 'User',
            entityId: $event->user?->id,
            metadata: [
                'email' => $event->credentials['email'] ?? null,
                'ip' => Request::ip(),
            ],
            user: $event->user
        );
    }
}
