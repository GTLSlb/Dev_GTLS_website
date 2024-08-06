<?php

namespace App\Http\Controllers;

use App\Models\Action;

class ActionController extends Controller
{
    public function getById($id)
    {
        // Retrieve the record by ID
        $item = Action::findOrFail($id);
        // Return the record as a JSON response
        return response()->json($item);
    }
}