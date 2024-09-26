<?php

namespace App\Services;
use App\Models\TrafficDataNSW;
use Spatie\Async\Pool;
use Illuminate\Support\Facades\Log;
use App\Models\ConsData;
use App\Models\ConsignmentEvents;
use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Http;
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
    
            // Reset only the consignment events table, not the consignments
            $this->resetConsingmentEventsTable();
            $this->resetConsignmentsTable();
            // Fetch data from the API
            $response = Http::timeout(40)
                ->withHeaders([
                    'UserId' => '1',
                ])
                ->get("https://gtlslebs06-vm.gtls.com.au:8084/api/v2/GTRS/Traffic/Consignments");
    
            if ($response->successful()) {
                Log::info('Successfully fetched consignments from API.');
                $data = $response->json();
    
                $consDataToInsert = [];
                foreach ($data as $consignment) {
                    try {
                        // Insert new consignments and mark them as unprocessed
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
                            'DespatchDate' => $consignment['DespatchDate'] ?? null,
                            'RDD' => $consignment['RDD'] ?? null,
                            'Coordinates' => json_encode($consignment['Coordinates']),
                            'is_processing' => false,  // Mark as not processed
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    } catch (\Exception $e) {
                        Log::error('Error Preparing Consignments Data: ' . $e->getMessage());
                    }
                }
    
                // Bulk insert consignments if there are any new ones
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
    
        // Truncate the table instead of dropping and recreating it
        DB::table('consignments_tracking')->truncate();
        Log::info('Truncated consignments_tracking table.');
    }
    
    private function resetConsingmentEventsTable()
    {
        Log::info('Resetting consignment_events table.');
    
        // Truncate the table instead of dropping and recreating it
        DB::table('consignment_events')->truncate();
        Log::info('Truncated consignment_events table.');
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
    
            if ($cachedRoute) {
                Log::info('Using cached route.');
                $route = json_decode($cachedRoute->route, true);
    
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error('Failed to decode cached route. JSON error: ' . json_last_error_msg());
                    return [];
                }
            } else {
                Log::info('Route not cached. Calling Google Routes API asynchronously.');
    
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
    
                $response = Http::async()->timeout(30)
                    ->withHeaders([
                        'Content-Type' => 'application/json',
                        'X-Goog-Api-Key' => $this->googleApiKey,
                        'X-Goog-FieldMask' => 'routes', 
                    ])
                    ->post('https://routes.googleapis.com/directions/v2:computeRoutes', $payload)
                    ->then(function ($response) use ($startLat, $startLng, $endLat, $endLng) {
                        if ($response->successful()) {
                            $data = $response->json();
                            if (isset($data['routes']) && count($data['routes']) > 0) {
                                $polylinePoints = $data['routes'][0]['polyline']['encodedPolyline'];
                                $route = $this->decodePolyline($polylinePoints);
    
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
                                return $route;
                            } else {
                                Log::warning("No valid routes found in the API response.");
                                return [];
                            }
                        } else {
                            Log::error("Google Routes API request failed with status: " . $response->status() . ", message: " . $response->body());
                            return [];
                        }
                    });
    
                // Ensure asynchronous promise is resolved
                $route = $response->wait();
            }
    
            // Proceed to filter events on the route
            return $this->filterEventsOnRoute($route);
    
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

    public function filterEventsOnRoute(array $route)
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
            // Get the latitude and longitude from the current point
            $lat = $point['lat'];
            $lng = $point['lng'];
    
            // Use latitude and longitude ranges to determine which state the point is in
            if ($lat >= -38 && $lat <= -37) {
                // Victoria (VIC)
                $states[] = 'traffic_data_vic';
            } else if ($lat < -37 && $lat > -39) {
                // New South Wales (NSW)
                $states[] = 'traffic_data_nsw';
            } else if ($lat < -27 && $lat >= -29) {
                // Queensland (QLD)
                $states[] = 'traffic_data_qld';
            } else if ($lat >= -35 && $lat <= -34) {
                // South Australia (SA)
                $states[] = 'traffic_data_sa';
            } 
        }
    
        // Ensure unique state tables are returned (to avoid querying the same table multiple times)
        return array_unique($states);
    }
    
    
    public function getRoutesForAllConsData()
    {
        try {
            ini_set('max_execution_time', 600000); // Extend execution time for larger datasets
            Log::info('Started fetching routes for all ConsData records.');
    
            // Limit the number of concurrent threads (set to 5 for example)
            $pool = Pool::create()->concurrency(10);
    
            // Process consignments in larger chunks
            ConsData::chunk(25, function ($consDataBatch) use ($pool) {
                foreach ($consDataBatch as $cons) {
                    try {
                        // Log the start of thread processing for the consignment
                        $pool->add(function () use ($cons) {
                            Log::debug("Processing ConsData record with ID: {$cons->id} in thread " . getmypid());
                        
                            $eventsToInsert = [];
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
    
                                    // Fetch route-related events asynchronously
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
    
                            // Bulk insert consignment events in chunks for efficiency
                            if (!empty($eventsToInsert)) {
                                ConsignmentEvents::insert($eventsToInsert);
                                Log::info('Bulk inserted consignment events for ConsData ID: ' . $cons->id);
                            }
                        })->catch(function (\Exception $e) use ($cons) {
                            Log::error("Thread " . getmypid() . " - Error processing ConsData ID: " . $cons->id . ' - ' . $e->getMessage());
                        });
    
                    } catch (\Exception $e) {
                        // Log any errors for individual consignment processing
                        Log::error("Thread " . getmypid() . " - Error processing ConsData ID: " . $cons->id . ' - ' . $e->getMessage());
                    }
                }
            });
    
            // Only call wait after all tasks are added to the pool
            $pool->wait();
    
            Log::info('Finished fetching routes for all ConsData records.');
        } catch (\Exception $e) {
            Log::error('Error in getRoutesForAllConsData: ' . $e->getMessage());
        }
    }

    public function snapToRoads(array $coordinates)
    {
        try {
            $interpolatedCoordinates = [];
    
            // Function to interpolate between two coordinates
            $interpolatePoints = function ($point1, $point2, $numPoints = 5) {
                $points = [];
                $latDiff = ($point2['lat'] - $point1['lat']) / ($numPoints + 1);
                $lngDiff = ($point2['lng'] - $point1['lng']) / ($numPoints + 1);
    
                for ($i = 1; $i <= $numPoints; $i++) {
                    $points[] = [
                        'lat' => $point1['lat'] + $latDiff * $i,
                        'lng' => $point1['lng'] + $lngDiff * $i
                    ];
                }
    
                return $points;
            };
    
            // Loop through the provided coordinates and add interpolated points
            for ($i = 0; $i < count($coordinates) - 1; $i++) {
                // Add the current coordinate
                $interpolatedCoordinates[] = $coordinates[$i];
    
                // Add interpolated points between this coordinate and the next
                $interpolatedCoordinates = array_merge(
                    $interpolatedCoordinates,
                    $interpolatePoints($coordinates[$i], $coordinates[$i + 1])
                );
            }
    
            // Add the last coordinate
            $interpolatedCoordinates[] = $coordinates[count($coordinates) - 1];
    
            // Split interpolated coordinates into batches of 100 or fewer
            $batches = array_chunk($interpolatedCoordinates, 100);
    
            $snappedPoints = [];
    
            foreach ($batches as $batch) {
                // Build the path parameter by concatenating lat/lng pairs
                $path = implode('|', array_map(function ($coordinate) {
                    return $coordinate['lat'] . ',' . $coordinate['lng'];
                }, $batch));
    
                // Send a request to the Google Roads API
                $response = Http::get("https://roads.googleapis.com/v1/snapToRoads", [
                    'path' => $path,
                    'key' => $this->googleApiKey,
                    'interpolate' => true  // Optional: returns interpolated points along the road
                ]);
    
                if ($response->successful()) {
                    $data = $response->json();
    
                    // Extract snapped points from the API response
                    foreach ($data['snappedPoints'] as $point) {
                        $snappedPoints[] = [
                            'lat' => $point['location']['latitude'],
                            'lng' => $point['location']['longitude'],
                        ];
                    }
                } else {
                    Log::error("Failed to snap coordinates to roads: " . $response->body());
                    return [];
                }
            }
    
            return $snappedPoints;  // Return the snapped coordinates
    
        } catch (\Exception $e) {
            Log::error("Error in snapToRoads: " . $e->getMessage());
            return [];
        }
    }
    
    public function checkEventsOnRoute(array $routeCoordinates)
    {
        // Convert route coordinates to WKT LineString
        $lineStringWKT = $this->convertCoordinatesToLineStringWKT($routeCoordinates);
    
        // Distance threshold in meters (e.g., 1000 meters)
        $distanceThresholdMeters = 20;
    
        // Convert distance from meters to degrees (approximate)
        $bufferDistanceDegrees = $distanceThresholdMeters / 111320; // Meters per degree at the equator
    
        // Query events using raw SQL
        $events = TrafficDataNSW::selectRaw("id, ST_AsText(location) as location_wkt")
        ->whereRaw(
            "ST_Intersects(
                location,
                ST_Buffer(ST_GeomFromText(?, 4326), ?)
            )",
            [$lineStringWKT, $bufferDistanceDegrees]
        )->get();
    
    
        return $events;
    }
    
    private function convertCoordinatesToLineStringWKT(array $coordinates)
    {
        $points = array_map(function ($coordinate) {
            return "{$coordinate['lng']} {$coordinate['lat']}";
        }, $coordinates);
    
        return 'LINESTRING(' . implode(',', $points) . ')';
    }
}
