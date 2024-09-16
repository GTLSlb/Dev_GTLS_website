<?php

namespace App\Providers;


use App\Nova\User;
use Illuminate\Support\Facades\Gate;
use Laravel\Nova\Nova;
use Laravel\Nova\Menu\Menu;
use Laravel\Nova\Menu\MenuItem;
use Laravel\Nova\Menu\MenuSection;
use Laravel\Nova\Dashboards\Main;
use Illuminate\Support\Facades\Blade;

use Laravel\Nova\NovaApplicationServiceProvider;

class NovaServiceProvider extends NovaApplicationServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();
        // Nova::withBreadcrumbs();
        // Nova::withoutThemeSwitcher();
        Nova::footer(function ($request) {
            return Blade::render('
                @env(\'prod\')
                    This is production!
                @endenv
            ');
        });
        // Nova::report(function ($exception) {
        //     if (app()->bound('sentry')) {
        //         app('sentry')->captureException($exception);
        //     }
        // });
        
        // Nova::mainMenu(function () {            
        //     return [                
        //         MenuSection::dashboard(Main::class)->icon('chart-bar'),                
        //         MenuSection::make('Customers', [                    
        //             MenuItem::resource(User::class),                   
        //             ])->icon('user')->collapsable(),                
             
        //             ];        
        //     });
    }

    /**
     * Register the Nova routes.
     *
     * @return void
     */
    protected function routes()
    {
        Nova::routes()
                ->withAuthenticationRoutes()
                ->withPasswordResetRoutes()
                ->register();
    }
    protected function saving()
    {
        Nova::serving(function (ServingNova $event) {
            Post::saving(function (Section $section) {
                // Convert image to WebP format before saving
                $image = \Image::make(storage_path("app/webimages/sections/{$section->image_path}"));
                $image->encode('webp');
                $section->image_path = $section->image_path . '.webp';
                Storage::disk('web')->put("sections/{$section->image_path}", $image->encoded);
            });
        });
    }

    

    /**
     * Register the Nova gate.
     *
     * This gate determines who can access Nova in non-local environments.
     *
     * @return void
     */
    protected function gate()
    {
        Gate::define('viewNova', function ($user) {
            return in_array($user->email, [
                //
            ]);
        });
    }

    /**
     * Get the dashboards that should be listed in the Nova sidebar.
     *
     * @return array
     */
    protected function dashboards()
    {
        return [
            new \App\Nova\Dashboards\Main,
        ];
    }

    /**
     * Get the tools that should be listed in the Nova sidebar.
     *
     * @return array
     */
    public function tools()
    {
        return [];
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
