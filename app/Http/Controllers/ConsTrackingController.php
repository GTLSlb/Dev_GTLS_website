<?php

namespace App\Http\Controllers;

use App\Models\ApiData;
use App\Models\ConsData;
use App\Models\ConsignmentEvents;
use App\Models\ConsTracking;
use App\Services\ConsServices;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Log;

class ConsTrackingController extends Controller

{
    protected $conService;

    public function __construct(ConsServices $conService)
    {
        $this->conService = $conService;
    }

    public function fetchData(){
        try {
            $this->conService->getCons();
            return "success";
        } catch (\Exception $e) {
            dd($e);
        }
    }

    public function getConsRoute(Request $request)
    {
        Log::info('Route Requested');
        $startLat = $request->input('startLat');
        $startLng = $request->input('startLng');
        $endLat = $request->input('endLat');
        $endLng = $request->input('endLng');
        Log::info('Route Requested');
        // Call the service function
        $result = $this->conService->getRouteUsingRoutesAPI($startLat, $startLng, $endLat, $endLng);

        return response()->json($result);
    }


    public function getAllConsRoutes(Request $request): string
    {
        ini_set('max_execution_time', 600); //10 minutes
        try {
            $result = $this->conService->getCons();
            // dd(vars: $result);
            return "success";
        } catch (\Exception $e) {
            Log::error('Error Fetching All Cons Routes: ' . $e->getMessage());
            return "Error occurred: " . $e->getMessage();
        }
    }
    
    
    function getAllConsDataWithEvents(){
        // Fetch all consignments
        $consignments = ConsData::all();

        // Loop through each consignment and add eventCounter
        foreach ($consignments as $cons) {
            // Count the number of events for the current consignment
            $eventCount = ConsignmentEvents::where('consignment_id', $cons->id)->count();
            // Add the eventCounter to the consignment object
            $cons->EventCounter = $eventCount;
        }
        return $consignments;
    }
    
    public function getConsEventsById($consignmentId)
    {
        // Fetch the consignment by ID
        $consignment = ConsData::find($consignmentId);
    
        if (!$consignment) {
            throw new \Exception("Consignment not found");
        }
    
        // Fetch the related consignment events
        $consevents = ConsignmentEvents::where('consignment_id', $consignmentId)->get();
    
        // Initialize an array to store the full event data
        $allEvents = [];
    
        // Loop through each consignment event to get the corresponding ApiData events
        foreach ($consevents as $consevent) {
            // Fetch the related ApiData event using the event_id
            $event = ApiData::where('event_id', $consevent->event_id)->first();
            
            if ($event) {
                // Add the event data to the allEvents array
                $allEvents[] = $event;
            }
        }
    
        // Add the full event data and event counter to the consignment object
        $consignment->events = $allEvents;
        $consignment->EventCounter = $consevents->count();
    
        return $consignment;
    }
    
}
