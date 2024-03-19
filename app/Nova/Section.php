<?php

namespace App\Nova;

use Illuminate\Support\Facades\Auth;

use Laravel\Nova\Fields\Text;
use Mostafaznv\NovaVideo\Video;
use DigitalCreative\Filepond\Filepond;
use Laravel\Nova\Fields\TextArea;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;

use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\BelongsTo;

use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;


class Section extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Section>
     */
    public static $model = \App\Models\Section::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','name','Page.name','description'
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
            ID::make()->hideFromIndex(),
            Text::make('name')->sortable(),
            BelongsTo::make('Page', 'page', Page::class),
            HasMany::make('Elements', 'elements', Element::class),
            Trix::make('description')->alwaysShow(),
            Image::make('Image','image')->rules("image", "max:10000"),
            Video::make('video')->rules('max:150000'),
            Text::make('image_alt'),            
            Image::make('Background','background')->rules("image", "max:10000"),
            Text::make('file'),
            Text::make('URL','url'),
            Select::make('Status')->options([
                '1' => 'Active',
                '2' => 'Inactive',
            ])->displayUsingLabels()->canSee(function ($request) {
                $resourceID = $request->resourceId;
                // dd($resourceID);
                switch($resourceID){
                    case 29:
                        return true;
                    default:
                        return false;
                }
            }),
        ];
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
    public static function availableForNavigation($request)
    {
        // Get the currently authenticated user.
        $user = Auth::user();

        // Check if the user's role_id is 1.
        // If the role_id is 1, then the resource will not be available for navigation.
        return $user->role_id == 1;
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
