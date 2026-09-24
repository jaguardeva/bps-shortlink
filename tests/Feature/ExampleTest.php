<?php

test('guest is redirected to dashboard when visiting home and login when visiting dashboard', function () {
    $this->get(route('home'))->assertRedirect('/dashboard');
    $this->get('/dashboard')->assertRedirect('/login');
});

test('login page returns a successful response', function () {
    $response = $this->get('/login');

    $response->assertOk();
});
