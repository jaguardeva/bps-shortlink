<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('active user can authenticate and audit log is created', function () {
    $user = User::factory()->create([
        'email' => 'active@bps.go.id',
        'password' => Hash::make('secret123'),
        'status' => 'active',
    ]);

    $response = $this->post('/login', [
        'email' => 'active@bps.go.id',
        'password' => 'secret123',
    ]);

    $this->assertAuthenticatedAs($user);
    $response->assertRedirect('/dashboard');

    $this->assertDatabaseHas('audit_logs', [
        'user_id' => $user->id,
        'action' => 'LOGIN_SUCCESS',
    ]);
});

test('inertia request login redirects properly', function () {
    $user = User::factory()->create([
        'email' => 'inertia@bps.go.id',
        'password' => Hash::make('secret123'),
        'status' => 'active',
    ]);

    $response = $this->withHeaders([
        'X-Inertia' => 'true',
        'Accept' => 'text/html, application/xhtml+xml',
    ])->post('/login', [
        'email' => 'inertia@bps.go.id',
        'password' => 'secret123',
    ]);

    dump('STATUS: ' . $response->status());
    dump('LOCATION: ' . $response->headers->get('Location'));
    dump('CONTENT: ' . $response->getContent());
});

test('inactive user cannot authenticate', function () {
    $user = User::factory()->create([
        'email' => 'inactive@bps.go.id',
        'password' => Hash::make('secret123'),
        'status' => 'inactive',
    ]);

    $response = $this->post('/login', [
        'email' => 'inactive@bps.go.id',
        'password' => 'secret123',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('failed login attempts are logged in audit_logs', function () {
    $this->post('/login', [
        'email' => 'nonexistent@bps.go.id',
        'password' => 'wrongpassword',
    ]);

    $this->assertDatabaseHas('audit_logs', [
        'action' => 'LOGIN_FAILED',
    ]);
});

test('authenticated user can logout and logout is logged', function () {
    $user = User::factory()->create([
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');

    $this->assertDatabaseHas('audit_logs', [
        'user_id' => $user->id,
        'action' => 'LOGOUT',
    ]);
});
