<?php

namespace App\Http\Middleware;

use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Session\Session;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

class CustomAuth extends Middleware
{
    /**
     * Attempt to authenticate a user using the given credentials.
     *
     * @param  array  $credentials
     * @return bool
     */

    //  protected $guard;

    public function __construct()
    {
        //$this->guard = $guard;
    }

    public function attempt(array $credentials = [], $remember = false)
    {
        $emailDb = $credentials['EmailDb'];
        $passwordDb = $credentials['PasswordDb'];
        $emailInput = $credentials['EmailInput'];
        $passwordInput = $credentials['PasswordInput'];
        // Compare the provided credentials with the user's credentials

        if (strtolower($emailDb) == strtolower($emailInput)) {
            return true; // Validation successful
        }

        return false;
    }

    public function handle($request, Closure $next, ...$guards)
    {
        $hasSession = $request->hasSession();
        if ($hasSession) {
            $sessionId = $request->session()->getId();
            
            // Query the database to get the user based on the session ID
            $user = DB::table('custom_sessions')
                ->where('id', $sessionId)
                ->value('user');
    
            //dd($user);
            $sessionToken = $request->session()->token();
            $path = $request->path();
            $request->headers->set('X-CSRF-TOKEN', csrf_token());
            // Allow access to the login route
            if ($path == 'login' || $path == 'loginapi' || $path == 'forgot-password' || $path == 'logoutAPI') {
                return $next($request);
            }
            if($request->session()->has('user')==false) {
                return redirect('/login');
            }
        } else {
            //dd('$request');
            if ($request->path() == 'login' || $request->path() == 'loginapi') {
                return $next($request);
            }


        }
        return $next($request);
    }

    protected function verifyCsrfToken($token)
    {
        // Implementation using Laravel's built-in CSRF token verification:
        return hash_equals($token, csrf_token());
    }
}
?>
