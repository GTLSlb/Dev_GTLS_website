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
use Illuminate\Support\Facades\DB;
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
        $fields = [
            // Other fields...
    
            ID::make()->hideFromIndex(),
            BelongsTo::make('Section', 'Section', Section::class),
            BelongsTo::make('ElementType','elementtype',ElementTypes::class),
            Text::make('Title','name')->sortable()
            ->dependsOn('elementtype', function ($field, NovaRequest $request, $formData) {
                $elementtypeId = (int) $formData->elementtype;
                
                // Query the database to check the contain_description field
                $elementType = DB::table('element_types')->find($elementtypeId);
                
                if ($elementType && $elementType->contain_name == 1) {
                    $field->rules([
                        'required',
                    ]);
                } else {
                    $field->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                }
            }),
            Trix::make('content')->alwaysShow()->dependsOn('elementtype', function ($field, NovaRequest $request, $formData) {
                $elementtypeId = (int) $formData->elementtype;
        
                // Query the database to check the contain_description field
                $elementType = DB::table('element_types')->find($elementtypeId);
               
                if ($elementType && $elementType->contain_content == 1) {
                    $field->rules([
                        'required',
                    ]);
                } else {
                    $field->hide();
                }
            }),
            Image::make('Image','image')
            ->dependsOn('elementtype', function ($field, NovaRequest $request, $formData) {
                $elementtypeId = (int) $formData->elementtype;
        
                // Query the database to check the contain_description field
                $elementType = DB::table('element_types')->find($elementtypeId);
               
                if ($elementType && $elementType->contain_image == 1) {
                    $field->rules("required","image", "max:100000");
                } else {
                    $field->hide();
                }
            }),
            Text::make('Image Alt','image_alt')->sortable()
            ->dependsOn('elementtype', function ($field, NovaRequest $request, $formData) {
                $elementtypeId = (int) $formData->elementtype;
        
                // Query the database to check the contain_description field
                $elementType = DB::table('element_types')->find($elementtypeId);
               
                if ($elementType && $elementType->contain_image == 1) {
                    $field->rules("required");
                } else {
                    $field->hide();
                }
            }),
            $this->hasIconField() ? 
            Heroicon::make('Icon', 'icon')
                ->rules('required', 'image', 'max:100000') 
            : null,
            URL::make('URL','url')
            ->dependsOn('elementtype', function ($field, NovaRequest $request, $formData) {
                $elementtypeId = (int) $formData->elementtype;
        
                // Query the database to check the contain_description field
                $elementType = DB::table('element_types')->find($elementtypeId);
               
                if ($elementType && $elementType->contain_url == 1) {
                    $field->rules("required","image", "max:100000");
                } else {
                    $field->hide();
                }
            }),
        ];
        return array_filter($fields);

    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Laravel\Nova\Http\Requests\NovaRequest  $request
     * @return array
     */

// In your Nova resource
    public function hasIconField()
    {
        $resource = $this->resource;

        // Check if the resource has the elementtype relation loaded
        if ($resource->relationLoaded('elementtype')) {
            $elementType = $resource->elementtype;
        } else {
            // Load the relation if not already loaded
            $elementType = $resource->elementtype()->first();
        }

        // Check the value of a specific attribute of elementType
        if ($elementType && $elementType->contain_icon == 1) {
            return true;
        }

        return false;
    }

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
