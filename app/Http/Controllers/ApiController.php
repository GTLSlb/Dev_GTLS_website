<?php

namespace App\Http\Controllers;

use App\Services\ApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\ApiData;
class ApiController extends Controller
{
    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        $this->apiService = $apiService;
    }

    public function fetchData()
    {
        $this->apiService->fetchAndSaveData();
        return response()->json(['message' => 'Data fetched and saved successfully.']);
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
                'last_updated'=>$item->lastUpdated_date,
                'lat' => (float) $item->latitude,
                'lng' => (float) $item->longitude,
                'suburb' => $item->suburb,
                'traffic_direction' => $item->traffic_direction,
                'road_name' => $item->road_name,
                'status' => $item->status,
                'event_type' => $item->event_type,
                'impact' => $item->impact,
                'advice' => $item->advice,
                'otherAdvice'=> $item->otherAdvice,
                'information' => $item->information,
                'source_url' => $item->source_url,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
            ];
        })->values()->all();  // Use values() to reindex the array and all() to ensure it's an array
    
        // Return the transformed results as a JSON response
        return response()->json($transformedData);
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
}
