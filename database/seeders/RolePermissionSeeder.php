<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'dashboard.view',
            'shortlinks.view',
            'shortlinks.create',
            'shortlinks.update',
            'shortlinks.delete',
            'shortlinks.analytics',
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'roles.manage',
            'permissions.manage',
            'audit_logs.view',
            'settings.manage',
        ];

        $permissionModels = [];
        foreach ($permissions as $permissionName) {
            $permissionModels[$permissionName] = Permission::firstOrCreate(
                ['name' => $permissionName, 'guard_name' => 'web']
            );
        }

        // Create Admin role
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web']
        );
        // Admin gets all permissions
        $adminRole->permissions()->sync(
            collect($permissionModels)->pluck('id')->all()
        );

        // Create User role
        $userRole = Role::firstOrCreate(
            ['name' => 'user', 'guard_name' => 'web']
        );
        // User gets standard shortlink permissions
        $userPermissions = [
            'dashboard.view',
            'shortlinks.view',
            'shortlinks.create',
            'shortlinks.update',
            'shortlinks.delete',
            'shortlinks.analytics',
        ];
        $userRole->permissions()->sync(
            collect($permissionModels)->only($userPermissions)->pluck('id')->all()
        );
    }
}
