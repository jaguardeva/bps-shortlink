<?php

use App\Models\Shortlink;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('authenticated user can download qr code in svg format', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $shortlink = Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'test-qr-svg',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)
        ->get("/shortlinks/{$shortlink->id}/qr/download/svg");

    $response->assertOk();
    $response->assertHeader('content-type', 'image/svg+xml');
    $response->assertHeader('content-disposition', "attachment; filename=qrcode-{$shortlink->slug}.svg");
});

test('authenticated user can download qr code in png format', function () {
    Storage::fake('public');
    $user = User::factory()->create();
    $shortlink = Shortlink::create([
        'user_id' => $user->id,
        'slug' => 'test-qr-png',
        'destination_url' => 'https://mojokertokab.bps.go.id',
        'status' => 'active',
    ]);

    $response = $this->actingAs($user)
        ->get("/shortlinks/{$shortlink->id}/qr/download/png");

    $response->assertOk();
    $response->assertHeader('content-type', 'image/png');
    $response->assertHeader('content-disposition', "attachment; filename=qrcode-{$shortlink->slug}.png");
});
