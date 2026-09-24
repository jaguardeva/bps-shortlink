<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Request;

class AuditLogService
{
    /**
     * Create an audit log record.
     *
     * @param  array<string, mixed>|null  $metadata
     */
    public static function log(
        string $action,
        ?string $entityType = null,
        ?string $entityId = null,
        ?array $metadata = null,
        ?User $user = null
    ): AuditLog {
        $currentUser = $user ?? (auth()->check() ? auth()->user() : null);

        return AuditLog::create([
            'user_id' => $currentUser?->id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'metadata' => $metadata,
            'created_at' => now(),
        ]);
    }
}
