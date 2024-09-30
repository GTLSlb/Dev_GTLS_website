<?php

namespace App\Services;

use App\Models\ApiData;
use App\Models\EventsCategory;
use App\Models\TrafficDataNSW;
use App\Models\TrafficDataQLD;
use App\Models\TrafficDataSA;
use App\Models\TrafficDataVIC;
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
            // $responses = array_merge([$qldResponse]);

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
    
                foreach ($data['features'] as $feature) {
                    $attributes = $feature['attributes'];
                    $geometry = $feature['geometry'] ?? null; // Check if geometry exists
    
                    // Default to 'Point' if no geometry type is provided
                    $geometryType = 'Point';
                    $latitude = null;
                    $longitude = null;
    
                    // Check if x and y coordinates exist for the Point geometry
                    if ($geometry && isset($geometry['x']) && isset($geometry['y'])) {
                        $latitude = $attributes['LATITUDE'];
                        $longitude = $attributes['LONGITUDE'];
                    }
    
                    // Convert end date to a DateTime object
                    $endDateTime = $this->convertComparedTimestampToDatetime($attributes['END_DATE']);
    
                    // Check if the event has ended
                    if ($endDateTime && now()->gt($endDateTime)) {
                        TrafficDataSA::where('api_source', 'SA')
                            ->where('event_id', $attributes['ROADWORKS_AND_INCIDENTS_ID'])
                            ->delete();
                        continue; // Skip further processing for this feature
                    }
    
                    // Store both point and geometry data, excluding 'location' for now
                    $trafficData = TrafficDataSA::updateOrCreate(
                        [
                            'api_source' => 'SA',
                            'event_id' => $attributes['ROADWORKS_AND_INCIDENTS_ID'],
                        ],
                        [
                            'description' => $attributes['DESCRIPTION'],
                            'start_date' => $this->convertTimestampToDatetime($attributes['START_DATE']),
                            'event_category_id' => $this->findEventCategoryId($attributes['REC_TYPE']),
                            'end_date' => $endDateTime,
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                            'geometry_type' => $geometryType, // Set geometry type to 'Point'
                            'geometry_coordinates' => json_encode([$longitude, $latitude]), // Store the x and y as JSON
                            'suburb' => $attributes['SUBURB'],
                            'traffic_direction' => $attributes['TRAFFIC_DIR'],
                            'road_name' => $attributes['LOCAL_ROAD'],
                            'status' => $attributes['ACTIVE'],
                            'event_type' => $attributes['REC_TYPE'],
                            'impact' => $attributes['NO_LANES_CLOSED'],
                            'source_url' => $attributes['source_url'] ?? '',
                            'advice' => $attributes['advice'] ?? '',
                            'information' => $attributes['information'] ?? '',
                        ]
                    );
    
                    // Now update the location field separately with a raw query
                    if ($latitude && $longitude) {
                        DB::table('traffic_data_sa')
                            ->where('id', $trafficData->id)
                            ->update([
                                'location' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)', 4326)")
                            ]);
                    }
                }
    
                return ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'SA'];
            } else {
                return ['status' => $response->status(), 'error' => 'Request was not successful', 'requestedTime' => $requestedTime, 'state' => 'SA'];
            }
        } catch (\Exception $e) {
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
                        $geometry = $feature['geometry'] ?? null;
                        $geometryType = $geometry['type'] ?? 'Point'; // Default to 'Point' if not provided
                        $geometryCoordinates = [];
    
                        // Handle GeometryCollection or other geometry types
                        if ($geometryType === 'GeometryCollection' && isset($geometry['geometries'])) {
                            foreach ($geometry['geometries'] as $geom) {
                                if ($geom['type'] === 'Point') {
                                    $geometryType = 'Point';
                                    $geometryCoordinates = $geom['coordinates'];
                                    break;
                                }
                            }
                        } else {
                            $geometryCoordinates = $geometry['coordinates'] ?? [];
                        }
    
                        $longitude = $geometryCoordinates[0] ?? null;
                        $latitude = $geometryCoordinates[1] ?? null;
    
                        $eventType = $attributes['eventType'] ?? 'Unknown';
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['description'] ?? '';
                        $start_date = $this->convertIsoToDatetime($attributes['duration']['start'] ?? null);
                        $end_date = $this->convertIsoToDatetime($attributes['duration']['end'] ?? null);
    
                        $dataToInsert = [
                            'api_source' => 'VIC',
                            'event_id' => $attributes['id'],
                            'event_category_id' => $this->findEventCategoryId($eventType),
                            'description' => $description,
                            'start_date' => $start_date,
                            'end_date' => $end_date,
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                            'geometry_type' => $geometryType,
                            'geometry_coordinates' => json_encode($geometryCoordinates),
                            'suburb' => $attributes['roads'][0]['suburb'] ?? '',
                            'traffic_direction' => $attributes['impact']['direction'] ?? '',
                            'road_name' => $attributes['closedRoadName'] ?? '',
                            'status' => $status,
                            'event_type' => $eventType,
                            'impact' => $attributes['impact']['impactType'] ?? '',
                            'source_url' => $attributes['source']['sourceName'] ?? '',
                            'advice' => $attributes['advice'] ?? '',
                            'information' => $attributes['information'] ?? '',
                        ];
    
                        // Insert or update the record in the database
                        $trafficData = TrafficDataVIC::updateOrCreate(
                            [
                                'api_source' => 'VIC',
                                'event_id' => $attributes['id'],
                            ],
                            $dataToInsert
                        );
    
                        // Update location field separately using raw query
                        if ($latitude && $longitude) {
                            DB::table('traffic_data_vic')
                                ->where('id', $trafficData->id)
                                ->update([
                                    'location' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)', 4326)")
                                ]);
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
                $results[] = ['status' => null, 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'VIC'];
            }
        }
    
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
                        $geometry = $feature['geometry'] ?? null;
    
                        // Handle geometry data
                        $geometryType = $geometry['type'] ?? 'Point';
                        $geometryCoordinates = [];
    
                        if ($geometryType === 'Point') {
                            $geometryCoordinates = $geometry['coordinates'];
                        }
    
                        $longitude = $geometryCoordinates[0] ?? null;
                        $latitude = $geometryCoordinates[1] ?? null;
    
                        $eventType = $attributes['eventType'] ?? 'Unknown';
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['description'] ?? '';
                        $start_date = $this->convertIsoToDatetime($attributes['created'] ?? null);
                        $suburb = $attributes['reference']['startIntersectionLocality'] ?? '';
                        $traffic_direction = $attributes['impact']['direction'] ?? null;
                        $road_name = $attributes['closedRoadName'] ?? '';
                        $impact = $attributes['impact']['impactType'] ?? '';
    
                        $dataToInsert = [
                            'api_source' => 'VIC',
                            'event_id' => $attributes['id'],
                            'event_category_id' => $this->findEventCategoryId($eventType),
                            'description' => $description,
                            'start_date' => $start_date,
                            'latitude' => $latitude,
                            'longitude' => $longitude,
                            'geometry_type' => $geometryType,
                            'geometry_coordinates' => json_encode($geometryCoordinates),
                            'suburb' => $suburb,
                            'traffic_direction' => $traffic_direction,
                            'road_name' => $road_name,
                            'status' => $status,
                            'event_type' => $eventType,
                            'impact' => $impact,
                            'source_url' => $attributes['source']['sourceName'] ?? '',
                            'advice' => $attributes['advice'] ?? '',
                            'information' => $attributes['information'] ?? '',
                        ];
    
                        // Insert or update the record in the database
                        $trafficData = TrafficDataVIC::updateOrCreate(
                            [
                                'api_source' => 'VIC',
                                'event_id' => $attributes['id'],
                            ],
                            $dataToInsert
                        );
    
                        // Update location field separately using raw query
                        if ($latitude && $longitude) {
                            DB::table('traffic_data_vic')
                                ->where('id', $trafficData->id)
                                ->update([
                                    'location' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)', 4326)")
                                ]);
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
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/regional-lga-incident/all', 'event_type' => 'Regional LGA Incident'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/flood/all', 'event_type' => 'Flood'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/incident/all', 'event_type' => 'Incident'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/all', 'event_type' => 'Major Event'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/all', 'event_type' => 'Roadwork'],
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
    
                        // Check if the event should be processed based on the "ended" flag
                        $ended = $attributes['ended'] ?? false;
    
                        if ($ended) {
                            // If "ended" is true, delete the record if it exists
                            TrafficDataNSW::where('api_source', 'NSW')
                                   ->where('event_id', $feature['id'])
                                   ->delete();
                            continue; // Skip further processing for this feature
                        }
    
                        // Safely access properties with null coalescing operator
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['displayName'] ?? '';
                        $end_date = $this->convertTimestampToDatetime($attributes['end'] ?? null);
                        $start_date = $this->convertTimestampToDatetime($attributes['created'] ?? null);
                        $lastUp_date = $this->convertTimestampToDatetime($attributes['lastUpdated'] ?? null);
    
                        // Handle geometry type and coordinates
                        $geometryType = $geometry['type'] ?? 'Point'; // Default to 'Point' if not provided
                        $geometryCoordinates = [];
    
                        if ($geometryType === 'Point') {
                            // If the geometry type is Point, store coordinates directly
                            $geometryCoordinates = $geometry['coordinates'];
                            $longitude = $geometry['coordinates'][0] ?? null;
                            $latitude = $geometry['coordinates'][1] ?? null;
                        } else {
                            // Store other geometry types as JSON
                            $geometryCoordinates = json_encode($geometry['coordinates'] ?? []);
                            $longitude = null;
                            $latitude = null;
                        }
    
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
    
                        DB::transaction(function () use ($feature, $description, $start_date, $end_date, $lastUp_date, $latitude, $longitude, $suburb, $traffic_direction, $road_name, $status, $staticEventType, $impact, $source_url, $combinedAdvice, $attributes, $geometryType, $geometryCoordinates) {
    
                            // Create or update the record, excluding the 'location' field
                            $trafficData = TrafficDataNSW::updateOrCreate(
                                [
                                    'api_source' => 'NSW',
                                    'event_id' => $feature['id'],
                                ],
                                [
                                    'description' => $description,
                                    'end_date' => $end_date,
                                    'event_category_id' => $this->findEventCategoryId($staticEventType),
                                    'start_date' => $start_date,
                                    'lastUpdated_date' => $lastUp_date,
                                    'latitude' => $latitude,
                                    'longitude' => $longitude,
                                    'geometry_type' => $geometryType,
                                    'geometry_coordinates' => is_array($geometryCoordinates) ? json_encode($geometryCoordinates) : $geometryCoordinates,
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
                        
                            // Now, execute a raw query to update the 'location' field
                            DB::table('traffic_data_nsw')
                                ->where('id', $trafficData->id) // Use the ID of the created/updated model
                                ->update([
                                    'location' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)', 4326)")
                                ]);
                        });
                        
                    }
                    // Add success result to results array
                    $results[] = ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'NSW', 'event_type' => $staticEventType];
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
    
                    $geometry = $feature['geometry'] ?? null;
                    $geometryType = $geometry['type'] ?? 'Point'; // Default to 'Point' if not provided
                    $geometryCoordinates = [];
                    $latitude = null;
                    $longitude = null;
    
                    // Handle GeometryCollection or other geometry types
                    if ($geometryType === 'GeometryCollection' && isset($geometry['geometries'])) {
                        // Check if there's a LineString
                        $lineStringFound = false;
                        foreach ($geometry['geometries'] as $geom) {
                            if ($geom['type'] === 'LineString') {
                                $geometryType = 'LineString';
                                $geometryCoordinates = $geom['coordinates'];
                                $lineStringFound = true;
                                break; // Exit loop after finding the first LineString
                            }
                        }
    
                        // If no LineString found, take the first Point
                        if (!$lineStringFound) {
                            foreach ($geometry['geometries'] as $geom) {
                                if ($geom['type'] === 'Point') {
                                    $geometryType = 'Point';
                                    $geometryCoordinates = $geom['coordinates'];
                                    $longitude = $geom['coordinates'][0] ?? null;
                                    $latitude = $geom['coordinates'][1] ?? null;
                                    break; // Exit loop after finding the first Point
                                }
                            }
                        }
                    } else {
                        // If not a GeometryCollection, use the provided type and coordinates
                        $geometryCoordinates = $geometry['coordinates'] ?? [];
                        if ($geometryType === 'Point') {
                            $longitude = $geometry['coordinates'][0] ?? null;
                            $latitude = $geometry['coordinates'][1] ?? null;
                        }
                    }
    
                    $averageCoordinates = $this->getAverageCoordinates($geometry);
                    $start_date = $this->convertIsoToDatetime($attributes['duration']['start'] ?? null);
                    $end_date = $this->convertIsoToDatetime($attributes['duration']['end'] ?? null);
    
                    $apiData = [
                        'description' => $attributes['description'],
                        'start_date' => $start_date,
                        'end_date' => $end_date,
                        'geometry_type' => $geometryType,
                        'geometry_coordinates' => is_array($geometryCoordinates) ? json_encode($geometryCoordinates) : $geometryCoordinates,
                        'suburb' => $attributes['road_summary']['locality'] ?? '',
                        'traffic_direction' => $attributes['impact']['direction'] ?? '',
                        'road_name' => $attributes['road_summary']['road_name'] ?? '',
                        'status' => is_array($attributes['status']) ? implode(' / ', $attributes['status']) : $attributes['status'],
                        'event_type' => is_array($attributes['event_type']) ? implode(' / ', $attributes['event_type']) : ($attributes['event_type'] ?? 'Unknown'),
                        'event_category_id' => $this->findEventCategoryId($attributes['event_type'] ?? 'Unknown'),
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
                        TrafficDataQLD::where('api_source', 'QLD')
                            ->where('event_id', $attributes['id'])
                            ->delete();
                        continue;
                    }
    
                    if ($end_date && now()->lt($end_date)) {
                        try {
                            // Create or update the record, excluding the 'location' field
                            $trafficData = TrafficDataQLD::updateOrCreate(
                                [
                                    'api_source' => 'QLD',
                                    'event_id' => $attributes['id'],
                                ],
                                $apiData
                            );
    
                            // Now, update the 'location' field separately using a raw query
                            if (!is_null($averageCoordinates['latitude']) && !is_null($averageCoordinates['longitude'])) {
                                DB::table('traffic_data_qld')
                                    ->where('id', $trafficData->id) // Use the ID of the created/updated model
                                    ->update([
                                        'location' => DB::raw("ST_GeomFromText('POINT($longitude $latitude)', 4326)")
                                    ]);
                            }
    
                        } catch (\Exception $e) {
                            Log::error('Error creating or updating record for event ID ' . $attributes['id'] . ' from QLD API: ' . $e->getMessage());
                        }
                    }
                }
                return ['status' => $response->status(), 'error' => null, 'requestedTime' => $requestedTime, 'state' => 'QLD'];
            } else {
                $errorMsg = 'Request to QLD API was not successful. Status: ' . $response->status();
                Log::error($errorMsg);
                return ['status' => $response->status(), 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'QLD'];
            }
        } catch (\Exception $e) {
            $errorMsg = 'QLD API request failed: ' . $e->getMessage();
            Log::error($errorMsg);
            return ['status' => null, 'error' => $errorMsg, 'requestedTime' => $requestedTime, 'state' => 'QLD'];
        }
    }
    
    
    private function convertComparedTimestampToDatetime($timestamp)
    {
        return \Carbon\Carbon::createFromTimestamp($timestamp / 1000); // Assuming the timestamp is in milliseconds
    }
    
    private function getFirstCoordinate($geometry)
    {
        if (!isset($geometry['coordinates']) || empty($geometry['coordinates'])) {
            return [
                'latitude' => null,
                'longitude' => null,
            ];
        }
    
        $type = $geometry['type'];
        $coordinates = $geometry['coordinates'];
    
        if ($type === 'Point') {
            return [
                'latitude' => $coordinates[1],
                'longitude' => $coordinates[0],
            ];
        }
    
        if ($type === 'LineString' || $type === 'MultiPoint') {
            return [
                'latitude' => $coordinates[0][1],
                'longitude' => $coordinates[0][0],
            ];
        }
    
        if ($type === 'MultiLineString') {
            return [
                'latitude' => $coordinates[0][0][1],
                'longitude' => $coordinates[0][0][0],
            ];
        }
    
        return [
            'latitude' => null,
            'longitude' => null,
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

        
    function findEventCategoryId($eventDescription)
    {
        $EVENT_TYPE_MAPPING = [
            'Roadworks' => ['ROADWORKS', '24HR ROADWORKS', 'Roadwork', 'Roadworks'],
            'Alpine' => ['Alpine'],
            'Flooding' => ['Flooding'],
            'Congestion' => ['Congestion'],
            'Hazard' => ['Hazard', 'Vehicle fire', 'Fire', 'Vehicle rollover', 'Landslip'],
            'Regional LGA Incident' => ['Regional LGA Incident', 'Emergency Incident'],
            'Major Event' => ['Major Event', 'Special event', 'Demonstration'],
            'Incident' => ['INCIDENT', 'COLLISION', 'Incident', 'Crash', 'Emergency Incident'],
            'Other' => ['Equipment damage', 'Equipment fault']
        ];
    
        // Loop through each category in the mapping
        foreach ($EVENT_TYPE_MAPPING as $category => $descriptions) {
            // Check if the event description matches any description in the array
            if (in_array($eventDescription, $descriptions)) {
                
                // Find the event category record by event_category
                $eventCategory = EventsCategory::where('event_category', $category)->first();
               
                // If a record is found, return its id
                if ($eventCategory) {
                    return $eventCategory->id;
                }
            }
        }
    
        // Return null if no matching category was found
        return null;
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
  

}
