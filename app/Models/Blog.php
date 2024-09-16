<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Blog extends Model
{
    use HasFactory;
    protected $casts = [
        'date' => 'date'
    ];
    protected $fillable = ['title', 'date', 'slug'];

    public function mediatype()
    {
        return $this->belongsTo(MediaType::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($post) {
            $post->slug = Str::slug($post->title);
        });

        static::saving(function ($model) {
            if ($model->mediatype_id == 1) {
                // If media type is 1 (Image), set videoUrl to null
                if ($model->videoUrl) {
                    Storage::delete($model->videoUrl); // Delete the existing video file
                }
                $model->videoUrl = null;
            } elseif ($model->mediatype_id == 2) {
                // If media type is 2 (Video), set image to null
                if ($model->image) {
                    Storage::delete($model->image); // Delete the existing image file
                }
                $model->image = null;
            }
        });

    }
}
