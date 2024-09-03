<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ApiService;

class FetchApiData extends Command
{
    protected $signature = 'fetch:apidata';
    protected $description = 'Fetch data from external APIs and save to the database';

    protected $apiService;

    public function __construct(ApiService $apiService)
    {
        parent::__construct();
        $this->apiService = $apiService;
    }

    public function handle()
    {
        $this->info('Starting API data fetch...');
        $this->apiService->fetchAndSaveData();
        $this->info('API data fetch completed successfully.');
    }
}
