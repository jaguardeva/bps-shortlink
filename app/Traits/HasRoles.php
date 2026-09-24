<?php

namespace App\Traits;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

trait HasRoles
{
    /**
     * @return BelongsToMany<Role, $this>
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles', 'user_id', 'role_id');
    }

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $roleName): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->contains('name', $roleName);
        }

        return $this->roles()->where('roles.name', $roleName)->exists();
    }

    /**
     * Check if user has any of the given roles.
     *
     * @param  array<string>  $roleNames
     */
    public function hasAnyRole(array $roleNames): bool
    {
        if ($this->relationLoaded('roles')) {
            return $this->roles->whereIn('name', $roleNames)->isNotEmpty();
        }

        return $this->roles()->whereIn('roles.name', $roleNames)->exists();
    }

    /**
     * Check if user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Get all permissions assigned to user's roles.
     *
     * @return Collection<int, Permission>
     */
    public function allPermissions(): Collection
    {
        return $this->roles->loadMissing('permissions')
            ->flatMap(fn (Role $role) => $role->permissions)
            ->unique('id');
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        return $this->allPermissions()->contains('name', $permissionName);
    }

    /**
     * Check if user has any of the given permissions.
     *
     * @param  array<string>  $permissionNames
     */
    public function hasAnyPermission(array $permissionNames): bool
    {
        if ($this->isAdmin()) {
            return true;
        }

        $userPerms = $this->allPermissions()->pluck('name')->all();

        return ! empty(array_intersect($permissionNames, $userPerms));
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string|Role $role): void
    {
        $roleModel = is_string($role) ? Role::where('name', $role)->firstOrFail() : $role;

        if (! $this->roles()->where('roles.id', $roleModel->id)->exists()) {
            $this->roles()->attach($roleModel->id);
            $this->unsetRelation('roles');
        }
    }

    /**
     * Remove a role from the user.
     */
    public function removeRole(string|Role $role): void
    {
        $roleModel = is_string($role) ? Role::where('name', $role)->first() : $role;

        if ($roleModel) {
            $this->roles()->detach($roleModel->id);
            $this->unsetRelation('roles');
        }
    }

    /**
     * Sync roles for the user.
     *
     * @param  array<string|Role>  $roles
     */
    public function syncRoles(array $roles): void
    {
        $roleIds = [];

        foreach ($roles as $role) {
            if ($role instanceof Role) {
                $roleIds[] = $role->id;
            } elseif (is_string($role)) {
                $roleModel = Role::where('name', $role)->orWhere('id', $role)->first();
                if ($roleModel) {
                    $roleIds[] = $roleModel->id;
                }
            }
        }

        $this->roles()->sync($roleIds);
        $this->unsetRelation('roles');
    }
}
