<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SectionsType extends Model
{
    protected $table = 'sectionstype';
    protected $casts = [
        'permissions' => 'array'
    ];

    use HasFactory;
}
