<?php

namespace App\Nova;

use Illuminate\Http\Request;

use Laravel\Nova\Fields\Text;
use Mostafaznv\NovaVideo\Video;
use Laravel\Nova\Fields\TextArea;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\Image;
use Ayvazyan10\Imagic\Imagic;

use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\BelongsTo;

use InteractionDesignFoundation\NovaHtmlCodeField\HtmlCode;
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
        'id','name','page','description'
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
            // Image::make('Image','image')->disk('web')->path('sections')
            // ->storeOriginalName('image')
            // ->prunable()
            // ->preview(function ($value, $disk) {
            //     return url('/app/webimages/sections/' . $value);
            // })
            // ->thumbnail(function ($value, $disk) {
            //     // Convert the image to WebP for thumbnail
            //     $image = Image::class::make(storage_path("app/public/nova/posts/{$value}"));
            //     $image->encode('webp');
            //     return $image->encoded;
            // })
            
            Text::make('image_alt'),
            Text::make('video'),
            // Video::make(trans('Video'), 'video','web')->rules('file', 'max:1900000', 'mimes:mp4', 'mimetypes:video/mp4')
            // ->creationRules('required')
            // ->updateRules('nullable'),
            // Video::make('video'),
            
            Image::make('Background','background')->rules("image", "max:10000"),
            Text::make('file'),
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
