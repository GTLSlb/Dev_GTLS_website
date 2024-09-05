<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use App\Models\ApiData;
use App\Models\ApiRequestLogs;
class ApiController extends Controller
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    private function logRequest($status, $requestedTime, $response_msg = null)
    {
        DB::table('request_logs')->insert([
            'method' => 'API Run',
            'response_status' => $status,
            'request_time' => $requestedTime,
            'response_msg' => $response_msg,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function fetchData()
    {
        ini_set('max_execution_time', 300); 
        // Log the request details
        $requestedTime = now();
        try {
            // Fetch data from each API
            $this->apiService->fetchAndSaveData();
            $this->logRequest(200, $requestedTime);
            return response()->json(['message' => 'Data fetched and saved successfully.']);
        } catch (\Exception $e) {
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }

    }

    public function fetchNSWData()
    {
        ini_set('max_execution_time', 300); 
        // Log the request details
        $requestedTime = now();
        try {
            // Fetch data from each API
            $this->apiService->processNSWApi();
            $this->logRequest(200, $requestedTime);
            return response()->json(['message' => 'Data fetched and saved successfully.']);
        } catch (\Exception $e) {
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }
    }

    public function fetchQLDData()
    {
        ini_set('max_execution_time', 300); 
        // Log the request details
        $requestedTime = now();
        try {
            // Fetch data from each API
            $this->apiService->processQLDApi();
            $this->logRequest(200, $requestedTime);
            return response()->json(['message' => 'Data fetched and saved successfully.']);
        } catch (\Exception $e) {
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }
    }

    public function fetchSAData()
    {
        ini_set('max_execution_time', 300); 
        // Log the request details
        $requestedTime = now();
        try {
            // Fetch data from each API
            $this->apiService->processSAApi();
            $this->logRequest(200, $requestedTime);
            return response()->json(['message' => 'Data fetched and saved successfully.']);
        } catch (\Exception $e) {
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }
    }

    public function fetchVICData()
    {
        ini_set('max_execution_time', 300); 
        // Log the request details
        $requestedTime = now();
        try {
            // Fetch data from each API
            $this->apiService->processVICPlannedApi();
            $this->apiService->processVICUnPlannedApi();
            $this->logRequest(200, $requestedTime);
            return response()->json(['message' => 'Data fetched and saved successfully.']);
        } catch (\Exception $e) {
            $this->logRequest(500, $requestedTime, $e->getMessage());
        }
    }

    public function index(Request $request)
    {
        // Retrieve query parameters for filtering
        $apiSource = $request->query('api_source');
        $eventId = $request->query('event_id');
        $eventCategoryIds = $request->query('event_category_ids'); // Accept an array of event category IDs
        
        // Build the query
        $query = ApiData::query();
    
        if ($apiSource) {
            $query->where('api_source', $apiSource);
        }
    
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
    
        if ($eventCategoryIds) {
            // Ensure $eventCategoryIds is an array before applying filter
            $query->whereIn('event_category_id', (array) $eventCategoryIds);
        }
    
        // Filter out records with end_date before the current date
        $query->where(function($q) {
            $q->whereNull('end_date')  // Include records with no end_date
              ->orWhere('end_date', '>=', now());  // Include records where end_date is today or in the future
        });
    
        // Get the filtered results
        $apiData = $query->get();
    
        // Transform the data to rename fields and ensure lat/lng are numbers
        $transformedData = $apiData->filter(function ($item) {
            // Ensure lat and lng are not null
            return isset($item->latitude) && isset($item->longitude);
        })->map(function ($item) {
            return [
                'id' => $item->id,
                'api_source' => $item->api_source,
                'event_id' => $item->event_id,
                'description' => $item->description,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'last_updated' => $item->lastUpdated_date,
                'lat' => (float) $item->latitude,
                'lng' => (float) $item->longitude,
                'suburb' => $item->suburb,
                'traffic_direction' => $item->traffic_direction,
                'road_name' => $item->road_name,
                'status' => $item->status,
                'event_type' => $item->event_type,
                'impact' => $item->impact,
                'advice' => $item->advice,
                'otherAdvice' => $item->otherAdvice,
                'information' => $item->information,
                'source_url' => $item->source_url,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        })->values()->all();  // Use values() to reindex the array and all() to ensure it's an array
    
        // Return the transformed results as a JSON response
        return response()->json($transformedData);
    }
    
    public function getRecentRecords(Request $request)
    {
        // Start query logging for debugging purposes
        DB::enableQueryLog();
    
        // Retrieve the last successful service run log
        $lastLog = DB::table('request_logs')
            ->where('method', 'Service Run')
            ->where('response_status', 200)
            ->orderBy('created_at', 'desc')
            ->first();
    
        // Determine the updated time based on the last log
        $updated = $lastLog ? $lastLog->request_time : null;
    
        // Retrieve the event category IDs from the query parameters
        $eventCategoryIds = $request->query('event_category_ids');
    
        // Convert the event category IDs to an array if it's a single value or not already an array
        if ($eventCategoryIds) {
            $eventCategoryIds = is_array($eventCategoryIds) ? $eventCategoryIds : explode(',', str_replace(['[', ']'], '', $eventCategoryIds));
        }
    
        // Initialize the query for ApiData
        $query = ApiData::query();
    
        // Apply filters based on the last log's created_at time, if available
        if ($updated) {
            $query->where(function ($q) use ($updated) {
                $q->where('created_at', '>=', $updated)
                  ->orWhere('updated_at', '>=', $updated);
            });
        }
    
        // Apply filter for event category IDs if provided
        if (!empty($eventCategoryIds)) {
            $query->whereIn('event_category_id', $eventCategoryIds);
        }
    
        // Execute the query to get the filtered results
        $apiData = $query->get();
    
        // Optional: View the query log for debugging
        // dd(DB::getQueryLog());
    
        // Transform the data to rename fields and ensure lat/lng are numbers
        $transformedData = $this->transformData($apiData);
    
        // Return the transformed results as a JSON response
        return response()->json($transformedData);
    }
    
    protected function transformData($apiData)
    {
        return $apiData->filter(function ($item) {
            // Ensure lat and lng are not null
            return isset($item->latitude) && isset($item->longitude);
        })->map(function ($item) {
            return [
                'id' => $item->id,
                'api_source' => $item->api_source,
                'event_id' => $item->event_id,
                'event_category_id' => $item->event_category_id,
                'description' => $item->description,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'last_updated' => $item->lastUpdated_date,
                'lat' => (float) $item->latitude,
                'lng' => (float) $item->longitude,
                'suburb' => $item->suburb,
                'traffic_direction' => $item->traffic_direction,
                'road_name' => $item->road_name,
                'status' => $item->status,
                'event_type' => $item->event_type,
                'impact' => $item->impact,
                'advice' => $item->advice,
                'otherAdvice' => $item->otherAdvice,
                'information' => $item->information,
                'source_url' => $item->source_url,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        })->values()->all();
    }

    public function getLastUpdatedAt(Request $request)
    {
        $lastLog = DB::table('request_logs')
            ->where('method', 'Service Run')
            ->where('response_status', 200)
            ->orderBy('created_at', 'desc')
            ->first();
    
        // Return the last updated_at or a message if no record is found
        return $lastLog ? $lastLog->created_at : null;
    }
}
