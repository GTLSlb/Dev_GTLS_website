<?php

namespace App\Nova;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Trix;
use Mostafaznv\NovaVideo\Video;
use Laravel\Nova\Fields\File;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\FormData;

class Blog extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Blog>
     */
    public static $model = \App\Models\Blog::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id','title','desc'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
    */
    public function fields(Request $request)
    {
        $fields = [
            ID::make()->sortable(),
    
            Text::make('Title', 'title')->sortable()->rules('required'),
    
            BelongsTo::make('Media Type', 'mediatype', MediaType::class)->hideFromIndex(),
    
            Image::make('Cover Image', 'cover_image')
                ->sortable()
                ->deletable(false)
                ->prunable()
                ->creationRules('required'),

            Image::make('Image', 'image')
            ->sortable()
            ->deletable(false)
            ->prunable()
            ->rules('sometimes')
            ->hideFromIndex()
            ->dependsOn('mediatype', function (Image $field, NovaRequest $request, FormData $formData) {
                if ($formData->mediatype == 1) {
                    $field->show()->rules('required');
                } else {
                    $field->hide();
                }
            }),

            File::make('Video','videoUrl')
                ->onlyOnForms()
                ->deletable(false)
                ->prunable()
                ->hideFromIndex()
                ->acceptedTypes('video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-matroska') // Allow only video files
                ->dependsOn('mediatype', function (File $field, NovaRequest $request, FormData $formData) {
                    if ($formData->mediatype == 2) {
                        $field->show()->creationRules('required');
                    } else {
                        $field->hide();
                    }
                }),

            Video::make('Video', 'videoUrl')->onlyOnDetail(),
            Text::make('Media Alt', 'image_alt')->sortable()->creationRules('required')->hideFromIndex(),
    
            Trix::make('Description', 'desc')->sortable()->rules('required'),
    
            Date::make('Date', 'date')->filterable()->rules('required'),
        ];
    
        return $fields;
    }

    public function isVideoType()
    {
        $resource = $this->resource;
    
        // Check if the resource has the mediatype relation loaded
        if (!$resource->relationLoaded('mediatype')) {
            // Load the relation if not already loaded
            $resource->load('mediatype');
        }
    
        // Get the mediatype relationship
        $mediatype = $resource->mediatype;
    
        // Debugging output
        if ($mediatype) {
            Log::info('MediaType:', ['name' => $mediatype->name]);
        } else {
            Log::info('MediaType is null');
        }
    
        // Check the value of the name attribute
        if ($mediatype && $mediatype->name === 'video') {
            return true;
        }
    
        return false;
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

    public function authorizedToReplicate(Request $request)
    {
        return false;
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
