<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    // Run tests in parallel
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
        $folderPath = "C:\\xampp\\htdocs\\Dev_GTLS_website\\tests\\webScrapping";

        // Get all .js files in the specified folder
        $scripts = glob("$folderPath/*.js");

        $processes = [];
        foreach ($scripts as $script) {
            // Prepare the command to run each script with the keyword
            $command = "node " . escapeshellarg($script) . " $escapedKeyword";
            // Run the command in the background and capture the process ID
            $processId = popen($command . " 2>&1 &", 'r'); // 2>&1 captures stderr to stdout
            $processes[] = $processId;
        }

        // Wait for all processes to finish
        $results = [];
        foreach ($processes as $process) {
            // Collect output from the process
            $output = '';
            while (!feof($process)) {
                $output .= fgets($process);
            }
            pclose($process); // Close the process
            // Decode JSON output and merge results
            $results[] = json_decode($output, true);
        }

        // Combine all results into a single array
        $combinedResults = [];
        foreach ($results as $result) {
            if ($result) {
                $combinedResults = array_merge($combinedResults, $result);
            }
        }

        \Log::info("Output: $output");

        // Check if the output is null, indicating a failure
        if ($combinedResults === null) {
            return response()->json(['error' => 'Failed to execute scraper'], 500);
        }

        // Return the scraped content as a JSON response
        return response()->json($combinedResults);
    }

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

    //     // Path to your Node.js script
    //     $folderPath = "C:\\xampp\\htdocs\\Dev_GTLS_website\\tests\\webScrapping";

    //     // Get all .js files in the specified folder
    //     $scripts = glob("$folderPath/*.js");

    //     $processes = [];
    //     foreach ($scripts as $script) {
    //         // Prepare the command to run each script with the keyword
    //         $command = "node " . escapeshellarg($script) . " $escapedKeyword";
    //         // Run the command in the background and capture the process ID
    //         $processId = popen($command . " 2>&1 &", 'r'); // 2>&1 captures stderr to stdout
    //         $processes[] = $processId;
    //     }

    //     // Wait for all processes to finish
    //     $results = [];
    //     foreach ($processes as $process) {
    //         // Collect output from the process
    //         $output = '';
    //         while (!feof($process)) {
    //             $output .= fgets($process);
    //         }
    //         pclose($process); // Close the process

    //         // Decode JSON output
    //         $result = json_decode($output, true);
    //         if ($result) {
    //             $results[] = $result;

    //             // Insert each file's result into the database
    //             DB::table('scrapping')->insert([
    //                 'content' => json_encode($result), // Store as string
    //                 'created_at' => now(), // Optional: Add timestamps
    //                 'updated_at' => now(),
    //             ]);
    //         }
    //     }

    //     // Combine all results into a single array
    //     $combinedResults = [];
    //     foreach ($results as $result) {
    //         if ($result) {
    //             $combinedResults = array_merge($combinedResults, $result);
    //         }
    //     }

    //     \Log::info("Output: $output");

    //     // Check if the combined results are empty
    //     if (empty($combinedResults)) {
    //         return response()->json(['error' => 'Failed to execute scraper'], 500);
    //     }

    //     // Return the scraped content as a JSON response
    //     return response()->json($combinedResults);
    // }

    public function addSchema($isString, $tableName) {
        // Initialize fields array
        $fields = [];

        // Check if data is a string
        if ($isString) {
            $fields[] = [
                'name' => 'data',
                'type' => 'auto',
            ];
        } else {
            switch ($tableName) {
                case "branches":
                    $fields[] = [
                        'name' => 'branch_name',
                        'type' => 'auto',
                    ];
                    break;
                case "certificates":
                case "news_posts":
                    $fields[] = [
                        'name' => 'description',
                        'type' => 'auto',
                    ];
                    break;
                case "positions":
                    $fields[] = [
                        'name' => 'position_title',
                        'type' => 'auto',
                    ];
                    $fields[] = [
                        'name' => 'position_details',
                        'type' => 'auto',
                    ];
                    $fields[] = [
                        'name' => 'position_title',
                        'type' => 'auto',
                    ];
                    break;
                case "services":
                    $fields[] = [
                        'name' => 'description',
                        'type' => 'auto',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'auto',
                    ];
                    break;
                case "socials":
                    $fields[] = [
                        'name' => 'name',
                        'type' => 'auto',
                    ];
                    $fields[] = [
                        'name' => 'url',
                        'type' => 'auto',
                    ];
                    break;
                case "team_members":
                    $fields[] = [
                        'name' => 'member_name',
                        'type' => 'auto',
                    ];
                    break;
                default:
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'auto',
                    ];
                    break;
            }
        }

        // Create the schema array
        $schema = [
            'name' => $tableName,
            'fields' => $fields, // Use the fields array directly
        ];

        // Return JSON response
        return $schema;
    }

    public function fetchData(Request $request){
        $url = getenv('BACK_TO_HOME_URL');
        $routes = [
            'aboutuses' => $url . 'aboutus',
            'blogs' => $url . 'news',
            'branches' => $url . 'contact_us',
            'certificates' => $url . '',
            'team_members' => $url . 'aboutus',
            'technologies' => $url . 'technologies',
            'capability_statements' => $url . 'aboutus',
            'going_greens' => $url . 'goinggreen',
            'pallet_terms' => $url . '',
            'positions' => $url . 'opportunities',
            'safety_compliances' => $url . '',
            'services' => $url . '#services',
            'socials' => $url . '',
            'terms' => $url . '',
        ];

        //Get all data from all tables from 'dashboardstrapi' database
        $tables = DB::connection('mysqlOne')->select('SHOW TABLES');
        $data = [];
        $tableSchema = (object) [];

        //Filter out certain tables from the data
        $filteredTables = collect($tables)->filter(function ($table) {
            $tableName = $table->{'Tables_in_dashboardstrapi'};
            return !(
                str_contains($tableName, '_cmps') ||
                str_starts_with($tableName, 'components_') ||
                str_contains($tableName, '_Ink') ||
                str_contains($tableName, 'lnk') ||
                str_starts_with($tableName, 'admin_') ||
                str_starts_with($tableName, 'files_') ||
                str_starts_with($tableName, 'footers_') ||
                str_starts_with($tableName, 'logz') ||
                str_starts_with($tableName, 'strapi_') ||
                str_starts_with($tableName, 'nav_') ||
                str_starts_with($tableName, 'nova_') ||
                str_starts_with($tableName, 'up_') ||
                str_starts_with($tableName, 'upload_') ||
                $tableName == 'action_events' ||
                $tableName == 'careers' ||
                $tableName == 'contact_uses' ||
                $tableName == 'home_pages' ||
                $tableName == 'i18n_locale' ||
                $tableName == 'links' ||
                $tableName == 'map_settings' ||
                $tableName == 'migrations' ||
                $tableName == 'navigation_links' ||
                $tableName == 'train_notifications' ||
                $tableName == 'values' ||
                $tableName == 'files' ||
                $tableName == 'footers'
            );
        });

        //Iterate through each table and fetch its data
        foreach ($filteredTables as $table) {
            $tableName = $table->{'Tables_in_dashboardstrapi'};
            $tableData = collect(DB::connection('mysqlOne')->table($tableName)->get()); // Fetch all records from the table

            // Convert integer fields to strings
            $tableData = $tableData->map(function ($item) {
                return (array) $item;
            })->map(function ($item) {
                return array_map(function ($value) {
                    if (is_int($value)) {
                        return (string) $value;
                    }
                    return $value;
                }, $item);
            });

            // If table is blogs alter url to include slug of blog
            switch ($tableName) {
                case 'blogs':
                    foreach ($tableData as $key => $value) {
                        $data[] = [
                            'tableName' => $value['title'],
                            'url' => $url . '/news/' . $value['slug'],
                            'data' => $value['body'],
                            'schema' => $this->addSchema(is_string($tableData), $value['title']),
                        ];
                    }
                    break;
                default:
                    $url = $routes[$tableName] ?? '';
                    $data[] = [
                        'tableName' => $tableName,
                        'url' => $url,
                        'data' => $tableData,
                        'schema' => $this->addSchema(is_string($tableData), $tableName),
                    ];
                    break;
            }
        }

        // Return the collected data as JSON
        return response()->json($data);
    }
}
?>
