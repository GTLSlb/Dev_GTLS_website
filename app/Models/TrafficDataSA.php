<?php

namespace App\Models;

class TrafficDataSA extends TrafficData
{
    protected $table = 'traffic_data_sa'; // Specify the table for SA

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
