<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSpatialDataToStateTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add the 'location' column to each state table as a spatial data column (POINT)
        Schema::table('traffic_data_nsw', function (Blueprint $table) {
            $table->point('location')->nullable();
        });

        Schema::table('traffic_data_vic', function (Blueprint $table) {
            $table->point('location')->nullable();
        });

        Schema::table('traffic_data_qld', function (Blueprint $table) {
            $table->point('location')->nullable();
        });

        Schema::table('traffic_data_sa', function (Blueprint $table) {
            $table->point('location')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the 'location' column in each state table
        Schema::table('traffic_data_nsw', function (Blueprint $table) {
            $table->dropColumn('location');
        });

        Schema::table('traffic_data_vic', function (Blueprint $table) {
            $table->dropColumn('location');
        });

        Schema::table('traffic_data_qld', function (Blueprint $table) {
            $table->dropColumn('location');
        });

        Schema::table('traffic_data_sa', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
}
