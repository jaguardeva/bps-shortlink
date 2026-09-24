<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        if ($user->status !== 'active') {
            abort(403, 'Your account is inactive or suspended.');
        }

        if (empty($roles)) {
            return $next($request);
        }

        if (! $user->hasAnyRole($roles)) {
            abort(403, 'Unauthorized access: insufficient role permissions.');
        }

        return $next($request);
    }
}
