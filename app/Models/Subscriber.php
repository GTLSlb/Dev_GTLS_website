<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory;

    protected $table = 'subscribers';

    protected $fillable = [
        'email',
        'status',
        'first_send',
        'updated_at',
    ];

    protected $casts = [
        'updated_at' => 'date', 
        'first_send' => 'boolean', 
    ];

    public $timestamps = false; 
}
