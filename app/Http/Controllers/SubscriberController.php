<?php

namespace App\Http\Controllers;

use App\Models\ActionHistory;
use App\Models\Subscribers;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactUsFormMail;
use Illuminate\Support\Facades\Mail;

class SubscriberController extends Controller
{
    public function getById($id)
    {
        // Retrieve the record by ID
        $item = Subscribers::findOrFail($id);
        // Return the record as a JSON response
        return response()->json($item);
    }
    public function getAll()
    {
        // Retrieve all records
        $subscribers = Subscribers::where('status', 1)
                ->orWhere(function($query) {
                    $query->where('status', 2)
                          ->where('first_send', 1);
                })
                ->get();
        // Return the record as a JSON response
        return response()->json($subscribers);
    }

    public function subscribe($id){
        $item = Subscribers::findOrFail($id);
        $history = new ActionHistory();
        $history->action_id = 1;
        $history->user_id = $id;
        $history->date = now();
        $history->save();
        $item->update([
            'status' => 1
        ]);

        return response()->json($item);
    }

    public function unsubscribe($id){

        $item = Subscribers::findOrFail($id);
        $history = new ActionHistory();
        $history->action_id = 2;
        $history->user_id = $id;
        $history->date = now();
        $history->save();
        
        $item->update([
            'status' => 2
        ]);

        return response()->json($item);
    }

    public function receivedEmail($id)
    {
        try {
            // Attempt to find the subscriber
            $item = Subscribers::findOrFail($id);

            // Update the subscriber's first_send field
            $item->first_send = 0;
            $item->save();

            // Return a success response
            return response()->json([
                'success' => true,
                'message' => 'Email received status updated successfully.',
                'data' => $item
            ], 200);

        } catch (ModelNotFoundException $e) {
            // Handle the case where the subscriber was not found
            return response()->json([
                'success' => false,
                'message' => 'Subscriber not found.',
                'error' => $e->getMessage()
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the email received status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
