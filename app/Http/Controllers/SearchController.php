<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SearchController extends Controller
{
    // public function search(Request $request)
    // {
    //     // Get the keyword from the request header
    //     $keyword = $request->header('searchKeyword');

    //     // Check if the keyword is provided
    //     if (!$keyword) {
    //         return response()->json(['error' => 'Keyword not provided'], 400);
    //     }

    //     // Escape the keyword to prevent command injection
    //     $escapedKeyword = escapeshellarg($keyword);

    //     // Build the command to execute the Python script
    //     $command = "C:\\Python27\\python.exe C:\\xampp\\htdocs\\WebScapper\\src\\scrapeWebsite.py $escapedKeyword";
    //     \Log::info("Executing command: $command");
    //     // Execute the command and capture the output
    //     $output = shell_exec("$command 2>&1");
    //     \Log::info("output: $output");
    //     // Check if the output is null, indicating a failure
    //     if ($output === null) {
    //         return response()->json(['error' => 'Failed to execute scraper'], 500);
    //     }

    //     // Decode the JSON output from the Python script
    //     $content = json_decode($output, true);

    //     // Check if decoding was successful
    //     if (json_last_error() !== JSON_ERROR_NONE) {
    //         return response()->json(['error' => 'Invalid response from scraper'], 500);
    //     }

    //     // Return the scraped content as a JSON response
    //     return response()->json($content);
    // }

    public function search(Request $request)
    {
        // Get the keyword from the request header
        $keyword = $request->header('searchKeyword');

        // Check if the keyword is provided
        if (!$keyword) {
            return response()->json(['error' => 'Keyword not provided'], 400);
        }

        // Escape the keyword to prevent command injection
        $escapedKeyword = escapeshellarg($keyword);

        // Path to your Node.js script
        $nodeScript = "C:\\xampp\\htdocs\\Dev_GTLS_website\\tests\\webScrapping.js";

        // Build the command to execute the Node.js script
        $command = "node $nodeScript $escapedKeyword";

        \Log::info("Executing command: $command");

        // Execute the command and capture the output
        $output = shell_exec("$command 2>&1");

        \Log::info("Output: $output");

        // Check if the output is null, indicating a failure
        if ($output === null) {
            return response()->json(['error' => 'Failed to execute scraper'], 500);
        }

        // Decode the JSON output from the Node.js script
        $content = json_decode($output, true);

        // Check if decoding was successful
        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Invalid response from scraper'], 500);
        }

        // Return the scraped content as a JSON response
        return response()->json($content);
    }
}
?>
