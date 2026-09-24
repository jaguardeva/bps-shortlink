<?php

use App\Models\Role;
use App\Models\User;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'admin'], ['guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'user'], ['guard_name' => 'web']);
});

test('regular user cannot access admin users list', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $response = $this->actingAs($user)->get('/admin/users');

    $response->assertForbidden();
});

test('admin can view users list', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $response = $this->actingAs($admin)->get('/admin/users');

    $response->assertOk();
});

test('admin can create new staff user', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $userRole = Role::where('name', 'user')->first();

    $response = $this->actingAs($admin)->post('/admin/users', [
        'name' => 'Staf Baru',
        'email' => 'stafbaru@kanal3516.site',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'role' => $userRole->id,
        'status' => 'active',
    ]);

    $response->assertRedirect('/admin/users');

    $this->assertDatabaseHas('users', [
        'email' => 'stafbaru@kanal3516.site',
        'name' => 'Staf Baru',
    ]);
});

test('admin can toggle user status', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $user = User::factory()->create(['status' => 'active']);
    $user->assignRole('user');

    $response = $this->actingAs($admin)->patch("/admin/users/{$user->id}/toggle");

    $response->assertRedirect();
    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'status' => 'inactive',
    ]);
});
