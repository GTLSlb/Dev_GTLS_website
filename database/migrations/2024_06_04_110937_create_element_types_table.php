<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('element_types', function (Blueprint $table) {
            $table->id();
            $table->string('typename');
            $table->boolean('contain_name');
            $table->boolean('contain_content');
            $table->boolean('contain_image');
            $table->boolean('contain_file');
            $table->boolean('contain_icon');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('element_types');
    }
};
