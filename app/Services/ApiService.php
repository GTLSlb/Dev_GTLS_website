<?php

namespace App\Services;

use App\Models\ApiData;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;


class ApiService
{
    public function fetchAndSaveData()
    {
        ini_set('max_execution_time', 180); 
        $requestedTime = now();
        try {
            // Fetch data from each API and capture their responses
            $saResponse = $this->processSAApi();
            $nswResponses = $this->processNSWApi(); // This returns an array
            $qldResponse = $this->processQLDApi();
            $vicPlannedResponse = $this->processVICPlannedApi();
            $vicUnplannedResponse = $this->processVICUnPlannedApi();
            $request_log_id = $this->logRequest(200, $requestedTime);
            
            // Flatten all responses into a single array
            $responses = array_merge([$saResponse], $nswResponses, [$qldResponse], $vicUnplannedResponse, $vicPlannedResponse);
            // $responses = array_merge($vicUnplannedResponse,$vicPlannedResponse);

            foreach ($responses as $response) {
                if (isset($response['state'])) { // Check if 'state' key exists
                    $this->statelogRequest($response['state'], $response['status'], $request_log_id, $response['requestedTime'], $response['error']);
                } else {
                    Log::error('Missing state in response');
                }
            }
    
        } catch (\Exception $e) {
            // Log unexpected exceptions
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }
    }

    private function logRequest($status, $requestedTime, $response_msg = null)
    {
        $id = DB::table('request_logs')->insertGetId([
            'method' => 'Service Run',
            'response_status' => $status,
            'request_time' => $requestedTime,
            'response_msg' => $response_msg,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        return $id;
    }
    private function statelogRequest($state,$status,$request_log_id, $requestedTime, $response_msg = null)
    {
        DB::table('states_request_logs')->insert([
            'state_source' => $state,
            'response_status' => $status,
            'request_log_id' => $request_log_id,
            'request_time' => $requestedTime,
            'response_msg' => $response_msg,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
    
    private function processSAApi()
    {
        $requestedTime = now(); // Log request time for this individual API
        try {
            $response = Http::timeout(40)->get('https://maps.sa.gov.au/arcgis/rest/services/DPTIExtTransport/TrafficSAOpenData/MapServer/0/query?where=1%3D1&outFields=*&f=json');
    
            if ($response->successful()) {
                $data = $response->json();
    
                Log::info(now());
    
                foreach ($data['features'] as $feature) {
                    $attributes = $feature['attributes'];
                    $endDate = $attributes['END_DATE'];
    
                    // Convert end date to a DateTime object
                    $endDateTime = $this->convertComparedTimestampToDatetime($endDate);
    
                    // Check if the event has ended
                    if ($endDateTime && now()->gt($endDateTime)) {
                        // If the event has ended, delete the record if it exists
                        ApiData::where('api_source', 'SA')
                                ->where('event_id', $attributes['ROADWORKS_AND_INCIDENTS_ID'])
                                ->delete();
                        continue; // Skip further processing for this feature
                    }
                    // Check if the current time is before the end date
                    if (now()->lt($endDateTime)) {
                        ApiData::updateOrCreate(
                            [
                                'api_source' => 'SA',
                                'event_id' => $attributes['ROADWORKS_AND_INCIDENTS_ID'],
                            ],
                            [
                                'description' => $attributes['DESCRIPTION'],
                                'start_date' => $this->convertTimestampToDatetime($attributes['START_DATE']),
                                'end_date' => $endDateTime,
                                'latitude' => $attributes['LATITUDE'],
                                'longitude' => $attributes['LONGITUDE'],
                                'suburb' => $attributes['SUBURB'],
                                'traffic_direction' => $attributes['TRAFFIC_DIR'],
                                'road_name' => $attributes['LOCAL_ROAD'], // Road Name
                                'status' => $attributes['ACTIVE'], // Assuming 'ACTIVE' is status
                                'event_type' => $attributes['REC_TYPE'], // Event Type
                                'impact' => $attributes['NO_LANES_CLOSED'], // Impact
                                'source_url' => $attributes['source_url'] ?? '', // Assuming GIS_LINK_ID could be a source identifier
                                'advice' => $attributes['advice'] ?? '', // Insert combined advice
                                'information' => $attributes['information'] ?? '',
                            ]
                        );
                    }
                }
                // Return success response status
                return ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'SA'];
            } else {
                // Return response status if not successful
                return ['status' => $response->status(), 'error' => 'Request was not successful', 'requestedTime' => $requestedTime, 'state' => 'SA'];
            }
        } catch (\Exception $e) {
            // Log the error and return the error message
            Log::error('SA API request failed: ' . $e->getMessage());
            return ['status' => null, 'error' => $e->getMessage(), 'requestedTime' => $requestedTime, 'state' => 'SA'];
        }
    }
    
    private function processVICPlannedApi()
    {
        $requestedTime = now(); // Log request time for this individual API

        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://data-exchange-test-api.vicroads.vic.gov.au/opendata/disruptions/v1/planned?format=GeoJson'],
        ];

        $results = []; // Array to collect results for each request

        foreach ($requests as $request) {
            $url = $request['url'];

            try {
                $response = Http::timeout(40)->withHeaders([
                    'Ocp-Apim-Subscription-Key' => '11d61106ecdc4c0e9dfa6ae12b4b3171',
                    'Accept' => 'application/json',
                ])->get($url);

                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['features'] as $feature) {
                        $attributes = $feature['properties'];
                        $duration = $attributes['duration'] ?? null;

                        // Accessing the first geometry coordinates
                        $geometry = $feature['geometry']['geometries'][0] ?? null;
                        $latitude = $geometry['coordinates'][1] ?? null;
                        $longitude = $geometry['coordinates'][0] ?? null;

                        // Accessing other properties
                        $eventType = $attributes['eventType'] ?? null;
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['description'] ?? '';
                        $start_date = $this->convertIsoToDatetime($duration['start'] ?? null);
                        $end_date = $this->convertIsoToDatetime($duration['end'] ?? null);
                        $suburb = $attributes['roads'][0]['suburb'] ?? '';
                        $traffic_direction = $attributes['impact']['direction'] ?? '';
                        $advice = $attributes['advice'] ?? '';
                        $road_name = $attributes['closedRoadName'] ?? '';
                        $impact = $attributes['impact']['impactType'] ?? '';
                        $source_url = $attributes['source']['sourceName'] ?? '';
                        $information = $attributes['information'] ?? '';

                        // Check if the event has ended
                        // if ($end_date && now()->gt($end_date)) {
                        //     // If the event has ended, delete the record if it exists
                        //     ApiData::where('api_source', 'VIC')
                        //         ->where('event_id', $attributes['id'])
                        //         ->delete();
                        //     continue; // Skip further processing for this feature
                        // }

                        // Only proceed if the event has not ended
                        try {
                            ApiData::updateOrCreate(
                                [
                                    'api_source' => 'VIC',
                                    'event_id' => $attributes['id'],
                                ],
                                [
                                    'description' => $description,
                                    'start_date' => $start_date,
                                    'end_date' => $end_date,
                                    'latitude' => $latitude,
                                    'longitude' => $longitude,
                                    'suburb' => $suburb,
                                    'traffic_direction' => $traffic_direction,
                                    'road_name' => $road_name,
                                    'status' => $status,
                                    'event_type' => $eventType,
                                    'impact' => $impact,
                                    'source_url' => $source_url,
                                    'advice' => $advice,
                                    'information' => $information,
                                ]
                            );
                        } catch (\Exception $e) {
                            Log::error('Error creating or updating record for event ID ' . $attributes['id'] . ' from URL ' . $url . ': ' . $e->getMessage());
                        }
                    }

                    // Store success status for this request
                    $results[] = ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                } else {
                    // Log error and store status
                    $errorMsg = 'Request to ' . $url . ' was not successful. Status: ' . $response->status();
                    Log::error($errorMsg);
                    $results[] = ['status' => $response->status(), 'error' => $errorMsg , 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                }
            } catch (\Exception $e) {
                // Log exception and store error message
                $errorMsg = 'API request to ' . $url . ' failed: ' . $e->getMessage();
                Log::error($errorMsg);
                $results[] = ['status' => null, 'error' => $errorMsg,  'requestedTime' => $requestedTime, 'state' => 'VIC'];
            }
        }

        // Return all results after processing all requests
        return $results;
    }

    private function processVICUnPlannedApi()
    {
        $requestedTime = now(); // Log request time for this individual API
    
        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://data-exchange-test-api.vicroads.vic.gov.au/opendata/disruptions/v2/unplanned?format=GeoJson'],
        ];
    
        $results = []; // Array to collect results for each request
    
        foreach ($requests as $request) {
            $url = $request['url'];
    
            try {
                $response = Http::timeout(40)->withHeaders([
                    'Ocp-Apim-Subscription-Key' => '11d61106ecdc4c0e9dfa6ae12b4b3171',
                    'Accept' => 'application/json',
                ])->get($url);
    
                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['features'] as $feature) {
                        $attributes = $feature['properties'];
    
                        // Accessing the geometry coordinates
                        $geometry = $feature['geometry'] ?? null;
                        $coordinates = $geometry['coordinates'] ?? null;
    
                        // Handle coordinates - check if it is a nested array or a single coordinate pair
                        if (is_array($coordinates)) {
                            if (is_array($coordinates[0])) {
                                // If it's a nested array (multiple coordinate pairs), use the first pair
                                $longitude = $coordinates[0][0] ?? null;
                                $latitude = $coordinates[0][1] ?? null;
                            } else {
                                // If it's a single coordinate pair, use it directly
                                $longitude = $coordinates[0] ?? null;
                                $latitude = $coordinates[1] ?? null;
                            }
                        } else {
                            // If no coordinates are provided, set to null
                            $longitude = null;
                            $latitude = null;
                        }
    
                        // Accessing other properties
                        $eventType = $attributes['eventType'] ?? null;
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['description'] ?? null;
                        $start_date = $this->convertIsoToDatetime($attributes['created'] ?? null);
                        $end_date = null;
                        $suburb = $attributes['reference']['startIntersectionLocality'] ?? '';
                        $traffic_direction = $attributes['impact']['direction'] ?? null;
    
                        // Check if 'socialMedia' key exists before accessing it
                        $advice = isset($attributes['socialMedia']) ? (is_array($attributes['socialMedia']) ? json_encode($attributes['socialMedia']) : $attributes['socialMedia']) : null;
    
                        $road_name = $attributes['closedRoadName'] ?? '';
                        $impact = $attributes['impact']['impactType'] ?? null;
                        $source_url = $attributes['source']['sourceName'] ?? '';
                        $information = $attributes['description'] ?? null;
    
                        // Prepare the data array for insertion
                        $dataToInsert = [
                            'api_source' => 'VIC',
                            'event_id' => $attributes['id'],
                            'description' => $description,
                            'start_date' => $start_date,
                            'end_date' => $end_date,
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                            'suburb' => $suburb,
                            'traffic_direction' => $traffic_direction,
                            'road_name' => $road_name,
                            'status' => $status,
                            'event_type' => $eventType,
                            'impact' => $impact,
                            'source_url' => $source_url,
                            'advice' => $advice,
                            'information' => is_array($information) ? json_encode($information) : $information,
                        ];

    
                        // Ensure fields are strings before inserting
                        try {
                            ApiData::updateOrCreate(
                                [
                                    'api_source' => 'VIC',
                                    'event_id' => $attributes['id'],
                                ],
                                $dataToInsert
                            );
                        } catch (\Exception $e) {
                            Log::error('Error creating or updating record for event ID ' . $attributes['id'] . ' from URL ' . $url . ': ' . $e->getMessage());
                            Log::error('Data causing the error: ', $dataToInsert); // Log the problematic data
                        }
                    }
    
                    $results[] = ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                } else {
                    $errorMsg = 'Request to ' . $url . ' was not successful. Status: ' . $response->status();
                    Log::error($errorMsg);    
                    $results[] = ['status' => $response->status(), 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                }
            } catch (\Exception $e) {
                $errorMsg = 'API request to ' . $url . ' failed: ' . $e->getMessage();
                Log::error($errorMsg);
    
                // Log the exception and any response body if available
                if (isset($response)) {
                    Log::error('Response body: ' . $response->body());
                }
    
                $results[] = ['status' => null, 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
            }
        }
    
        return $results;
    }

    private function processNSWApi()
    {
        $requestedTime = now(); // Log request time for this individual API
        $results = []; // Array to store results of each request
        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/flood/all', 'event_type' => 'Flood'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all', 'event_type' => 'Incident'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all', 'event_type' => 'Major Event'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all', 'event_type' => 'Roadwork'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/regional-lga-incident/all', 'event_type' => 'Regional LGA Incident'],
        ];
    
        foreach ($requests as $request) {
            Log::info('Requesting data from ' . $request['event_type']);
            $url = $request['url'];
            $staticEventType = $request['event_type'];
    
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'apiKey eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJEMmxnb1U3WkpaSWJBbFRNUFlUaXBGZ2F4NEtaWmw1WVBEMUNodGV2bTRVIiwiaWF0IjoxNzI0MDYyMTc4fQ.zSYlt86pa-YcqmG2NqrD-uVHqZYFDe0bzUHTjPMZOY0',
                    'Accept' => 'application/json',
                ])->timeout(240)
                  ->get($url);
    
                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['features'] as $feature) {
                        $attributes = $feature['properties'];
                        $geometry = $feature['geometry'];
    
                        // Check if the event should be processed based on the "ended" and "isNewIncident" flags
                        $ended = $attributes['ended'] ?? false;
                        $isNewIncident = $attributes['isNewIncident'] ?? false;
    
                        if ($ended) {
                            // If "ended" is true, delete the record if it exists
                            ApiData::where('api_source', 'NSW')
                                   ->where('event_id', $feature['id'])
                                   ->delete();
                            continue; // Skip further processing for this feature
                        }
    
                        if (!$isNewIncident) {
                            // Skip this feature if "isNewIncident" is not true
                            continue;
                        }
    
                        // Safely access properties with null coalescing operator
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['displayName'] ?? '';
                        $end_date = $this->convertTimestampToDatetime($attributes['end'] ?? null);
                        $start_date = $this->convertTimestampToDatetime($attributes['created'] ?? null);
                        $lastUp_date = $this->convertTimestampToDatetime($attributes['lastUpdated'] ?? null);
    
                        // Ensure correct access to coordinates
                        $latitude = $geometry['coordinates'][1] ?? null;
                        $longitude = $geometry['coordinates'][0] ?? null;
    
                        $suburb = $attributes['roads'][0]['suburb'] ?? '';
                        $traffic_direction = $attributes['roads'][0]['impactedLanes'][0]['affectedDirection'] ?? '';
                        $road_name = $attributes['roads'][0]['mainStreet'] ?? '';
                        $impact = $this->generateImpactDescription($attributes['roads'][0]['impactedLanes'] ?? []);
                        $source_url = $attributes['weblinkUrl'] ?? '';
    
                        // Combine AdviceA, AdviceB, AdviceC into one field
                        $adviceA = $attributes['adviceA'] ?? null;
                        $adviceB = $attributes['adviceB'] ?? null;
                        $adviceC = $attributes['adviceC'] ?? null;
                        
                        // Filter out null or empty values and then join them with ' / '
                        $combinedAdvice = implode(' / ', array_filter([$adviceA, $adviceB, $adviceC], fn($value) => !is_null($value) && $value !== ''));
                        
                        // Now $combinedAdvice won't have a trailing '/' if any advice is empty or null
                        
    
                        // Use a transaction to ensure data integrity
                        DB::transaction(function () use ($feature, $description, $start_date,$end_date, $lastUp_date, $latitude, $longitude, $suburb, $traffic_direction, $road_name, $status, $staticEventType, $impact, $source_url, $combinedAdvice, $attributes) {
                            ApiData::updateOrCreate(
                                [
                                    'api_source' => 'NSW',
                                    'event_id' => $feature['id'],
                                ],
                                [
                                    'description' => $description,
                                    'end_date' => $end_date,
                                    'start_date' => $start_date,
                                    'lastUpdated_date' => $lastUp_date,
                                    'latitude' => $latitude,
                                    'longitude' => $longitude,
                                    'suburb' => $suburb,
                                    'traffic_direction' => $traffic_direction,
                                    'road_name' => $road_name,
                                    'status' => $status,
                                    'event_type' => $staticEventType,
                                    'impact' => $impact,
                                    'source_url' => $source_url,
                                    'advice' => $combinedAdvice,
                                    'otherAdvice' => $attributes['otherAdvice'] ?? '',
                                ]
                            );
                        });
                    }// Add success result to results array
                    $results[] = ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'NSW ', 'event_type' => $staticEventType];
                } else {
                    // Log error and add error result to results array
                    $errorMsg = 'Request to ' . $url . ' was not successful. Status: ' . $response->status();
                    Log::error($errorMsg);
                    $results[] = ['status' => $response->status(), 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'NSW', 'event_type' => $staticEventType];
                }
            } catch (\Illuminate\Http\Client\RequestException $e) {
                // Log HTTP request error and add error result to results array
                $errorMsg = 'HTTP request to ' . $url . ' failed: ' . $e->getMessage();
                Log::error($errorMsg);
                $results[] = ['status' => null, 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'NSW', 'event_type' => $staticEventType];
            } catch (\Exception $e) {
                // Log general exception and add error result to results array
                $errorMsg = 'An error occurred while processing the API request to ' . $url . ': ' . $e->getMessage();
                Log::error($errorMsg);
                $results[] = ['status' => null, 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'NSW', 'event_type' => $staticEventType];
            }
        }
    
        // Return all results after processing all URLs
        return $results;
    }
        
    private function processQLDApi()
    {
        $requestedTime = now();
        try {
            $response = Http::timeout(40)->get('https://api.qldtraffic.qld.gov.au/v2/events?apikey=3e83add325cbb69ac4d8e5bf433d770b');
    
            if ($response->successful()) {
                $data = $response->json();
    
                foreach ($data['features'] as $feature) {
                    $attributes = $feature['properties'];
    
                    // Skip features where source_name is "TFNSW"
                    if ($attributes['source']['source_name'] === 'TfNSW') {
                        continue;
                    }
    
                    $geometry = $feature['geometry'];
    
                    $averageCoordinates = $this->getAverageCoordinates($geometry);
                    $end_date = $attributes['duration']['end'];
                    $apiData = [
                        'description' => $attributes['description'],
                        'start_date' => $this->convertIsoToDatetime($attributes['duration']['start']),
                        'end_date' => $this->convertIsoToDatetime($attributes['duration']['end'] ?? null),
                        'suburb' => $attributes['road_summary']['locality'] ?? '',
                        'traffic_direction' => $attributes['impact']['direction'] ?? '',
                        'road_name' => $attributes['road_summary']['road_name'] ?? '',
                        'status' => is_array($attributes['status']) ? implode(' / ', $attributes['status']) : $attributes['status'],
                        'event_type' => is_array($attributes['event_type']) ? implode(' / ', $attributes['event_type']) : $attributes['event_type'],
                        'impact' => $this->createQLDImpactSentence($attributes['impact']),
                        'source_url' => $attributes['url'],
                        'advice' => $attributes['advice'],
                        'information' => $attributes['information'],
                    ];
    
                    if (!is_null($averageCoordinates['latitude']) && !is_null($averageCoordinates['longitude'])) {
                        $apiData['latitude'] = $averageCoordinates['latitude'];
                        $apiData['longitude'] = $averageCoordinates['longitude'];
                    }
    
                    // Check if the event has ended
                    if ($end_date && now()->gt($end_date)) {
                        // If the event has ended, delete the record if it exists
                        ApiData::where('api_source', 'QLD')
                               ->where('event_id', $attributes['id'])
                               ->delete();
                        continue; // Skip further processing for this feature
                    }
    
                    // Only proceed if the event has not ended
                    if ($end_date && now()->lt($end_date)) {
                        try {
                            ApiData::updateOrCreate(
                                [
                                    'api_source' => 'QLD',
                                    'event_id' => $attributes['id'],
                                ],
                                $apiData
                            );
                        } catch (\Exception $e) {
                            Log::error('Error creating or updating record for event ID ' . $attributes['id'] . $e->getMessage());
                        }
                    }
                } 
                // Return success status
                return ['status' => $response->status(), 'error' => null,  'requestedTime' => $requestedTime, 'state' => 'QLD'];
            } else {
                // Log error and return status
                $errorMsg = 'Request to QLD API was not successful. Status: ' . $response->status();
                Log::error($errorMsg);
                return ['status' => $response->status(), 'error' => $errorMsg,  'requestedTime' => $requestedTime, 'state' => 'QLD'];
            }
        } catch (\Exception $e) {
            // Log general exception and return error message
            $errorMsg = 'QLD API request failed: ' . $e->getMessage();
            Log::error($errorMsg);
            return ['status' => null, 'error' => $errorMsg,  'requestedTime' => $requestedTime, 'state' => 'QLD'];
        }
    }

    private function convertComparedTimestampToDatetime($timestamp)
    {
        return \Carbon\Carbon::createFromTimestamp($timestamp / 1000); // Assuming the timestamp is in milliseconds
    }
    
    private function getAverageCoordinates($geometry)
    {
        if (!isset($geometry['coordinates']) || empty($geometry['coordinates'])) {
            // If coordinates don't exist or are empty, return null
            return [
                'latitude' => null,
                'longitude' => null,
            ];
        }
    
        $type = $geometry['type'];
        $coordinates = $geometry['coordinates'];
    
        if ($type === 'Point') {
            // Return the single coordinate
            return [
                'latitude' => $coordinates[1],
                'longitude' => $coordinates[0],
            ];
        }
    
        if ($type === 'LineString' || $type === 'MultiPoint') {
            // Calculate the average for a single line or multi-point array
            return $this->calculateAverageCoordinates([$coordinates]);
        }
    
        if ($type === 'MultiLineString') {
            // Calculate the average for multiple lines
            return $this->calculateAverageCoordinates($coordinates);
        }
    
        // Default return if an unexpected type is encountered
        return [
            'latitude' => null,
            'longitude' => null,
        ];
    }
    
    private function calculateAverageCoordinates($lines)
    {
        $totalLat = 0;
        $totalLng = 0;
        $count = 0;
    
        foreach ($lines as $line) {
            foreach ($line as $point) {
                $totalLng += $point[0];
                $totalLat += $point[1];
                $count++;
            }
        }
    
        return [
            'latitude' => $totalLat / $count,
            'longitude' => $totalLng / $count,
        ];
    }
    
    private function convertTimestampToDatetime($timestamp)
    {
        if ($timestamp && $timestamp > 0) {
            return Carbon::createFromTimestampMs($timestamp)->toDateTimeString();
        } else {
            return null; // Return null if the timestamp is invalid or zero
        }
    }
    
    private function convertIsoToDatetime($isoDate)
    {
        if (empty($isoDate)) {
            return null; // Return null if the date is empty
        }
    
        try {
            $datetime = new \DateTime($isoDate);
            // Check if the year is within a valid range (e.g., between 1000 and 9999)
            $year = $datetime->format('Y');
            if ($year < 1000 || $year > 9999) {
                return null; // Return null for invalid years
            }
            return $datetime->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            return null; // Return null if DateTime creation fails
        }
    }
        
    private function generateImpactDescription(array $impactedLanes)
    {
        $impacts = [];
        foreach ($impactedLanes as $lane) {
            $direction = $lane['affectedDirection'] ?? '';
            $extent = $lane['extent'] ?? '';
            $description = $lane['description'] ?? '';
            $roadType = $lane['roadType'] ?? '';
    
            $impacts[] = "In $direction, $extent $roadType is impacted. Details: $description.";
        }
        return implode(', ', $impacts);
    }
    
    private function createQLDImpactSentence($impact) {
        // Check if 'towards' is provided
        $towards_phrase = $impact['towards'] ? " towards {$impact['towards']}" : "";
    
        // Construct the sentence
        $sentence = "In the {$impact['direction']} direction{$towards_phrase}, the road is impacted by {$impact['impact_type']} with {$impact['impact_subtype']}. {$impact['delay']}.";
    
        return $sentence;
    }

    private function convertComparedIsoToDatetime($isoString)
    {
        return $isoString ? \Carbon\Carbon::parse($isoString) : null;
    }
}