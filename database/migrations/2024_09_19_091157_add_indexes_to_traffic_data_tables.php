<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexesToTrafficDataTables extends Migration
{
    public function up()
    {
        // Add indexes to the traffic_data_nsw table
        Schema::table('traffic_data_nsw', function (Blueprint $table) {
            $table->index('event_id');    // Index for faster event lookups
            $table->index('latitude');    // Index for spatial filtering
            $table->index('longitude');   // Index for spatial filtering
        });

        // Add indexes to other tables (QLD, VIC, SA)
        Schema::table('traffic_data_vic', function (Blueprint $table) {
            $table->index('event_id');
            $table->index('latitude');
            $table->index('longitude');
        });

        Schema::table('traffic_data_qld', function (Blueprint $table) {
            $table->index('event_id');
            $table->index('latitude');
            $table->index('longitude');
        });

        Schema::table('traffic_data_sa', function (Blueprint $table) {
            $table->index('event_id');
            $table->index('latitude');
            $table->index('longitude');
        });

        // Index for consignment_events
        Schema::table('consignment_events', function (Blueprint $table) {
            $table->index('consignment_id');   // Faster lookup for consignment events
            $table->index('event_id');         // Faster lookup for events related to consignments
            $table->index('state');            // Faster lookup for filtering by state
        });
    }

    public function down()
    {
        // Drop indexes if rolling back
        Schema::table('traffic_data_nsw', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['latitude']);
            $table->dropIndex(['longitude']);
        });

        Schema::table('traffic_data_vic', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['latitude']);
            $table->dropIndex(['longitude']);
        });

        Schema::table('traffic_data_qld', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['latitude']);
            $table->dropIndex(['longitude']);
        });

        Schema::table('traffic_data_sa', function (Blueprint $table) {
            $table->dropIndex(['event_id']);
            $table->dropIndex(['latitude']);
            $table->dropIndex(['longitude']);
        });

        Schema::table('consignment_events', function (Blueprint $table) {
            $table->dropIndex(['consignment_id']);
            $table->dropIndex(['event_id']);
            $table->dropIndex(['state']);
        });
    }
}
