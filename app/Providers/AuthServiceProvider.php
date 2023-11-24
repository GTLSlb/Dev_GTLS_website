<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use Illuminate\Support\ServiceProvider;
use Illuminate\Contracts\Auth\UserProvider;
use App\Providers\CustomAuthServiceProvider;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use App\Http\Middleware\CustomAuth;
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function register(): void
    {
        $this->app->bind(ServiceProvider::class, CustomAuth::class);
    }

    public function boot(): void
    {

        $this->register();
        
        // you can choose a different name
        Auth::provider('external', function ($app, array $config) {
            return new CustomAuthServiceProvider();
        });
    }

}
