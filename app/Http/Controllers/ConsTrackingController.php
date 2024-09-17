<?php

namespace App\Http\Controllers;

use App\Models\ConsTracking;
use App\Services\ConsServices;

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
}