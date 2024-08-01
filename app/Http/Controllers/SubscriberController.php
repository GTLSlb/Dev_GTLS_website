<?php

namespace App\Http\Controllers;

use App\Mail\SubscriberMail;
use App\Models\ActionHistory;
use App\Models\UnsubscribeReason;
use App\Models\Subscribers;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class SubscriberController extends Controller
{
    public function addSubscriber($email)
    {
        // $validator = Validator::make(['email' => $email], [
        //     'email' => 'required|email|unique:subscribers,email'
        // ]);
    
        // if ($validator->fails()) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Invalid email or email already exists.',
        //         'errors' => $validator->errors()
        //     ], 400);
        // }
    
        DB::beginTransaction();

        try {
            // Check if the subscriber already exists
            $subscriber = Subscribers::where('email', $email)->first();
    
            if ($subscriber) {
                // If subscriber exists, update the status to 1
                $subscriber->status = 1;
                $subscriber->save();
            } else {
                // If subscriber doesn't exist, create a new record
                $subscriber = new Subscribers();
                $subscriber->email = $email;
                $subscriber->status = 1;
                $subscriber->first_send = 0;
                $subscriber->save();
            }
    
            DB::commit();
    
            $data = [
                'email' => $email,
                'id' => $subscriber->id,
            ];
    
            // Return response before sending the email
            $response = response()->json([
                'success' => true,
                'message' => 'You successfully subscribed to our notifications.',
                'data' => $subscriber
            ], 200);
    
            // Send the email after returning the response
            Mail::to($email)->send(new SubscriberMail($data));
    
            return $response;
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error occurred while updating the email received status: ' . $e->getMessage());
    
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the email received status.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
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

    public function unsubscribe(Request $request)
    {
        $id = $request->input('id');
        $note = $request->input('note');
    
        $item = Subscribers::findOrFail($id);
        $history = new ActionHistory();
        $history->action_id = 2;
        $history->user_id = $id;
        $history->date = now();
        $history->save();
    
        $reason = new UnsubscribeReason(); 
        $reason->subscriber_id = $id;
        $reason->reason = $note;
        $reason->action_history_id = $history->id;
        $reason->save();

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
