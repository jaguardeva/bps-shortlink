<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\Role;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    /**
     * Display roles and their assigned permissions.
     */
    public function index(): Response
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update permissions for a role.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => ['required', 'array'],
            'permissions.*' => ['string', 'exists:permissions,id'],
        ]);

        $role->permissions()->sync($validated['permissions']);

        AuditLogService::log(
            action: 'ROLE_PERMISSIONS_UPDATED',
            entityType: Role::class,
            entityId: $role->id,
            metadata: [
                'role' => $role->name,
                'permission_count' => count($validated['permissions']),
            ]
        );

        return back()->with('success', "Hak akses untuk peran {$role->name} berhasil diperbarui.");
    }
}
