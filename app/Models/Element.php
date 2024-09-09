<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Element extends Model
{
    use HasFactory;
    
    protected $casts = [
        'date' => 'date'
    ];
    
    public function Section()
    {
        return $this->belongsTo(Section::class);
    }
    public function elementtype()
    {
        return $this->belongsTo(ElementTypes::class);
    }
}
