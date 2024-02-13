<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\File;
use AlexAzartsev\Heroicon\Heroicon;

use Laravel\Nova\Http\Requests\NovaRequest;

class Element extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Element>
     */
    public static $model = \App\Models\Element::class;

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
        'id','name','content','Section.name',
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
            BelongsTo::make('Section', 'Section', Section::class),
            Text::make('Title','name')->sortable(),
            Trix::make('content')->alwaysShow(),
            Image::make('Image','image')->rules("image", "max:100000"),
            Text::make('Image Alt','image_alt')->sortable(),
            Heroicon::make('Icon','icon'),
            // File::make('Document', 'file')
            //     ->disk('public')
            //     ->storeOriginalName('file_name')
            //     ->download(function ($model) {
            //         return Storage::disk('public')->download($model->document_path);
            // }),
            // Text::make('file'),
            URL::make('URL','url'),
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
