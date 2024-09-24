<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Cookie;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Console\View\Components\Alert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use SocialiteProviders\Manager\OAuth2\User as SocialiteUser;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AzureAuthController extends Controller
{

    public function handleCallback(Request $request)
    {
        if (session()->has('user')) {
            return redirect()->route('/landingPage');  // Redirect if session exists
        }
    
        // Proceed with the login flow if the session does not exist
        try {
            $socialiteUser = Socialite::driver('azure')->user();
            $accessToken = $socialiteUser->token;
            $expiresIn = $socialiteUser->expiresIn;
    
            // Send request to external API for validation
            $url = env('GTAM_API_URL') . "validate/MicrosoftToken";
            $headers = ['Authorization' => $accessToken];
    
            $response = Http::withHeaders($headers)->get($url);
    
            if ($response->successful()) {
                $responseJson = $response->json();
                session()->regenerate();
                session()->put('user', $responseJson);
                session()->put('user_id', $responseJson['UserId']);
                session()->put('newRoute', route('azurelogin'));
    
                // Insert into custom_sessions
                DB::table('custom_sessions')->insert([
                    'id' => session()->getId(),
                    'user_id' => $responseJson['UserId'],
                    'payload' => session()->get('_token'),
                    'user' => json_encode($responseJson),
                    'last_activity' => time(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
    
                return response()->json([
                    'message' => 'Login successful',
                    'access_token' => $accessToken,
                    'expires_in' => $expiresIn,
                    'user' => $responseJson,
                ]);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Authentication error: ' . $e->getMessage(),
            ], 500);
        }
    }
    

    public function sendToken(Request $request){
        $accessToken = $request->socialiteUser['accessToken'];
        $expiresIn = $request->socialiteUser['expiresOn'];

        // find the user in the database through API
        $url = env('GTAM_API_URL') . "validate/MicrosoftToken";

        $headers = [
            'Authorization' => $accessToken,
        ];

        // Send the logout request to the external API
        $response = Http::withHeaders($headers)->post($url);

        if ($response->successful()) {
            // $responseBody = $response->body();
            $responseJson = $response->json();

            $jsonString = json_encode($responseJson);

            $request->session()->regenerate();
            $request->session()->put('user', json_encode($responseJson[0]));
            $request->session()->put('user_id', $responseJson[0]['UserId']);
            $request->session()->put('newRoute', route('azure.login'));

            $sessionId = $request->session()->getId();
            $payload = $request->session()->get('_token');
            $userSession = $request->session()->get('user');
            $user = $jsonString;
            $lastActivity = time();

            DB::table('custom_sessions')->insert([
                'id' => $sessionId,
                'user_id' => $responseJson[0]['UserId'],
                'payload' => $payload,
                'user' => $userSession,
                'last_activity' => $lastActivity,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $request->session()->save();

            return response()->json([
                'message' => 'Login successful',
                'access_token' => $accessToken,
                'expires_in' => $expiresIn,
                'user' => $user,
            ]);
        }
    }

    public function azureLogout()
    {
        // Microsoft Azure AD Logout URL
        $azureLogoutUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/logout';

        // The URL to redirect back to after logout (your application's home or login page)
        $postLogoutRedirectUri = urlencode(route('home')); // Replace 'home' with your route name

        // Redirect to Microsoft Azure logout endpoint with post-logout redirect URL
        return redirect()->away($azureLogoutUrl . '?post_logout_redirect_uri=' . $postLogoutRedirectUri);
        // return redirect('/login');
    }
}

