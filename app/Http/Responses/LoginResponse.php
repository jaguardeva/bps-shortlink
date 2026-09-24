<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request): Response
    {
        $intended = $request->session()->get('url.intended');

        // Clear intended URL if it contains login or password routes to prevent loops
        if ($intended && (str_contains($intended, '/login') || str_contains($intended, '/password'))) {
            $request->session()->forget('url.intended');
            $intended = null;
        }

        // Return Inertia / HTTP redirect to dashboard
        return redirect()->intended(route('dashboard'));
    }
}
