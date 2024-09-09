<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ModifyGeometryCoordinatesColumnType extends Migration
{
    public function up()
    {
        Schema::table('api_data', function (Blueprint $table) {
            $table->json('geometry_coordinates')->change();
        });
    }

    public function down()
    {
        Schema::table('api_data', function (Blueprint $table) {
            $table->text('geometry_coordinates')->change(); // Revert to the previous type if needed
        });
    }
}
