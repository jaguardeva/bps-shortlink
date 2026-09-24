<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        if ($user->status !== 'active') {
            abort(403, 'Your account is inactive or suspended.');
        }

        if (empty($permissions)) {
            return $next($request);
        }

        if (! $user->hasAnyPermission($permissions)) {
            abort(403, 'Unauthorized access: missing required permission.');
        }

        return $next($request);
    }
}
