<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class ThrottlePasswordResetRequests
{
    public function __construct(
        private readonly ThrottleRequests $throttleRequests,
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            $request->isMethod('POST')
            && $request->routeIs('password.email')
        ) {
            return $this->throttleRequests->handle(
                $request,
                $next,
                'password-reset-links',
            );
        }

        if (
            $request->isMethod('POST')
            && $request->routeIs('password.update')
        ) {
            return $this->throttleRequests->handle(
                $request,
                $next,
                'password-reset-attempts',
            );
        }

        return $next($request);
    }
}
