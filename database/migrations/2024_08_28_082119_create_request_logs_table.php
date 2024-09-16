<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('request_logs', function (Blueprint $table) {
            $table->id();
            $table->string('method'); // HTTP method (GET, POST, etc.)
            $table->string('url'); // Requested URL
            $table->json('parameters')->nullable(); // Request parameters
            $table->integer('response_status')->nullable(); // HTTP status code of the response
            $table->timestamp('request_time')->useCurrent(); // Time of the request
            $table->timestamps(); // Created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_logs');
    }
};
