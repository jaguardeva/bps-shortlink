<?php

use App\Jobs\RecordClickEvent;
use App\Models\Role;
use App\Models\Shortlink;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Queue;

beforeEach(function () {
    // Ensure roles exist
    Role::firstOrCreate(['name' => 'admin'], ['guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'user'], ['guard_name' => 'web']);
});

test('redirects active shortlink to destination and dispatches click event', function () {
    Queue::fake();

    $user = User::factory()->create();
    $shortlink = Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'bps-test-redirect',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'status' => 'active',
    ]);

    $response = $this->get('/bps-test-redirect');

    $response->assertRedirect('https://mojokertokab.bps.go.id');
    Queue::assertPushed(RecordClickEvent::class);

    $this->assertDatabaseHas('shortlinks', [
        'id' => $shortlink->id,
        'click_count' => 1,
    ]);
});

test('returns 404 when shortlink slug does not exist', function () {
    $response = $this->get('/slug-yang-tidak-ada');

    $response->assertNotFound();
});

test('returns 410 when shortlink is disabled', function () {
    $user = User::factory()->create();
    Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'link-nonaktif',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'status' => 'disabled',
    ]);

    $response = $this->get('/link-nonaktif');

    $response->assertStatus(410);
});

test('returns 410 when shortlink has expired', function () {
    $user = User::factory()->create();
    Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'link-expired',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'status' => 'active',
        'expires_at' => now()->subDay(),
    ]);

    $response = $this->get('/link-expired');

    $response->assertStatus(410);
});

test('redirects to password prompt if shortlink is password protected', function () {
    $user = User::factory()->create();
    Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'link-rahasia',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'password_hash' => Hash::make('secret123'),
        'status' => 'active',
    ]);

    $response = $this->get('/link-rahasia');

    $response->assertRedirect('/link-rahasia/password');
});

test('verifies correct password and allows access to destination', function () {
    $user = User::factory()->create();
    Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'link-rahasia-2',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'password_hash' => Hash::make('secret123'),
        'status' => 'active',
    ]);

    $verifyResponse = $this->post('/link-rahasia-2/password', [
        'password' => 'secret123',
    ]);

    $verifyResponse->assertRedirect('/link-rahasia-2');

    $finalResponse = $this->get('/link-rahasia-2');
    $finalResponse->assertRedirect('https://mojokertokab.bps.go.id');
});

test('authenticated user can create a shortlink', function () {
    $user = User::factory()->create();
    $user->assignRole('user');

    $response = $this->actingAs($user)->post('/shortlinks', [
        'destination_url' => 'https://sensus.bps.go.id',
        'slug' => 'sensus-2026',
        'title' => 'Portal Sensus BPS',
    ]);

    $shortlink = Shortlink::where('slug', 'sensus-2026')->first();
    $response->assertRedirect(route('shortlinks.show', $shortlink));

    $this->assertDatabaseHas('shortlinks', [
        'slug' => 'sensus-2026',
        'destination_url' => 'https://sensus.bps.go.id',
        'user_id' => $user->id,
    ]);
});
