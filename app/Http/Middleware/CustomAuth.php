<?php

namespace App\Http\Middleware;

use Illuminate\Auth\SessionGuard;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Http;
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

    public function validateAccessToken($accessToken, $userId){
        $url = $_ENV['GTAM_API_URL'] . 'Validate/Session';

        $headers = [
            'UserId' => $userId,
            'Token' => $accessToken,
        ];
        $response = Http::withHeaders($headers)->get($url);
        switch ($response->status()) {
            case 200:
                return true;
            case 400:
                // Handle unauthorized access
                return false;
            default:
                // Handle other status codes
                return false;
        }
    }

    public function handle($request, $next, ...$guards)
    {
        $hasSession = $request->hasSession();
        if ($hasSession) {
            $path = $request->path();
            $accessToken = $_COOKIE['access_token'] ?? false;
            $userId = $request->session()->get('user') ?? false;
            $request->headers->set('X-CSRF-TOKEN', csrf_token());

            if(($path == 'loginComp' || $path == 'login' || $path == 'loginapi') && $userId && $accessToken){
                $isValid = $this->validateAccessToken($accessToken, $userId['UserId']);
                // dd($isValid);
                if($isValid){
                    return redirect($_ENV['REDIRECT_ROUTE']);
                }
            }
            // Allow access to the login route
            if($request->getBasePath() == ""){
                return $next($request);
            }
            if ($path == 'loginComp' || $path == 'failed-login' || $path == 'login' || $path == 'loginapi' || $path == 'forgot-password' || $path == 'auth/azure' || $path == 'auth/azure/callback' || $path == 'microsoftToken' || $path == 'logoutWithoutRequest') {
                return $next($request);
            }
            if ($path !== 'login' && $path != 'failed-login' && $path !== 'loginapi' && $path !== 'forgot-password' && !$request->session()->has('user')) {
                return redirect()->route('login');
            }
        } else {
            if ($request->path() == 'login' || $request->path() == 'loginapi' || $request->path() == '/auth/azure' || $request->path() == 'auth/azure/callback' || $request->path() == 'microsoftToken'  || $request->path() == 'logoutWithoutRequest' ) {
                return $next($request);
            }
        }
        return $next($request);
    }


    // public function handle($request, $next, ...$guards)
    // {
    //     $hasSession = $request->hasSession();

    //     if ($hasSession) {
    //         $path = $request->path();
    //         $request->headers->set('X-CSRF-TOKEN', csrf_token());

    //         $accessToken = $_COOKIE['access_token'] ?? false;
    //         $userId = $request->session()->get('user') ?? false;

    //         // check if user's token is valid & is on login route
    //         if(($path == 'loginComp' || $path == 'login' || $path == 'loginapi') && $userId && $accessToken){
    //             $isValid = $this->validateAccessToken($accessToken, $userId['UserId']);
    //             if(!$isValid){
    //                 //redirect to login
    //                 return redirect()->route('login');
    //             }else{
    //                 //stay inside the system
    //                 return redirect($_ENV['REDIRECT_ROUTE']);
    //             }
    //         }
    //         else{
    //             // Allow access to the login route
    //             if ($path == 'loginComp' || $path == 'login' || $path == 'loginapi' || $path == 'forgot-password' || $path == 'auth/azure' || $path == 'auth/azure/callback' || $path == 'microsoftToken' || $path == 'logoutWithoutRequest') {
    //                 return $next($request);
    //             }
    //             if ($path !== 'login' && $path !== 'loginapi' && $path !== 'forgot-password' && !$request->session()->has('user')) {
    //                 return redirect()->route('login');
    //             }
    //         }
    //     } else {
    //         if ($request->path() == 'login' || $request->path() == 'loginapi' || $request->path() == '/auth/azure' || $request->path() == 'auth/azure/callback' || $request->path() == 'microsoftToken' || $request->path() == 'logoutWithoutRequest') {
    //             return $next($request);
    //         }


    //     }
    //     return $next($request);
    // }

    protected function verifyCsrfToken($token)
    {
        // Implementation using Laravel's built-in CSRF token verification:
        return hash_equals($token, csrf_token());
    }
}
?>
