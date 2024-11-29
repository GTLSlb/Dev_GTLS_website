<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsignmentEvents extends Model
{
    protected $table = 'consignment_events';

    protected $fillable = [
        'event_id',
        'consignment_id',
        'state',
    ];
}