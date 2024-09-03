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

    public function index(Request $request)
    {
        // Retrieve query parameters for filtering
        $apiSource = $request->query('api_source');
        $eventId = $request->query('event_id');
    
        // Build the query
        $query = ApiData::query();
    
        if ($apiSource) {
            $query->where('api_source', $apiSource);
        }
    
        if ($eventId) {
            $query->where('event_id', $eventId);
        }
    
        // // Filter out records with end_date before the current date
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
        // Retrieve the last successful service run log
        $lastLog = DB::table('request_logs')
            ->where('method', 'Service Run')
            ->where('response_status', 200)
            ->orderBy('created_at', 'desc')
            ->first();
    
        // Check if there is a last log available
        $updated = $lastLog ? $lastLog->request_time : null;
    
        // Build the query
        $query = ApiData::query();
    
        if ($updated) {
            // Apply the filter based on the last log's created_at if available
            $query->where('created_at', '>=', $updated)
                  ->orWhere('updated_at', '>=', $updated);
        }
    

        
        // // Get the current date and time

        // $currentDateTime = now();
    
        // // Calculate the range for 3 hours before and after the current date and time
        // $startRange = $currentDateTime->copy()->subHours(3)->utc();
        // $formattedStartDate = Carbon::parse($startRange)->format('Y-m-d H:i:s');
        // $endRange = $currentDateTime->copy()->addHours(3)->utc();
        // $formattedEndDate = Carbon::parse($endRange)->format('Y-m-d H:i:s');

        // // Apply the filter for end_date within the +/- 3 hours range
        // $query->whereBetween('end_date', [$formattedStartDate, $formattedEndDate]);
    
        
        // Get the filtered results
        $apiData = $query->get();
    
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
