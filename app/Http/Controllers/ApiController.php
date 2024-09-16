<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Carbon\Carbon;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
    
        // Retrieve pagination and sorting parameters
        $skip = $request->query('skip', 0); // Number of items to skip (default 0)
        $limit = $request->query('limit'); // Number of items per page (default 10)
        $sortInfo = $request->query('sortInfo'); // Sort information
        $filterBy = $request->query('filterBy'); // Filter information
    
        // Build the query
        $query = ApiData::query();
    
        // Apply filters based on query parameters
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
    
        $query->where(function ($q) {
            $q->whereNull('end_date')  
              ->orWhere('end_date', '>=', now()) 
              ->where('end_date', '<', '2025-12-30');
        });

        // Apply dynamic filters from filterBy JSON parameter
        if ($filterBy) {
            $filterByArray = json_decode($filterBy, true); // Decode JSON filter info
            foreach ($filterByArray as $filter) {
                if (isset($filter['name'], $filter['type'], $filter['operator'], $filter['value'])) {
                    $column = $filter['name'];
                    $value = $filter['value'];
                    $emptyValue = isset($filter['emptyValue']) ? $filter['emptyValue'] : null; // Get empty value if provided

                    
                    if ($filter['type'] === 'date') {
                        // Only apply date filters if the value is not equal to the emptyValue
                        if ($value !== $emptyValue) {
                            switch ($filter['operator']) {
                                case 'after':
                                    $query->whereDate($column, '>', $value);
                                    break;
                                case 'afterOrOn':
                                    $query->whereDate($column, '>=', $value);
                                    break;
                                case 'before':
                                    $query->whereDate($column, '<', $value);
                                    break;
                                case 'beforeOrOn':
                                    $query->whereDate($column, '<=', $value);
                                    break;
                                case 'eq':
                                    $query->whereDate($column, '=', $value);
                                    break;
                                case 'neq':
                                    $query->whereDate($column, '!=', $value);
                                    break;
                                    case 'inrange':
                                        if (is_array($value) && count($value) === 2) {
                                            $start = $value["start"];
                                            $end = $value["end"];
                                    
                                            if ($start !== $emptyValue && $end !== $emptyValue) {
                                                // Both start and end are provided, use whereBetween
                                                $query->whereBetween($column, [$start, $end]);
                                            } elseif ($start !== $emptyValue) {
                                                // Only start is provided, filter everything after the start
                                                $query->whereDate($column, '>=', $start);
                                            } elseif ($end !== $emptyValue) {
                                                // Only end is provided, filter everything before the end
                                                $query->whereDate($column, '<=', $end);
                                            }
                                        }
                                        break;
                                    
                                    case 'notinrange':
                                        if (is_array($value) && count($value) === 2) {
                                            $start = $value["start"];
                                            $end = $value["end"];
                                    
                                            if ($start !== $emptyValue && $end !== $emptyValue) {
                                                // Both start and end are provided, use whereNotBetween
                                                $query->whereNotBetween($column, [$start, $end]);
                                            } elseif ($start !== $emptyValue) {
                                                // Only start is provided, filter everything not before the start
                                                $query->whereDate($column, '<', $start);
                                            } elseif ($end !== $emptyValue) {
                                                // Only end is provided, filter everything not after the end
                                                $query->whereDate($column, '>', $end);
                                            }
                                        }
                                        break;
                                    
                                    
                            }
                        }
                    } elseif ($filter['type'] === 'string') {
                        // Apply string filters
                        switch ($filter['operator']) {
                            case 'contains':
                                $query->where($column, 'LIKE', '%' . $value . '%');
                                break;
                            case 'notContains':
                                $query->where($column, 'NOT LIKE', '%' . $value . '%');
                                break;
                            case 'eq':
                                $query->where($column, '=', $value);
                                break;
                            case 'neq':
                                $query->where($column, '!=', $value);
                                break;
                            case 'empty':
                                $query->where(function ($q) use ($column) {
                                    $q->whereNull($column)->orWhere($column, '=', '');
                                });
                                break;
                            case 'notEmpty':
                                $query->where(function ($q) use ($column) {
                                    $q->whereNotNull($column)->where($column, '!=', '');
                                });
                                break;
                            case 'startsWith':
                                $query->where($column, 'LIKE', $value . '%');
                                break;
                            case 'endsWith':
                                $query->where($column, 'LIKE', '%' . $value);
                                break;
                        }
                    }
                }
            }
        }
    
        // Get the total count of records with filters applied
        $totalRecords = $query->count();
    
        // Retrieve all results before pagination to allow sorting on calculated fields
        $results = $query->get();
    
        // Transform the data
        $transformedData = $results->map(function ($item) {
            $startDate = Carbon::parse($item->start_date);
            $endDate = Carbon::parse($item->end_date);
    
            // Calculate difference in hours, handling possible null values
            $hoursDifference = ($startDate && $endDate) ? $startDate->diffInHours($endDate) : null;
    
            return [
                'id' => $item->id,
                'api_source' => $item->api_source,
                'event_id' => $item->event_id,
                'description' => $item->description,
                'geometry_type' => $item->geometry_type,
                'geometry_coordinates' => json_decode($item->geometry_coordinates, true),
                'event_category_id' => $item->event_category_id,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'hours_difference' => $hoursDifference, // New field for hours difference
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
        })->values();
    
        // Sort the entire transformed dataset by the specified column
        if ($sortInfo) {
            $sortInfoArray = json_decode($sortInfo, true); // Decode JSON sort info
            if (is_array($sortInfoArray) && isset($sortInfoArray['columnName']) && isset($sortInfoArray['dir'])) {
                $sortColumn = $sortInfoArray['columnName'];
                $sortDirection = $sortInfoArray['dir'] == 1 ? 'asc' : 'desc';

                // Handle sorting of nullable or empty date columns
                $transformedData = $transformedData->sort(function ($a, $b) use ($sortColumn, $sortDirection) {
                    $valueA = $a[$sortColumn];
                    $valueB = $b[$sortColumn];

                    // Check if valueA or valueB is null or empty
                    $isValueANullOrEmpty = $valueA === null || $valueA === '';
                    $isValueBNullOrEmpty = $valueB === null || $valueB === '';

                    if ($isValueANullOrEmpty && !$isValueBNullOrEmpty) {
                        // Value A is null or empty, and Value B is not; Value A should be at the end
                        return 1;
                    }

                    if (!$isValueANullOrEmpty && $isValueBNullOrEmpty) {
                        // Value B is null or empty, and Value A is not; Value B should be at the end
                        return -1;
                    }

                    // Both are null or empty, or neither are null or empty; use regular comparison
                    if ($isValueANullOrEmpty && $isValueBNullOrEmpty) {
                        // Both values are null or empty, they are considered equal
                        return 0;
                    }

                    // Regular comparison based on sort direction
                    if ($sortDirection === 'asc') {
                        return $valueA <=> $valueB;
                    } else {
                        return $valueB <=> $valueA;
                    }
                })->values(); // Ensure reindexing after sorting
            }
        }

    
        // Reindex the sorted data to apply pagination
        $transformedData = $transformedData->values();
    
        // Apply pagination to the transformed and sorted data
        if ($limit) {
            $transformedData = $transformedData->slice($skip, $limit)->values();
        }
    
        // Return the transformed results as a JSON response with total count
        return response()->json($transformedData)
            ->withHeaders([
                'X-Total-Count' => $totalRecords,
                'Access-Control-Expose-Headers' => 'X-Total-Count'
            ]);
    }
    
    public function getById(Request $request, $id)
    {
        // Retrieve the specific record by ID
        $item = ApiData::find($id);

        // Check if the record exists
        if (!$item) {
            return response()->json(['error' => 'Record not found'], 404);
        }

        // Transform the data
        $transformedData = [
            'id' => $item->id,
            'api_source' => $item->api_source,
            'event_id' => $item->event_id,
            'description' => $item->description,
            'geometry_type' => $item->geometry_type,
            'geometry_coordinates' => json_decode($item->geometry_coordinates, true),
            'event_category_id' => $item->event_category_id,
            'start_date' => $item->start_date,
            'end_date' => $item->end_date,
            'hours_difference' => $item->start_date && $item->end_date ? Carbon::parse($item->start_date)->diffInHours(Carbon::parse($item->end_date)) : null,
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

        // Return the transformed result as a JSON response
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
    
    public function getEventsCategories(Request $request){
        $allEvents = DB::table('events_category')->get();
        return response()->json($allEvents);
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

    // public function geocode(Request $request)
    // {
    //     $address = $request->input('address');
    //     $apiKey = env('GOOGLE_MAPS_API_KEY'); // Store your API key in .env file

    //     $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
    //         'address' => $address,
    //         'key' => $apiKey,
    //     ]);

    //     if ($response->successful()) {
    //         return response()->json($response->json());
    //     } else {
    //         return response()->json(['error' => 'Failed to fetch geocode data'], 500);
    //     }
    // }
    public function geocode(Request $request)
    {
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $apiKey = env('GOOGLE_MAPS_API_KEY'); // Ensure your API key is set in the .env file
    
        // Make sure that both latitude and longitude are provided
        if (!$lat || !$lng) {
            return response()->json(['error' => 'Latitude and Longitude are required'], 400);
        }
    
        // Make the HTTP request to the Google Geocoding API
        $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
            'latlng' => "{$lat},{$lng}",
            'key' => $apiKey,
        ]);
    
        // Check if the request was successful
        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Failed to fetch geocode data'], 500);
        }
    }
    
    // Add the directions method
    public function directions(Request $request)
    {
        $origin = $request->input('origin');
        $destination = $request->input('destination');
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        $response = Http::get('https://maps.googleapis.com/maps/api/directions/json', [
            'origin' => $origin,
            'destination' => $destination,
            'key' => $apiKey,
        ]);

        if ($response->successful()) {
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Failed to fetch directions data'], 500);
        }

    }

    // public function geocode(Request $request)
    // {
    //     $address = $request->input('address');
    //     $apiKey = env('GOOGLE_MAPS_API_KEY'); // Store your API key in .env file

    //     $response = Http::get('https://maps.googleapis.com/maps/api/geocode/json', [
    //         'address' => $address,
    //         'key' => $apiKey,
    //     ]);

    //     if ($response->successful()) {
    //         return response()->json($response->json());
    //     } else {
    //         return response()->json(['error' => 'Failed to fetch geocode data'], 500);
    //     }
    // }

}
