<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApiData extends Model
{
    protected $table = 'api_data';

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
    ];
}
