<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Auth\Events\Logout;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogout
{
    /**
     * Handle the event.
     */
    public function handle(Logout $event): void
    {
        if ($event->user instanceof User) {
            AuditLogService::log(
                action: 'LOGOUT',
                entityType: 'User',
                entityId: $event->user->id,
                metadata: [
                    'ip' => Request::ip(),
                ],
                user: $event->user
            );
        }
    }
}
