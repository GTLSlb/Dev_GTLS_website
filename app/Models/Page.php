<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = [
        'id',
        'name',

    ];
    use HasFactory;
    public function sections()
    {
        return $this->hasMany(Section::class);
    }
}
