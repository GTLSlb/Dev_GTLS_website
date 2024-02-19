<?php

namespace App\Http\Controllers;

use App\Models\UserVisit;
use Illuminate\Http\Request;

class UserVisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $ip = $request->ip();
        $visitor = UserVisit::firstOrCreate(['ip_address' => $ip]);
        $visitor->increment('visits');
        $visitor->save();
        
        $visitors = UserVisit::count();
        // dd($visitors );
        // return response()->json($visitors);
         return $visitors;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserVisit $userVisit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserVisit $userVisit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserVisit $userVisit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserVisit $userVisit)
    {
        //
    }
}
