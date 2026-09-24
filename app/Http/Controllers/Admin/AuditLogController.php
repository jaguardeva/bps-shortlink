<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of audit logs.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $actionFilter = $request->query('action');
        $userIdFilter = $request->query('user_id');

        $query = AuditLog::with(['user:id,name,email'])
            ->orderByDesc('created_at');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($actionFilter) {
            $query->where('action', $actionFilter);
        }

        if ($userIdFilter) {
            $query->where('user_id', $userIdFilter);
        }

        $logs = $query->paginate(20)->withQueryString();

        $actions = AuditLog::select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action');

        $users = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/audit-logs/index', [
            'logs' => $logs,
            'actions' => $actions,
            'users' => $users,
            'filters' => [
                'search' => $search,
                'action' => $actionFilter,
                'user_id' => $userIdFilter,
            ],
        ]);
    }
}
