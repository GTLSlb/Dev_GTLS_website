<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventsCategory extends Model
{
    protected $table = 'events_category';

    protected $fillable = [
        'event_category'
    ];
}
