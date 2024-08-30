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
            $vicResponse = $this->processVICApi();
    
            $request_log_id = $this->logRequest(200, $requestedTime);
            
            // Flatten all responses into a single array
            $responses = array_merge([$saResponse], $nswResponses, [$qldResponse], [$vicResponse]);
        
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
     
    private function processVICApi()
    {
        $requestedTime = now(); // Log request time for this individual API

        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://data-exchange-test-api.vicroads.vic.gov.au/opendata/disruptions/v1/planned?format=GeoJson'],
            ['url' => 'https://data-exchange-test-api.vicroads.vic.gov.au/opendata/disruptions/v2/unplanned?format=GeoJson'],
        ];
    
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
    
                        // Only proceed if the current time is before the end date
                        if ($end_date && now()->lt($end_date)) {
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
                    }
                    // Return success status
                    return ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                } else {
                    // Log error and return status
                    $errorMsg = 'Request to ' . $url . ' was not successful. Status: ' . $response->status();
                    Log::error($errorMsg);
                    return ['status' => $response->status(), 'error' => $errorMsg , 'requestedTime' => $requestedTime, 'state' => 'VIC'];
                }
            } catch (\Exception $e) {
                // Log exception and return error message
                $errorMsg = 'API request to ' . $url . ' failed: ' . $e->getMessage();
                Log::error($errorMsg);
                return ['status' => null, 'error' => $errorMsg,  'requestedTime' => $requestedTime, 'state' => 'VIC'];
            }
        }
    }
    
    private function processNSWApi()
    {
        $requestedTime = now(); // Log request time for this individual API
        $results = []; // Array to store results of each request
    
        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/fire/open', 'event_type' => 'Fire'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/flood/open', 'event_type' => 'Flood'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/incident/open', 'event_type' => 'Incident'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/open', 'event_type' => 'Major Event'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/open', 'event_type' => 'Roadwork'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/regional-lga-incident/open', 'event_type' => 'Regional LGA Incident'],
        ];
    
        foreach ($requests as $request) {
            Log::info('Requesting data from ' . $request['event_type']);
            $url = $request['url'];
            $staticEventType = $request['event_type'];
    
            try {
                $response = Http::timeout(60)->withHeaders([
                    'Authorization' => 'apiKey eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJEMmxnb1U3WkpaSWJBbFRNUFlUaXBGZ2F4NEtaWmw1WVBEMUNodGV2bTRVIiwiaWF0IjoxNzI0MDYyMTc4fQ.zSYlt86pa-YcqmG2NqrD-uVHqZYFDe0bzUHTjPMZOY0',
                    'Accept' => 'application/json',
                ])->get($url);
    
                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['features'] as $feature) {
                        // Processing logic here...
                    }
                    // Add success result to results array
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
        $requestedTime = now(); // Log request time for this individual API

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
                            Log::error('Error creating or updating record for event ID ' . $attributes['id'] . ': ' . $e->getMessage());
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
    private function convertComparedTimestampToDatetime($timestamp)
    {
        return \Carbon\Carbon::createFromTimestamp($timestamp / 1000); // Assuming the timestamp is in milliseconds
    }
}
