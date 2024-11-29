<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('consignments_tracking', function (Blueprint $table) {
            $table->id();
            $table->integer('ConsignmentId');
            $table->string('ConsignmentNo', 255);
            $table->integer('DebtorId');
            $table->string('DebtorName', 255);
            $table->string('SenderName', 255);
            $table->string('SenderState', 255);
            $table->string('SenderSuburb', 255);
            $table->string('SenderPostcode', 255);
            $table->string('SenderAddressName', 255);
            $table->string('ReceiverName', 255);
            $table->string('ReceiverState', 255);
            $table->string('ReceiverSuburb', 255);
            $table->string('ReceiverPostcode', 255);
            $table->string('ReceiverAddressName', 255);
            $table->timestamp('DespatchDate')->nullable();
            $table->timestamp('RDD')->nullable();
            $table->json('Coordinates');
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
        Schema::dropIfExists('consignments_tracking');
    }
};
