<?php

namespace App\Http\Controllers;

use App\Models\ApiData;
use App\Models\ConsData;
use App\Models\ConsignmentEvents;
use App\Models\ConsTracking;
use App\Models\TrafficDataNSW;
use App\Models\TrafficDataQLD;
use App\Models\TrafficDataSA;
use App\Models\TrafficDataVIC;
use App\Services\ConsServices;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Log;

class ConsTrackingController extends Controller

{
    protected $conService;
    protected $navmanApiKey;

    public function __construct(ConsServices $conService)
    {
        $this->conService = $conService;
        $this->navmanApiKey = env('NAVMAN_API_KEY');

        if(is_null($this->navmanApiKey)){
            dd("navman api key cannot be null ");
        }
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
    
    public function getAllConsDataWithEvents()
    {
        // Fetch all consignments
        $consignments = ConsData::all();
    
        // Loop through each consignment and add events and event counter
        foreach ($consignments as $cons) {
            // Fetch the related consignment events
            $consevents = ConsignmentEvents::where('consignment_id', $cons->id)->get();
    
            // Initialize an array to store the full event data
            $allEvents = [];
    
            // Loop through each consignment event to get the corresponding event from TrafficData
            foreach ($consevents as $consevent) {
                $state = $consevent->state; // Assuming `state` is a field in ConsignmentEvents
    
                // Check the state and query the respective TrafficData table
                switch ($state) {
                    case 'NSW':
                        $event = TrafficDataNSW::where('event_id', $consevent->event_id)->first();
                        break;
                    case 'VIC':
                        $event = TrafficDataVIC::where('event_id', $consevent->event_id)->first();
                        break;
                    case 'QLD':
                        $event = TrafficDataQLD::where('event_id', $consevent->event_id)->first();
                        break;
                    case 'SA':
                        $event = TrafficDataSA::where('event_id', $consevent->event_id)->first();
                        break;
                    default:
                        $event = null; // Handle the case where state does not match any known states
                }
    
                if ($event) {
                    // Add the event data to the allEvents array
                    $allEvents[] = $event;
                }
            }
    
            // Add the full event data and event counter to the consignment object
            $cons->events = $allEvents;
            $cons->EventCount = $consevents->count();
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
    
        // Loop through each consignment event to get the corresponding TrafficData event based on the state
        foreach ($consevents as $consevent) {
            $state = $consevent->state; // Assuming `state` is a field in ConsignmentEvents
    
            // Check the state and query the respective TrafficData table
            switch ($state) {
                case 'NSW':
                    $event = TrafficDataNSW::where('event_id', $consevent->event_id)->first();
                    break;
                case 'VIC':
                    $event = TrafficDataVIC::where('event_id', $consevent->event_id)->first();
                    break;
                case 'QLD':
                    $event = TrafficDataQLD::where('event_id', $consevent->event_id)->first();
                    break;
                case 'SA':
                    $event = TrafficDataSA::where('event_id', $consevent->event_id)->first();
                    break;
                default:
                    $event = null; // Handle case where state does not match any known states
            }
    
            if ($event) {
                // Add the event data to the allEvents array
                $allEvents[] = $event;
            }
        }
    
        // Add the full event data and event counter to the consignment object
        $consignment->events = $allEvents;
        $consignment->EventCount = $consevents->count();
    
        return $consignment;
    }
    
    public function getConsignmentRoute(Request $request)
    {
        // Define the required parameters
        $requiredParams = [
            'consignmentNo',
            'typeId',
            'fromDate',
            'toDate'
        ];
    
        // Collect missing parameters
        $missingParams = [];
        foreach ($requiredParams as $param) {
            if (!$request->input($param)) {
                $missingParams[] = $param;
            }
        }
    
        // Return the missing parameters if any are missing
        if (!empty($missingParams)) {
            return response()->json([
                'message' => 'Missing required parameters',
                'missing' => $missingParams
            ], 400);
        }
        $consignmentNo = $request->input('consignmentNo');
        $typeId = $request->input('typeId');
        $fromDate = $request->input('fromDate');
        $toDate = $request->input('toDate');

        // If all parameters are present
        $vehicleNo = $this->getVehicleNo( $consignmentNo,$typeId);
        $vehicleId = $this->getVehicleId($vehicleNo);
        $vehiclePositions = $this->getVehiclePositions($vehicleId, $fromDate, $toDate);
        $vehicleRoad = $this->getVehicleRoad($vehiclePositions);
        $snappedRoad = $this->conService->snapToRoads($vehicleRoad);
        $eventsOnRoute = $this->conService->checkEventsOnRoute($vehicleRoad);
        $consignmentDetails = $this->getConsignmentData();
        foreach ($eventsOnRoute as $event) {
            echo $event->description . "\n";
        }
        return response()->json([
            // 'message' => 'All Data exist', 
            // 'vehicleNo' =>  $vehicleNo, 
            // 'vehicleId' => $vehicleId, 
            // 'vehiclePositions' => $vehiclePositions, 
            'vehicleRoad' => $snappedRoad ,
            'routeWithEvents' => $eventsOnRoute,
            'consignmentDetails' => $consignmentDetails,
        ], 
            200);
    }
    
    function getVehicleNo($consignmentNo, $typeId){
        // Start by retrieving the vehicle number from the consignment number
        try{
            $response = Http::timeout(40)->withHeaders([
                'ConsignmentNo' => $consignmentNo,
                'TypeId' => $typeId,
            ])->get('https://gtlsnsws12-vm.gtls.com.au:9123/api/v2/GTRS/VehicleNumber');

            return $response->body();
        } catch (\Exception $e) {
            Log::error('Error Fetching Vehicle Number: ' . $e->getMessage());
            return "Error occurred: " . $e->getMessage();
        }
    }

    function getVehicleId($vehicleNo)
    {
        try {
            $params = [
                'partialName' => $vehicleNo,
                'status' => 'ALL',
                'statusList' => 'E',
                'pruning' => 'B2B',
                'key' => $this->navmanApiKey,
            ];
            $result = Http::timeout(40)->get('https://api-au.telematics.com/v1/vehicles', $params);
            $data = $result->json();
    
            if (!empty($data) && isset($data[0]['id'])) {
                return $data[0]['id'];
            }
            return null;
        } catch (\Exception $e) {
            
            Log::error('Error retreiving the vehicle ID : ' . $e->getMessage());
        }
    }
    
    function getVehiclePositions($vehicleId, $fromDate, $toDate)
    {
        try {
            $url = "https://api-au.telematics.com/v1/vehicles/{$vehicleId}/positions"; // Vehicle ID in the URL
            $params = [
                'key' => $this->navmanApiKey,
                'from' => $fromDate,
                'to' => $toDate,
                'pruning' => 'ALL',
                'limit' => 'off',
                'lastHdgpsLocation' => 'false', // Pass as string if needed by the API
                'highDefinition' => 'false' // Pass as string if needed by the API
            ];
    
            // Make the request with the vehicle ID in the URL and the query parameters
            $result = Http::timeout(40)->get($url, $params);
            $data = $result->json();
            
            // Return data or handle response based on your use case
            return $data;
        } catch (\Exception $e) {
            Log::error('Error retrieving the vehicle position: ' . $e->getMessage());
        }
    }
    function getVehicleRoad($vehiclePositions) {
        if (empty($vehiclePositions) || count($vehiclePositions) === 0) {
            return response()->json([
                'message' => 'No vehicle positions provided',
            ], 400); // Return a 400 Bad Request if no positions
        }
    
        $roadCoordinates = array_map(function ($position) {
            return [
                'lat' => $position['Lat'],  // Latitude
                'lng' => $position['Lng'],  // Longitude
            ];
        }, $vehiclePositions);
    
        // Return only the data
        return $roadCoordinates;
    }
    function getConsignmentData() { //todo: Replace the static with the request
        $data = [
            [
                "ConsignmentNo" => "FPKE00002015",
                "ChargeCode" => "FREIGHTPEOPLE - KERRY FOODS",
                "ServiceType" => "EXPRESS",
                "Pickdate" => "2024-09-23T00:00:00",
                "RequiredDeliverDate" => "2024-09-25T00:00:00",
                "SenderName" => "KERRY INGREDIENTS AUST PL - QLD",
                "ReceiverName" => "PRIMO CHULLORA",
                "SenderAddress" => "3/96 Export Street",
                "SenderSuburb" => "LYTTON",
                "SenderState" => "QLD",
                "SenderPostCode" => "4178",
                "ReceiverAddress" => "18 Hume Hwy",
                "ReceiverSuburb" => "CHULLORA",
                "ReceiverState" => "NSW",
                "ReceiverPostcode" => "2190"
            ]
        ];
        // Create the nested structure without modifying $data
        $nestedData = [
            "consignmentDetails" => [
                "ConsignmentNo" => $data[0]["ConsignmentNo"],
                "ChargeCode" => $data[0]["ChargeCode"],
                "ServiceType" => $data[0]["ServiceType"],
                "Pickdate" => $data[0]["Pickdate"],
                "RequiredDeliverDate" => $data[0]["RequiredDeliverDate"]
            ],
            "senderDetails" => [
                "SenderName" => $data[0]["SenderName"],
                "SenderAddress" => $data[0]["SenderAddress"],
                "SenderSuburb" => $data[0]["SenderSuburb"],
                "SenderState" => $data[0]["SenderState"],
                "SenderPostCode" => $data[0]["SenderPostCode"]
            ],
            "receiverDetails" => [
                "ReceiverName" => $data[0]["ReceiverName"],
                "ReceiverAddress" => $data[0]["ReceiverAddress"],
                "ReceiverSuburb" => $data[0]["ReceiverSuburb"],
                "ReceiverState" => $data[0]["ReceiverState"],
                "ReceiverPostcode" => $data[0]["ReceiverPostcode"]
            ]
        ];
        // Return the data as a JSON string
        return $nestedData;
    }
}
