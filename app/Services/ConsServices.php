<?php

namespace App\Services;
use App\Http\Controllers\ApiController;
use App\Models\ConsData;
use App\Models\ConsignmentEvents;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class ConsServices
{
    public function getCons()
    {
        try {
            Log::info('Starting to fetch consignments.');

            // Drop and recreate the table
            $this->resetConsingmentEventsTable();
            $this->resetConsignmentsTable();
            
            // Fetch data from the API
            $response = Http::timeout(40)->withHeaders([
                'UserId' => '1',
            ])->get("https://gtlslebs06-vm.gtls.com.au:5829/api/v2/GTRS/Traffic/Consignments");

            if ($response->successful()) {
                Log::info('Successfully fetched consignments from API.');
                $data = $response->json();

                foreach ($data as $consignment) {
                    try {
                        $newCons = new ConsData($consignment);
                        $newCons->save();
                    } catch (\Exception $e) {
                        Log::error('Error Saving Consignments: ' . $e->getMessage());
                    }
                }
                $this->getRoutesForAllConsData();
                return $data;
            } else {
                Log::warning('Failed to fetch consignments from API: ' . $response->status());
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('Error Fetching Consignments: ' . $e->getMessage());
        }
    }

    private function resetConsignmentsTable()
    {
        Log::info('Resetting consignments table.');

        // Drop the table if it exists
        if (Schema::hasTable('consignments_tracking')) {
            Schema::drop('consignments_tracking');
            Log::info('Dropped existing consignments_tracking table.');
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
        Log::info('Recreated consignments_tracking table.');
    }

    private function resetConsingmentEventsTable(){        
        Log::info('Resetting consignment_events table.');
        // Drop the table if it exists
        if (Schema::hasTable('consignment_events')) {
            Schema::drop('consignment_events');
            Log::info('Dropped existing consignment_events table.');
        }

        Schema::create('consignment_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_id', 255);
            $table->string('consignment_id', 255);
            $table->timestamps();
        });
        Log::info('Recreated consignment_events table.');
    }

    function getRouteUsingRoutesAPI($startLat, $startLng, $endLat, $endLng) // todo: get them from the getCons but currently they are static from th request
    {
        Log::info('Calculating route using Routes API.');
        $apiservice = new ApiService();
        $apiController = new ApiController($apiservice);
        $request = new Request(); 
    
        // Call the index method to get the marker positions
        $response = $apiController->index($request);
        Log::info('Fetched marker positions from index function.');

        // Extract marker positions from the response (assuming it returns a JSON response)
        $markerPositions = json_decode($response->getContent(), true);

        // Validate coordinates
        $startLatNum = floatval($startLat);
        $startLngNum = floatval($startLng);
        $endLatNum = floatval($endLat);
        $endLngNum = floatval($endLng);

        Log::info("Validated coordinates: Start ($startLatNum, $startLngNum), End ($endLatNum, $endLngNum).");

        if (
            is_nan($startLatNum) ||
            is_nan($startLngNum) ||
            is_nan($endLatNum) ||
            is_nan($endLngNum)
        ) {
            Log::error("Invalid coordinates provided.");
            return;
        }

        // Fetch addresses using reverse geocoding
        $fetchedStartAddress = $this->reverseGeocode($startLatNum, $startLngNum);
        $fetchedEndAddress = $this->reverseGeocode($endLatNum, $endLngNum);

        if (!$fetchedStartAddress || !$fetchedEndAddress) {
            Log::error("Failed to retrieve one or both locations.");
            return;
        }
        Log::info("Fetched addresses: Start ($fetchedStartAddress), End ($fetchedEndAddress).");

        // Call the Google Routes API
        $apiKey = "AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go"; // todo: Replace with your actual API key
        $url = "https://routes.googleapis.com/directions/v2:computeRoutes";
        $headers = [
            "Content-Type: application/json",
            "X-Goog-Api-Key: $apiKey",
            "X-Goog-FieldMask: routes",
        ];

        $postData = json_encode([
            'origin' => [
                'location' => [
                    'latLng' => [
                        'latitude' => $startLatNum,
                        'longitude' => $startLngNum,
                    ],
                ],
            ],
            'destination' => [
                'location' => [
                    'latLng' => [
                        'latitude' => $endLatNum,
                        'longitude' => $endLngNum,
                    ],
                ],
            ],
            'travelMode' => "DRIVE",
            'polylineQuality' => "HIGH_QUALITY",
        ]);
        Log::info("Calling Google Routes API with data: $postData");

        // cURL request setup
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        Log::info("Received response from Google Routes API: " . json_encode($data));

        if (isset($data['routes']) && count($data['routes']) > 0) {
            $polylinePoints = $data['routes'][0]['polyline']['encodedPolyline'];
            $decodedPath = $this->decodePolyline($polylinePoints);

            $route = array_map(function ($point) {
                return ['lat' => $point['lat'], 'lng' => $point['lng']];
            }, $decodedPath);

            Log::info("Decoded route polyline.");

            // Filter events on the route
            $eventsOnRoad = array_filter($markerPositions, function ($marker) use ($route) {
                foreach ($route as $index => $point) {
                    if ($index === count($route) - 1) return false; // No segment after the last point
                    $distance = $this->getPerpendicularDistanceToSegment($marker, $point, $route[$index + 1]);
                    if ($distance <= 10) return true; // Adjust the tolerance value (in meters) as needed
                }
                return false;
            });
            $isRouteClear = count($eventsOnRoad) === 0;
            return $eventsOnRoad;
            

            Log::info('Route analysis complete. Events on road: ' . json_encode($eventsOnRoad));
        } else {
            Log::error("No valid routes found.");
        }
    }
    function getPerpendicularDistanceToSegment($point, $lineStart, $lineEnd)
    {
        // Log calculation of perpendicular distance

        $x1 = $lineStart['lat'];
        $y1 = $lineStart['lng'];
        $x2 = $lineEnd['lat'];
        $y2 = $lineEnd['lng'];
        $px = $point['lat'];
        $py = $point['lng'];

        $dx = $x2 - $x1;
        $dy = $y2 - $y1;
        $magnitude = $dx * $dx + $dy * $dy;
        $u = (($px - $x1) * $dx + ($py - $y1) * $dy) / $magnitude;

        if ($u < 0) {
            $u = 0;
        } else if ($u > 1) {
            $u = 1;
        }

        $closestX = $x1 + $u * $dx;
        $closestY = $y1 + $u * $dy;

        $dist = sqrt(pow($closestX - $px, 2) + pow($closestY - $py, 2));

        // Convert distance from degrees to meters (using a rough estimate)
        $metersPerDegreeLat = 111320;
        $metersPerDegreeLng = 111320 * cos(deg2rad($x1));
        $distanceInMeters = $dist * sqrt($metersPerDegreeLat * $metersPerDegreeLng);

        return $distanceInMeters;
    }
    function reverseGeocode($lat, $lng)
    {
        $apiKey = "AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go"; // Ensure your API key is set in the .env file
    
        try {
            // Make sure that both latitude and longitude are provided
            if (!$lat || !$lng) {
                error_log("Latitude and Longitude are required");
                return null;
            }
    
            // Make the HTTP request to the Google Geocoding API directly
            $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
                'latlng' => "{$lat},{$lng}",
                'key' => $apiKey,
            ]);
    
            // Check if the request was successful and handle the response
            if ($response->successful() && $response->json('status') === 'OK') {
                return $response->json('results.0.formatted_address');
            } else {
                $error = $response->json('error_message') ?? $response->json('status');
                error_log("Geocoding error: " . $error);
                return null;
            }
        } catch (Exception $e) {
            error_log("Error fetching address data: " . $e->getMessage());
            return null;
        }
    }    
    function decodePolyline($encoded)
    {
        $length = strlen($encoded);
        $index = 0;
        $points = [];
        $lat = 0;
        $lng = 0;

        while ($index < $length) {
            $result = 1;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63 - 1;
                $result += $b << $shift;
                $shift += 5;
            } while ($b >= 0x1f);
            $lat += ($result & 1) ? ~($result >> 1) : ($result >> 1);

            $result = 1;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63 - 1;
                $result += $b << $shift;
                $shift += 5;
            } while ($b >= 0x1f);
            $lng += ($result & 1) ? ~($result >> 1) : ($result >> 1);

            $points[] = ['lat' => $lat * 1e-5, 'lng' => $lng * 1e-5];
        }

        return $points;
    }

    function getRoutesForAllConsData()
    {
        ini_set('max_execution_time', 600); //10 minutes
        // Log the start time
        $startTime = microtime(true);
        Log::info('Started fetching routes for all getRoutesForAllConsData');
    
        // Fetch all data from the ConsData model
        $allConsData = ConsData::all(); // Ensure the correct table and model are used
        // Check if any data is retrieved
        if ($allConsData->isEmpty()) {
            Log::info('No records found in ConsData.');
            return;
        }
    
        // Iterate through each record in ConsData
        foreach ($allConsData as  $cons) {
            Log::info("Processing ConsData record with ID: {$cons->id}.");
    
            // Assuming the coordinates are stored in a JSON format in a column (replace 'coordinates' with the actual column name)
            $coordinates = $cons->Coordinates;
            // dd($coordinatesJson);
            // Decode JSON to extract coordinates
            // $coordinates = json_decode($coordinatesJson, true);
            

            // Ensure the coordinates are valid
            if (is_array($coordinates)) {
                foreach ($coordinates as $coordinateIndex => $coordinate) {
                    $startLat = $coordinate['SenderLatitude'];
                    $startLng = $coordinate['SenderLongitude'];
                    $endLat = $coordinate['ReceiverLatitude'];
                    $endLng = $coordinate['ReceiverLongitude'];
    
                    Log::info("Calling getRouteUsingRoutesAPI for coordinate set #{$coordinateIndex} of ConsData record.");
    
                    // Call the function with the coordinates
                    $eventsByCoordinate = $this->getRouteUsingRoutesAPI($startLat, $startLng, $endLat, $endLng);

                    Log::info("Finished calling getRouteUsingRoutesAPI for coordinate set #{$coordinateIndex} of ConsData record.");
                    Log::info("Events by coordinate: " . json_encode($eventsByCoordinate));
    
                    // Check if there are any events
                    if (!empty($eventsByCoordinate)) {
                        foreach ($eventsByCoordinate as $event) {
                            // Assuming each event has an 'event_id'
                            $eventId = $event['event_id']; // Replace 'event_id' with the correct key if needed
    
                            // Save the consignment_id and event_id in the consignment_events table
                            ConsignmentEvents::create([
                                'consignment_id' => $cons->id,
                                'event_id' => $eventId,
                            ]);
    
                            Log::info("Saved event ID: {$eventId} for consignment ID: {$cons->id}.");
                        }
                    } else {
                        Log::info("No events found for coordinate set #{$coordinateIndex} of ConsData record.");
                    }
    
                    Log::info("Finished processing coordinate set #{$coordinateIndex} of ConsData record.");
                }
            } else {
                Log::warning("Invalid coordinate data format for ConsData record with ID: {$cons->id}.");
            }
        }
    
        // Calculate the total execution time
        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;
    
        // Log the end time and the total execution time
        Log::info('Finished fetching routes for all ConsData records.');
        Log::info("Total execution time: " . round($executionTime, 4) . " seconds.");
    }


}
