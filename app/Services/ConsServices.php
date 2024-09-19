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
use Illuminate\Support\Facades\DB;

class ConsServices
{
    protected $googleApiKey;

    public function __construct()
    {
        $this->googleApiKey = env('GOOGLE_API_KEY');
    }

    public function getCons()
    {
        try {
            Log::info('Starting to fetch consignments.');

            // Reset tables
            $this->resetConsingmentEventsTable();
            $this->resetConsignmentsTable();

            // Fetch data from the API
            $response = Http::timeout(40)
                ->withHeaders([
                    'UserId' => '1',
                ])
                ->get("https://gtlsnsws12-vm.gtls.com.au:9123/api/v2/GTRS/Traffic/Consignments");

            if ($response->successful()) {
                Log::info('Successfully fetched consignments from API.');
                $data = $response->json();

                $consDataToInsert = [];
                foreach ($data as $consignment) {
                    try {
                        $consDataToInsert[] = [
                            'ConsignmentId' => $consignment['ConsignmentId'],
                            'ConsignmentNo' => $consignment['ConsignmentNo'],
                            'DebtorId' => $consignment['DebtorId'],
                            'DebtorName' => $consignment['DebtorName'],
                            'SenderName' => $consignment['SenderName'],
                            'SenderState' => $consignment['SenderState'],
                            'SenderSuburb' => $consignment['SenderSuburb'],
                            'SenderPostcode' => $consignment['SenderPostcode'],
                            'SenderAddressName' => $consignment['SenderAddressName'],
                            'ReceiverName' => $consignment['ReceiverName'],
                            'ReceiverState' => $consignment['ReceiverState'],
                            'ReceiverSuburb' => $consignment['ReceiverSuburb'],
                            'ReceiverPostcode' => $consignment['ReceiverPostcode'],
                            'ReceiverAddressName' => $consignment['ReceiverAddressName'],
                            'DespatchDate' => isset($consignment['DespatchDate']) ? $consignment['DespatchDate'] : null,
                            'RDD' => isset($consignment['RDD']) ? $consignment['RDD'] : null,
                            'Coordinates' => json_encode($consignment['Coordinates']),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    } catch (\Exception $e) {
                        Log::error('Error Preparing Consignments Data: ' . $e->getMessage());
                    }
                }

                // Bulk insert consignments
                if (!empty($consDataToInsert)) {
                    ConsData::insert($consDataToInsert);
                    Log::info('Bulk inserted consignments data.');
                }

                // Process routes and events
                $this->getRoutesForAllConsData();

                return $data;
            } else {
                Log::warning('Failed to fetch consignments from API: ' . $response->status());
                return $response->json();
            }
        } catch (\Exception $e) {
            Log::error('Error Fetching Consignments: ' . $e->getMessage());
            return null;
        }
    }

    private function resetConsignmentsTable()
    {
        Log::info('Resetting consignments_tracking table.');

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

    private function resetConsingmentEventsTable()
    {
        Log::info('Resetting consignment_events table.');

        // Drop the table if it exists
        if (Schema::hasTable('consignment_events')) {
            Schema::drop('consignment_events');
            Log::info('Dropped existing consignment_events table.');
        }

        // Recreate the table
        Schema::create('consignment_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consignment_id');
            $table->string('event_id', 255);
            $table->string('state', 255);
            $table->timestamps();
        });
        Log::info('Recreated consignment_events table.');
    }

    private function getRouteUsingRoutesAPI($startLat, $startLng, $endLat, $endLng)
    {
        try {
            Log::debug("Checking if route is cached for coordinates: Start ($startLat, $startLng) -> End ($endLat, $endLng)");
    
            // Check if the route is already cached in the database
            $cachedRoute = DB::table('cached_routes')
                ->where('start_lat', $startLat)
                ->where('start_lng', $startLng)
                ->where('end_lat', $endLat)
                ->where('end_lng', $endLng)
                ->first();
    
            // If the route is cached, use the cached route
            if ($cachedRoute) {
                Log::info('Using cached route.');
                $route = json_decode($cachedRoute->route, true);
    
                // Handle JSON decoding issues
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Failed to decode cached route. JSON error: ' . json_last_error_msg());
                    return [];
                }
            } else {
                Log::info('Route not cached. Calling Google Routes API.');
                
                // Prepare the payload for the API call
                $payload = [
                    'origin' => [
                        'location' => [
                            'latLng' => [
                                'latitude' => $startLat,
                                'longitude' => $startLng,
                            ],
                        ],
                    ],
                    'destination' => [
                        'location' => [
                            'latLng' => [
                                'latitude' => $endLat,
                                'longitude' => $endLng,
                            ],
                        ],
                    ],
                    'travelMode' => "DRIVE",
                    'polylineQuality' => "HIGH_QUALITY",
                ];
    
                // Make the API call to get the route
                $response = Http::timeout(30)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'X-Goog-Api-Key' => $this->googleApiKey,
                        'X-Goog-FieldMask' => 'routes',
                    ])
                    ->post('https://routes.googleapis.com/directions/v2:computeRoutes', $payload);
    
                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['routes']) && count($data['routes']) > 0) {
                        $polylinePoints = $data['routes'][0]['polyline']['encodedPolyline'];
                        $route = $this->decodePolyline($polylinePoints);
    
                        // Store the route in the database cache for future use
                        DB::table('cached_routes')->insert([
                            'start_lat' => $startLat,
                            'start_lng' => $startLng,
                            'end_lat' => $endLat,
                            'end_lng' => $endLng,
                            'route' => json_encode($route),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
    
                        Log::info('Route cached successfully.');
                    } else {
                        Log::warning("No valid routes found in the API response.");
                        return [];
                    }
                } else {
                    Log::error("Google Routes API request failed with status: " . $response->status());
                    return [];
                }
            }
    
            // Proceed to filter events on the route
            $eventsOnRoad = $this->filterEventsOnRoute($route);
    
            return $eventsOnRoad;
    
        } catch (\Exception $e) {
            Log::error("Error in getRouteUsingRoutesAPI: " . $e->getMessage());
            return [];
        }
    }
    
    
    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    private function decodePolyline($encoded)
    {
        $length = strlen($encoded);
        $index = 0;
        $points = [];
        $lat = 0;
        $lng = 0;

        while ($index < $length) {
            $result = 0;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b >= 0x20);
            $deltaLat = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lat += $deltaLat;

            $result = 0;
            $shift = 0;
            do {
                $b = ord($encoded[$index++]) - 63;
                $result |= ($b & 0x1f) << $shift;
                $shift += 5;
            } while ($b >= 0x20);
            $deltaLng = (($result & 1) ? ~($result >> 1) : ($result >> 1));
            $lng += $deltaLng;

            $points[] = ['lat' => $lat * 1e-5, 'lng' => $lng * 1e-5];
        }

        return $points;
    }

    private function filterEventsOnRoute(array $route)
    {
        // Get the relevant state tables based on the route
        $stateTables = $this->getStateTablesFromRoute($route);
        $eventsOnRoad = [];
    
        foreach ($stateTables as $stateTable) {
            foreach ($route as $index => $point) {
                // Skip the last point since it's the end of the route
                if ($index === count($route) - 1) continue;
    
                $startPoint = $route[$index];
                $endPoint = $route[$index + 1];
    
                // Fetch events within a 10-meter radius of the route segment using spatial queries
                $events = DB::table($stateTable)
                    ->select('*')
                    ->whereRaw("ST_Distance_Sphere(location, POINT(?, ?)) <= ?", [
                        $startPoint['lng'], $startPoint['lat'], 10 // 10 meters tolerance
                    ])
                    ->orWhereRaw("ST_Distance_Sphere(location, POINT(?, ?)) <= ?", [
                        $endPoint['lng'], $endPoint['lat'], 10 // 10 meters tolerance
                    ])
                    ->get();
    
                // Add the nearby events to the eventsOnRoad array
                foreach ($events as $event) {
                    $eventsOnRoad[] = $event;
                }
            }
        }
    
        return $eventsOnRoad;
    }
    
    

    private function getPerpendicularDistanceToSegment($point, $lineStart, $lineEnd)
    {
        $x1 = $lineStart['lat'];
        $y1 = $lineStart['lng'];
        $x2 = $lineEnd['lat'];
        $y2 = $lineEnd['lng'];
        $px = $point['lat'];
        $py = $point['lng'];

        $dx = $x2 - $x1;
        $dy = $y2 - $y1;

        if ($dx == 0 && $dy == 0) {
            // The segment is a point
            $distance = $this->haversineDistance($px, $py, $x1, $y1);
            return $distance;
        }

        $u = (($px - $x1) * $dx + ($py - $y1) * $dy) / ($dx * $dx + $dy * $dy);

        if ($u < 0) {
            $closestX = $x1;
            $closestY = $y1;
        } elseif ($u > 1) {
            $closestX = $x2;
            $closestY = $y2;
        } else {
            $closestX = $x1 + $u * $dx;
            $closestY = $y1 + $u * $dy;
        }

        return $this->haversineDistance($px, $py, $closestX, $closestY);
    }

    private function getStateTablesFromRoute(array $route)
    {
        $states = [];
        foreach ($route as $point) {
            // This is a simplified placeholder logic for determining which state a point belongs to.
            // You should replace it with proper logic based on the coordinates.
            if ($point['lat'] >= -38 && $point['lat'] <= -37) {
                $states[] = 'traffic_data_vic';
            } else if ($point['lat'] < -38 && $point['lat'] > -39) {
                $states[] = 'traffic_data_nsw';
            }
        }

        // Ensure unique state tables are returned
        return array_unique($states);
    }

    public function getRoutesForAllConsData()
    {
        try {
            ini_set('max_execution_time', 600000); // Extend execution time for larger datasets
            Log::info('Started fetching routes for all ConsData records.');
    
            // Process consignments in larger chunks
            ConsData::chunk(200, function ($consDataBatch) {
                $eventsToInsert = [];
    
                foreach ($consDataBatch as $cons) {
                    Log::debug("Processing ConsData record with ID: {$cons->id}.");
    
                    // Your existing logic for processing each consignment
                    $coordinates = $cons->Coordinates;
    
                    if (is_array($coordinates)) {
                        foreach ($coordinates as $coordinateIndex => $coordinate) {
                            $startLat = $coordinate['SenderLatitude'] ?? null;
                            $startLng = $coordinate['SenderLongitude'] ?? null;
                            $endLat = $coordinate['ReceiverLatitude'] ?? null;
                            $endLng = $coordinate['ReceiverLongitude'] ?? null;
    
                            if (!$startLat || !$startLng || !$endLat || !$endLng) {
                                Log::warning("Incomplete coordinates for ConsData ID: {$cons->id}, Coordinate set #{$coordinateIndex}.");
                                continue;
                            }
    
                            // Fetch route-related events
                            $eventsByCoordinate = $this->getRouteUsingRoutesAPI($startLat, $startLng, $endLat, $endLng);
    
                            if (!empty($eventsByCoordinate)) {
                                foreach ($eventsByCoordinate as $event) {
                                    $eventId = $event->event_id ?? null;
                                    $state = $event->api_source;
    
                                    if ($eventId) {
                                        $eventsToInsert[] = [
                                            'consignment_id' => $cons->id,
                                            'event_id' => $eventId,
                                            'state' => $state,
                                            'created_at' => now(),
                                            'updated_at' => now(),
                                        ];
                                    }
                                }
                            }
                        }
                    } else {
                        Log::warning("Invalid coordinate data format for ConsData ID: {$cons->id}.");
                    }
                }
    
                // Bulk insert consignment events in chunks for efficiency
                if (!empty($eventsToInsert)) {
                    ConsignmentEvents::insert($eventsToInsert);
                    Log::info('Bulk inserted consignment events.');
                }
            });
    
            Log::info('Finished fetching routes for all ConsData records.');
        } catch (\Exception $e) {
            Log::error('Error in getRoutesForAllConsData: ' . $e->getMessage());
        }
    }
    
}
