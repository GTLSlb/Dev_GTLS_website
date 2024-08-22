<?php

namespace App\Services;

use App\Models\ApiData;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class ApiService
{
    public function fetchAndSaveData()
    {
        // Fetch data from each API
        $this->processSAApi();
        $this->processNSWApi();
        $this->processQLDApi();
    }

    private function processSAApi()
    {
        try {
            $response = Http::get('https://maps.sa.gov.au/arcgis/rest/services/DPTIExtTransport/TrafficSAOpenData/MapServer/0/query?where=1%3D1&outFields=*&f=json');
    
            if ($response->successful()) {
                $data = $response->json();
    
                foreach ($data['features'] as $feature) {
                    $attributes = $feature['attributes'];
    
                    ApiData::updateOrCreate(
                        [
                            'api_source' => 'SA',
                            'event_id' => $attributes['ROADWORKS_AND_INCIDENTS_ID'],
                        ],
                        [
                            'description' => $attributes['DESCRIPTION'],
                            'start_date' => $this->convertTimestampToDatetime($attributes['START_DATE']),
                            'end_date' => $this->convertTimestampToDatetime($attributes['END_DATE']),
                            'latitude' => $attributes['LATITUDE'],
                            'longitude' => $attributes['LONGITUDE'],
                            'suburb' => $attributes['SUBURB'],
                            'traffic_direction' => $attributes['TRAFFIC_DIR'],
                            'road_name' => $attributes['LOCAL_ROAD'], // Road Name
                            'status' => $attributes['ACTIVE'], // Assuming 'ACTIVE' is status
                            'event_type' => $attributes['REC_TYPE'], // Event Type
                            'impact' => $attributes['NO_LANES_CLOSED'], // Impact
                            'source_url' => $attributes['GIS_LINK_ID'], // Assuming GIS_LINK_ID could be a source identifier
                            'advice' => $attributes['advice'] ?? '', // Insert combined advice
                            'information' => $attributes['information'] ?? '',
                        ]
                    );
                }
            }
        } catch (\Exception $e) {
            Log::error('SA API request failed: ' . $e->getMessage());
        }
    }
    
    private function processVICApi()
    {
        try {
            $response = Http::get('https://vicroadsopendata-vicroadsmaps.opendata.arcgis.com/datasets/traffic-volume/api');

            if ($response->successful()) {
                $data = $response->json();

                foreach ($data['features'] as $feature) {
                    $attributes = $feature['attributes'];
                    $geometry = $feature['geometry'];

                    $averageCoordinates = $this->getAverageCoordinates($geometry);

                    $apiData = [
                        'api_source' => 'VIC',
                        'event_id' => $attributes['OBJECTID_1'],
                        'description' => $attributes['HMGNS_LNK_DESC'],
                        'start_date' => null, // No date fields in the provided JSON, so set to null
                        'end_date' => null,   // No date fields in the provided JSON, so set to null
                        'suburb' => $attributes['LGA_SHORT_NM'],
                        'traffic_direction' => $attributes['FLOW'],
                        'road_name' => $attributes['LOCAL_ROAD_NM'],
                        'status' => null, // No status field in the provided JSON, so set to null
                        'event_type' => 'Traffic Volume', // Example, set a static event type
                        'impact' => null, // No impact field in the provided JSON, so set to null
                        'source_url' => null, // No source URL in the provided JSON, so set to null
                    ];

                    if (!is_null($averageCoordinates['latitude']) && !is_null($averageCoordinates['longitude'])) {
                        $apiData['latitude'] = $averageCoordinates['latitude'];
                        $apiData['longitude'] = $averageCoordinates['longitude'];
                    }

                    // Check for duplicates before creating a new record
                    $existingData = ApiData::where('api_source', 'VIC')
                        ->where('event_id', $attributes['OBJECTID_1'])
                        ->first();

                    if ($existingData) {
                        // Update the existing record
                        $existingData->update($apiData);
                    } else {
                        // Create a new record
                        ApiData::create($apiData);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('VIC API request failed: ' . $e->getMessage());
        }
    }

    

    private function processNSWApi()
    {
        // Map URLs to their respective event types
        $requests = [
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/alpine/open', 'event_type' => 'Alpine'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/fire/open', 'event_type' => 'Fire'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/flood/open', 'event_type' => 'Flood'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/incident/open', 'event_type' => 'Incident'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/majorevent/open', 'event_type' => 'Major Event'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/roadwork/open', 'event_type' => 'Roadwork'],
            ['url' => 'https://api.transport.nsw.gov.au/v1/live/hazards/regional-lga-incident/open', 'event_type' => 'Regional LGA Incident'],
        ];
    
        foreach ($requests as $request) {
            $url = $request['url'];
            $staticEventType = $request['event_type'];
    
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'apiKey eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJEMmxnb1U3WkpaSWJBbFRNUFlUaXBGZ2F4NEtaWmw1WVBEMUNodGV2bTRVIiwiaWF0IjoxNzI0MDYyMTc4fQ.zSYlt86pa-YcqmG2NqrD-uVHqZYFDe0bzUHTjPMZOY0',
                    'Accept' => 'application/json',
                ])->get($url);
    
                if ($response->successful()) {
                    $data = $response->json();
                    foreach ($data['features'] as $feature) {
                        $attributes = $feature['properties'];
    
                        // Check if each key exists before accessing it
                        $status = $attributes['status'] ?? null;
                        $description = $attributes['displayName'] ?? '';
                        $start_date = $this->convertTimestampToDatetime($attributes['created'] ?? null);
                        $end_date = $this->convertTimestampToDatetime($attributes['lastUpdated'] ?? null);
                        $latitude = $feature['geometry']['coordinates'][1] ?? null;
                        $longitude = $feature['geometry']['coordinates'][0] ?? null;
                        $suburb = $attributes['roads'][0]['suburb'] ?? '';
                        $traffic_direction = $attributes['impactingNetwork'] ?? '';
                        $road_name = $attributes['roads'][0]['mainStreet'] ?? '';
                        $impact = $attributes['impactingNetwork'] ?? '';
                        $source_url = $attributes['weblinkUrl'] ?? '';
    
                        // Combine AdviceA, AdviceB, AdviceC into one field
                        $adviceA = $attributes['AdviceA'] ?? '';
                        $adviceB = $attributes['AdviceB'] ?? '';
                        $adviceC = $attributes['AdviceC'] ?? '';
                        $combinedAdvice = implode(' / ', array_filter([$adviceA, $adviceB, $adviceC]));
    
                        try {
                            ApiData::updateOrCreate(
                                [
                                    'api_source' => 'NSW',
                                    'event_id' => $feature['id'],
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
                                    'event_type' => $staticEventType, // Use static event type
                                    'impact' => $impact,
                                    'source_url' => $source_url,
                                    'advice' => $combinedAdvice, // Insert combined advice
                                    'information' => $attributes['information'] ?? '',
                                ]
                            );
                        } catch (\Exception $e) {
                            Log::error('Error creating or updating record for event ID ' . $feature['id'] . ' from URL ' . $url . ': ' . $e->getMessage());
                        }
                    }
                } else {
                    Log::error('Request to ' . $url . ' was not successful. Status: ' . $response->status());
                }
            } catch (\Exception $e) {
                Log::error('API request to ' . $url . ' failed: ' . $e->getMessage());
            }
        }
    }
    
    
    
    
    private function processQLDApi()
    {
        try {
            $response = Http::get('https://api.qldtraffic.qld.gov.au/v2/events?apikey=3e83add325cbb69ac4d8e5bf433d770b');
    
            if ($response->successful()) {
                $data = $response->json();
    
                foreach ($data['features'] as $feature) {
                    $attributes = $feature['properties'];
                    $geometry = $feature['geometry'];
    
                    $averageCoordinates = $this->getAverageCoordinates($geometry);
    
                    // Handle array fields like 'advice'
                    $advice = isset($attributes['advice']) && is_array($attributes['advice'])
                        ? implode(' / ', $attributes['advice'])
                        : $attributes['advice'];
    
                    $apiData = [
                        'description' => $attributes['description'],
                        'start_date' => $this->convertIsoToDatetime($attributes['duration']['start']),
                        'end_date' => $this->convertIsoToDatetime($attributes['duration']['end']),
                        'suburb' => $attributes['road_summary']['locality'] ?? '',
                        'traffic_direction' => $attributes['impact']['direction'] ?? '',
                        'road_name' => $attributes['road_summary']['road_name'] ?? '', // Road Name
                        'status' => is_array($attributes['status']) ? implode(' / ', $attributes['status']) : $attributes['status'], // Handle Status
                        'event_type' => is_array($attributes['event_type']) ? implode(' / ', $attributes['event_type']) : $attributes['event_type'], // Handle Event Type
                        'impact' => is_array($attributes['impact']['impact_type']) ? implode(' / ', $attributes['impact']['impact_type']) : $attributes['impact']['impact_type'], // Handle Impact
                        'source_url' => $attributes['url'], // Source URL
                        'advice' => $advice, // Insert combined advice
                        'information' => is_array($attributes['information']) ? implode(' / ', $attributes['information']) : $attributes['information'], // Handle Information
                    ];
    
                    if (!is_null($averageCoordinates['latitude']) && !is_null($averageCoordinates['longitude'])) {
                        $apiData['latitude'] = $averageCoordinates['latitude'];
                        $apiData['longitude'] = $averageCoordinates['longitude'];
                    }
    
                    ApiData::updateOrCreate(
                        [
                            'api_source' => 'QLD',
                            'event_id' => $attributes['id'],
                        ],
                        $apiData
                    );
                }
            }
        } catch (\Exception $e) {
            Log::error('QLD API request failed: ' . $e->getMessage());
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
    
}
