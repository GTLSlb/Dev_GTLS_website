<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Http\Requests\NovaRequest;

class SectionsType extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\SectionsType>
     */
    public static $model = \App\Models\SectionsType::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'typename';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','typename'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function fields(NovaRequest $request)
    {
        return [
            // ID::make()->sortable(),
            Text::make('Type Name', 'typename')->sortable(),
            Boolean::make('Contain Name','contain_name')->sortable(),
            Boolean::make('Contain Description','contain_description')->sortable(),
            Boolean::make('Contain Image','contain_image')->sortable(),
            Boolean::make('Contain Video','contain_video')->sortable(),
            Boolean::make('Contain Background','contain_background')->sortable(),
            Boolean::make('Contain File','contain_file')->sortable(),
            Boolean::make('Contain URL','contain_url')->sortable(),
        ];
    }





    public static function availableForNavigation(Request $request)
    {
        $user = $request->user();
        // Check if the user has an admin role
        return $user && $user->role_id == 1;
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */

     
    public function cards(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function filters(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function lenses(NovaRequest $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */
    public function actions(NovaRequest $request)
    {
        return [];
    }
}
