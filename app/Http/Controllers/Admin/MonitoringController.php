<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringController extends Controller
{
    /**
     * Show live activity monitoring stream.
     */
    public function activity(Request $request): Response
    {
        $activities = AuditLog::with(['user:id,name,email'])
            ->orderByDesc('created_at')
            ->paginate(25);

        return Inertia::render('admin/monitoring/activity', [
            'activities' => $activities,
        ]);
    }

    /**
     * Show failed access and security attempt monitoring.
     */
    public function failedAccess(Request $request): Response
    {
        $failedAttempts = AuditLog::with(['user:id,name,email'])
            ->where(function ($q) {
                $q->where('action', 'like', '%FAILED%')
                    ->orWhere('action', 'like', '%UNAUTHORIZED%');
            })
            ->orderByDesc('created_at')
            ->paginate(25);

        return Inertia::render('admin/monitoring/failed-access', [
            'failedAttempts' => $failedAttempts,
        ]);
    }
}
