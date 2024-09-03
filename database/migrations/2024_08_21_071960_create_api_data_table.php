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
        Schema::create('api_data', function (Blueprint $table) {
            $table->id(); // Primary key
        
            // Common Fields
            $table->string('api_source')->comment('Source of the data (SA, NSW, QLD)');
            $table->string('event_id')->nullable()->comment('Unique identifier for the event');
            $table->text('description')->nullable()->comment('Description of the event');
            $table->timestamp('start_date')->nullable()->comment('Start date of the event');
            $table->timestamp('end_date')->nullable()->comment('End date of the event');
            $table->decimal('latitude', 10, 7)->nullable()->comment('Latitude of the event location');
            $table->decimal('longitude', 10, 7)->nullable()->comment('Longitude of the event location');
            $table->string('suburb')->nullable()->comment('Suburb or locality of the event');
            $table->string('traffic_direction')->nullable()->comment('Direction of traffic affected');
            $table->string('road_name')->nullable()->comment('Name of the road affected');
        
            // Additional Fields for Each API
            $table->string('status')->nullable()->comment('Status of the event');
            $table->string('event_type')->nullable()->comment('Type of event (roadworks, incident, etc.)');
            $table->string('impact')->nullable()->comment('Impact of the event (e.g., closures, delays)');
            $table->string('source_url')->nullable()->comment('URL to the original source or more information');
        
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_data');
    }
};
