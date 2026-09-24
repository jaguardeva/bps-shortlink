<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AuthController extends Controller
{
    public function login()
    {
        return Inertia::render('auth/login');
    }

    public function register()
    {
        return Inertia::render('auth/register');
    }
}
