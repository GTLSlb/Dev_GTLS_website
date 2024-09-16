<?php
namespace App\Http\Middleware;

use Closure;
use App\Models\UserVisit;
use Illuminate\Http\Request;

class LogUserVisit
{
    public function handle(Request $request, Closure $next)
    {
        UserVisit::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'visited_page' => $request->url(),
        ]);

        return $next($request);
    }
}