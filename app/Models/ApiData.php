<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiData extends Model
{
    protected $table = 'api_data';

    protected $casts = [
        'geometry_coordinates' => 'array', // Cast to array or json
    ];

    protected $fillable = [
        'api_source',
        'event_id',
        'description',
        'start_date',
        'end_date',
        'latitude',
        'longitude',
        'suburb',
        'traffic_direction',
        'road_name',
        'status',
        'event_type',
        'impact',
        'source_url',
        'advice',
        'information',
        'lastUpdated_date',
        'otherAdvice',
        'event_category_id',
        'is_processing',
        'geometry_type',
        'geometry_coordinates',
    ];
}
