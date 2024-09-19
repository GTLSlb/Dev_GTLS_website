<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApiDataStateTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create table for NSW
        Schema::create('traffic_data_nsw', function (Blueprint $table) {
            $table->id();
            $table->string('api_source');
            $table->string('event_id')->unique();
            $table->text('description')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('geometry_type')->nullable();
            $table->json('geometry_coordinates')->nullable();
            $table->string('suburb')->nullable();
            $table->string('traffic_direction')->nullable();
            $table->string('road_name')->nullable();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('event_category_id')->nullable();
            $table->string('event_type')->nullable();
            $table->string('impact')->nullable();
            $table->string('source_url')->nullable();
            $table->string('advice')->nullable();
            $table->text('information')->nullable();
            $table->timestamps();
        });

        // Create table for QLD
        Schema::create('traffic_data_qld', function (Blueprint $table) {
            $table->id();
            $table->string('api_source');
            $table->string('event_id')->unique();
            $table->text('description')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('geometry_type')->nullable();
            $table->json('geometry_coordinates')->nullable();
            $table->string('suburb')->nullable();
            $table->string('traffic_direction')->nullable();
            $table->string('road_name')->nullable();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('event_category_id')->nullable();
            $table->string('event_type')->nullable();
            $table->string('impact')->nullable();
            $table->string('source_url')->nullable();
            $table->string('advice')->nullable();
            $table->text('information')->nullable();
            $table->timestamps();
        });

        // Create table for VIC
        Schema::create('traffic_data_vic', function (Blueprint $table) {
            $table->id();
            $table->string('api_source');
            $table->string('event_id')->unique();
            $table->text('description')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('geometry_type')->nullable();
            $table->json('geometry_coordinates')->nullable();
            $table->string('suburb')->nullable();
            $table->string('traffic_direction')->nullable();
            $table->string('road_name')->nullable();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('event_category_id')->nullable();
            $table->string('event_type')->nullable();
            $table->string('impact')->nullable();
            $table->string('source_url')->nullable();
            $table->string('advice')->nullable();
            $table->text('information')->nullable();
            $table->timestamps();
        });

        // Create table for SA
        Schema::create('traffic_data_sa', function (Blueprint $table) {
            $table->id();
            $table->string('api_source');
            $table->string('event_id')->unique();
            $table->text('description')->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->string('geometry_type')->nullable();
            $table->json('geometry_coordinates')->nullable();
            $table->string('suburb')->nullable();
            $table->string('traffic_direction')->nullable();
            $table->string('road_name')->nullable();
            $table->string('status')->nullable();
            $table->unsignedBigInteger('event_category_id')->nullable();
            $table->string('event_type')->nullable();
            $table->string('impact')->nullable();
            $table->string('source_url')->nullable();
            $table->string('advice')->nullable();
            $table->text('information')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('traffic_data_nsw');
        Schema::dropIfExists('traffic_data_qld');
        Schema::dropIfExists('traffic_data_vic');
        Schema::dropIfExists('traffic_data_sa');
    }
}
