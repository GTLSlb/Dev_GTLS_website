<?php

namespace App\Http\Controllers;

use App\Models\ActionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Subscribers;

class ActionHistoryController extends Controller
{
    public function addHistory($id, $action)
    {
        // Validate the input
        $validator = Validator::make(['id' => $id, 'action' => $action], [
            'id' => 'required|integer|exists:subscribers,id', // check if id exists in subscribers table
            'action' => 'required|integer|exists:actions,id' // check if the action id exists in actions table
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400); // return error if validation fails
        }

        try {
            // Create and save action history
            $history = new ActionHistory();
            $history->action_id = $action; // set the action id
            $history->user_id = $id; // set the user id
            $history->date = now(); // Set the current timestamp
            $history->save(); // save the action history in the table

            return response()->json(['success' => 'Action history added successfully'], 200); // return on success
        } catch (\Exception $e) { // catch any error
            
            log::error('Failed to add action history: ' . $e->getMessage()); // save error in logs

            return response()->json(['error' => 'Failed to add action history'], 500); // return on error
        }
    }
}
