<?php

namespace App\Services;
use App\Models\ConsData;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ConsServices
{
    public function getCons()
    {
        try {
            // Drop and recreate the table
            $this->resetConsignmentsTable();

            // Fetch data from the API
            $response = Http::timeout(40)->withHeaders([
                'UserId' => '1',
            ])->get("https://gtlslebs06-vm.gtls.com.au:5829/api/v2/GTRS/Traffic/Consignments");

            if ($response->successful()) {
                $data = $response->json();

                foreach ($data as $consignment) {
                    try {
                        $newCons = new ConsData($consignment);
                        $newCons->save();
                    } catch (\Exception $e) {
                        Log::error('Error Saving Consignments. ' . $e->getMessage());
                    }
                }
                return $data;
            } else {
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('Error Fetching Consignments. ' . $e->getMessage());
        }
    }

    private function resetConsignmentsTable()
    {
        // Drop the table if it exists
        if (Schema::hasTable('consignments_tracking')) {
            Schema::drop('consignments_tracking');
        }

        // Recreate the table
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
}
