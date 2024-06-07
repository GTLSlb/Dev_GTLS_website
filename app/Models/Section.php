<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    public function page()
    {
        return $this->belongsTo(Page::class);
    }
    public function sectiontype()
    {
        return $this->belongsTo(SectionsType::class);
    }

    public function elements()
    {
        return $this->hasMany(Element::class);
    }
    protected $fillable = [
        'name',
        'image',
    ];
}
