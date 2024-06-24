<?php

namespace App\Nova;

use Illuminate\Support\Facades\Auth;

use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Select;
use Mostafaznv\NovaVideo\Video;
use DigitalCreative\Filepond\Filepond;
use Laravel\Nova\Fields\TextArea;
use Laravel\Nova\Fields\Trix;
use Laravel\Nova\Fields\URL;
use Laravel\Nova\Fields\Image;
use Laravel\Nova\Fields\Select;

use Laravel\Nova\Fields\HasMany;
use Laravel\Nova\Fields\BelongsTo;
use Illuminate\Support\Facades\DB;

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
            ID::make()->sortable(),
            Text::make('name')->sortable(),
            BelongsTo::make('Page', 'page', Page::class),
            BelongsTo::make('SectionType','sectiontype',SectionsType::class),
            HasMany::make('Elements', 'elements', Element::class),
            Trix::make('description')
                ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                    $sectionTypeId = (int) $formData->sectiontype;
            
                    // Query the database to check the contain_description field
                    $sectionType = DB::table('sectionstype')->find($sectionTypeId);
            
                    if ($sectionType && $sectionType->contain_description == 1) {
                        $field->rules([
                            'required',
                        ]);
                    } else {
                        $field->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                    }
                }),
            Image::make('Image','image')
            ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                $sectionTypeId = (int) $formData->sectiontype;
        
                // Query the database to check the contain_description field
                $sectionType = DB::table('sectionstype')->find($sectionTypeId);
        
                if ($sectionType && $sectionType->contain_image == 1) {
                    $field->rules([
                        'required',
                    ]);
                } else {
                    $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                }
            })
            ->rules("image", "max:10000"),
            Video::make('video')
                ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                $sectionTypeId = (int) $formData->sectiontype;
        
                // Query the database to check the contain_description field
                $sectionType = DB::table('sectionstype')->find($sectionTypeId);
        
                if ($sectionType && $sectionType->contain_video == 1) {
                    $field->rules([
                        'required','max:150000'
                    ]);
                } else {
                    $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                }
            }),
            Text::make('image_alt')->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                $sectionTypeId = (int) $formData->sectiontype;
        
                // Query the database to check the contain_description field
                $sectionType = DB::table('sectionstype')->find($sectionTypeId);
        
                if ($sectionType && $sectionType->contain_image == 1) {
                    $field->rules([
                        'required'
                    ])->help('Required For the Image');
                } else {
                    $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                }
            }),           
            Image::make('Background','background')->rules("image", "max:10000")
                ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                    $sectionTypeId = (int) $formData->sectiontype;
            
                    // Query the database to check the contain_description field
                    $sectionType = DB::table('sectionstype')->find($sectionTypeId);
            
                    if ($sectionType && $sectionType->contain_background == 1) {
                        $field->rules([
                            'required'
                        ]);
                    } else {
                        $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                    }
                }),
            Text::make('file')
                ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                    $sectionTypeId = (int) $formData->sectiontype;
            
                    // Query the database to check the contain_description field
                    $sectionType = DB::table('sectionstype')->find($sectionTypeId);
            
                    if ($sectionType && $sectionType->contain_file == 1) {
                        $field->rules([
                            'required'
                        ]);
                    } else {
                        $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                    }
                }),
            Text::make('URL','url')
                ->dependsOn('sectiontype', function ($field, NovaRequest $request, $formData) {
                    $sectionTypeId = (int) $formData->sectiontype;
            
                    // Query the database to check the contain_description field
                    $sectionType = DB::table('sectionstype')->find($sectionTypeId);
            
                    if ($sectionType && $sectionType->contain_url == 1) {
                        $field->rules([
                            'required'
                        ]);
                    } else {
                        $field->hide()->hideFromDetail()->hideFromIndex()->hideFromDetail()->hideWhenCreating()->hideWhenUpdating();
                    }
                }),

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
