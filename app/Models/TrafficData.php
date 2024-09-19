<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrafficData extends Model
{
    // Disable timestamps if not needed
    public $timestamps = true;

    // Default table will be overwritten by child models
    protected $table = '';

    // Fillable properties
    protected $fillable = [
        'api_source',
        'event_id',
        'description',
        'start_date',
        'end_date',
        'latitude',
        'location',
        'longitude',
        'geometry_type',
        'geometry_coordinates',
        'suburb',
        'traffic_direction',
        'road_name',
        'status',
        'event_category_id',
        'event_type',
        'impact',
        'source_url',
        'advice',
        'information',
    ];
}
