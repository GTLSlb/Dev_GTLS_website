<?php

namespace App\Http\Controllers;

use Exception;
use Typesense\Client;
use Illuminate\Http\Request;
use App\Http\Promise\Promise;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = $this->createTypesenseClient();
    }

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
                        'type' => 'string',
                    ];
                    break;
                case "certificates":
                case "news_posts":
                    $fields[] = [
                        'name' => 'description',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    break;
                case "positions":
                    $fields[] = [
                        'name' => 'position_title',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'position_details',
                        'type' => 'string',
                    ];
                    break;
                case "services":
                    $fields[] = [
                        'name' => 'description',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    break;
                case "socials":
                    $fields[] = [
                        'name' => 'name',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'url',
                        'type' => 'string',
                    ];
                    break;
                case "team_members":
                    $fields[] = [
                        'name' => 'member_name',
                        'type' => 'string',
                    ];
                    break;
                case "pallet_terms":
                        $fields[] = [
                            'name' => 'body',
                            'type' => 'string',
                        ];
                        $fields[] = [
                            'name' => 'title',
                            'type' => 'string',
                        ];
                        break;
                case "enquiries_types":
                    $fields[] = [
                        'name' => 'name',
                        'type' => 'string',
                    ];
                    break;
                case "capability_statements":
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    break;
                default:
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
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

    function get_url($item, $routes, $tableName) {
        switch ($tableName) {
            case 'blogs':
                return $routes[$tableName] . '/news/' . $item['slug'];
            default:
                return $routes[$tableName] ?? '';
        }
    }

    public function fetchData(){
        $url = getenv('URL');
        $routes = [
            'aboutuses' => $url . '/aboutus',
            'blogs' => $url . '/news',
            'branches' => $url . '/contact_us',
            'certificates' => $url . '/',
            'team_members' => $url . '/aboutus',
            'technologies' => $url . '/technologies',
            'capability_statements' => $url . '/aboutus',
            'going_greens' => $url . '/goinggreen',
            'pallet_terms' => $url . '/',
            'positions' => $url . '/opportunities',
            'safety_compliances' => $url . '/',
            'services' => $url . '/#services',
            'socials' => $url . '/',
            'terms' => $url . '/',
            'enquiries_types' => $url . '/contact_us',
        ];

        //Get all data from all tables from database
        $tables = DB::connection('mysqlOne')->select('SHOW TABLES');
        $data = [];
        $tableSchema = (object) [];

        //Filter out certain tables from the data
        $filteredTables = collect($tables)->filter(function ($table) {
            $dbName = $_ENV['DB_DATABASE_TYPESENSE'];
            $tableName = $table->{"Tables_in_{$dbName}"};
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
                $tableName == 'footers' ||
                $tableName == 'heared_froms'
            );
        });

        //Iterate through each table and fetch its data
        foreach ($filteredTables as $table) {
            $dbName = $_ENV['DB_DATABASE_TYPESENSE'];
            $tableName = $table->{"Tables_in_{$dbName}"};
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

            // Add Url to each data field
            $tableData = $tableData->map(function ($item) use ($routes, $tableName) {
                $item = (array) $item;
                $item['url'] = $this->get_url($item, $routes, $tableName);
                return $item;
            });

            // If table is blogs alter url to include slug of blog
            switch ($tableName) {
                case 'blogs':
                    foreach ($tableData as $key => $value) {
                        if ($value['published_at'] !== null) {
                            $body = isset($value['body']) ? $value['body'] : [];
                            $data[] = [
                                'tableName' => $value['title'],
                                'url' => $url . '/news/' . $value['slug'],
                                'data' => [['body' => $body]],
                                'schema' => $this->addSchema(is_string($tableData), $value['title']),
                            ];
                        }
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

    public function addDocuments($components, $obj) {
        // try {
            // Step 1: Retrieve existing documents
            $col = $this->client->collections[$obj['tableName']];
            $docFromDb = null;
            foreach ($components as $comp) {
                if(gettype($comp) == 'string'){
                    if ($comp == $obj['tableName']) {
                        $docFromDb = $comp;
                        break;
                    }
                }else if(gettype($comp) == 'array'){
                    if ($comp['tableName'] == $obj['tableName']) {
                        $docFromDb = $comp;
                        break;
                    }
                }
            }

            // Check if docFromDb->data is an array
            if (!is_array($docFromDb) || !isset($docFromDb['data'])) return;

            // Step 2: Create an array of promises to check and add documents
            $promises = [];
            foreach ($docFromDb['data'] as $doc) {
                $promises[] = $this->checkAndAddDocument($col, $doc);
            }

            // Step 3: Wait for all promises to complete
            $results = array_map(function ($promise) {
                return $promise;
            }, $promises);
        // } catch (Exception $error) {
        //     // Log error if necessary
        // }
    }
    public function checkAndAddDocument($col, $doc) {
        if (isset($doc['id'])) {
            $id = $doc['id'];
            try {
                $res = $col->documents[$id]->retrieve();
            } catch (Exception $err) {
                if (str_contains($err->getMessage(), 'Could not find a document') == 1) {
                    try {
                        $newDoc = [
                            ...$doc,
                            'url' => $doc['url'],
                        ];
                        $res = $col->documents->create($newDoc);
                    } catch (Exception $createErr) {
                        throw $createErr;
                    }
                } else {
                    throw $err;
                }
            }
        return $res;
    }}

    public function createTypesenseClient() {
        return new Client([
            'nodes' => [
                [
                    'host' => $_ENV['TYPESENSE_HOST'], // Typesense server host
                    'port' => $_ENV['TYPESENSE_PORT'], // Typesense server port
                    'protocol' => $_ENV['TYPESENSE_PROTOCOL'], // Protocol (http or https)
                ],
            ],
            'api_key' => $_ENV['TYPESENSE_ADMIN_API_KEY'], // Typesense API key
            'connectionTimeoutSeconds' => 20,
            'logLevel' => 'SILENT' // Set log level
        ]);
    }

    public function addCollection(Request $request) {
        // try {
            $components = $request->input('collections');
            $allCollections = [];

            // Retrieve all collections from Typesense
            $allCollections = $this->client->collections->retrieve();
            if (empty($allCollections)) {
                // If allCollections is empty, map over components and create client collection
                array_map(function ($component) {
                    $this->client->collections->create($component['schema']);
                    $this->addDocuments($component, $component);
                }, $components);
            }else{

                    foreach ($components as $comp) {
                        $collectionExists = array_reduce($allCollections, function ($carry, $collection) use ($comp) {
                            return $carry || $collection['name'] == $comp['tableName'];
                        }, false);
                        // Create the collection if it doesn't exist
                        if (!$collectionExists) {
                            $this->client->collections->create($comp['schema']);
                            $this->addDocuments($components, $comp);
                        } else {
                            // Add documents to the collection
                            $this->addDocuments($components, $comp);
                        }
                    }
            }

            return response()->json(['message' => 'Add Collection Success', 'data' => $this->client->collections->retrieve()], 200);
        // } catch (Exception $e) {
        //     return response()->json(['error' => 'Add Collection Failed', 'message' => $e], 500);
        // }
    }

    public function searchSchema(Request $request)
    {
        try{
            $query = $request->input('query');
            $indices = $request->input('indices');

            $allResults = [];
            foreach ($indices as $col) {
                $response = $this->client
                    ->collections[$col['name']]
                    ->documents
                    ->search([
                        'q' => $query,
                        'query_by' => $col['searchParameters']['query_by'],
                    ]);
                $results = $response['hits'];
                $allResults = array_merge($allResults, $results);
            }

            return response()->json(['data' => $allResults, 'message' => "Search Success"], 200);
        }catch(Exception $e){
            if(str_contains($e->getMessage(), 'cURL error') == 1){
                return response()->json(['error' => $e, 'message' => 'Network Error, Check Connection'], 500);
            }else{
                return response()->json(['error' => $e, 'message' => 'Search Failed'], 500);
            }
        }
    }

    public function deleteAllCollections(){
        try {
            // Get all collections
            $collections = $this->client->collections->retrieve();

            foreach ($collections as $collection) {
                // Delete each collection
                $this->client->collections[$collection['name']]->delete();
                echo "Deleted collection: " . $collection['name'] . "\n";
            }

            echo "All collections have been deleted.\n";
        } catch (Exception $e) {
            echo "Error deleting collections: " . $e->getMessage() . "\n";
        }
    }
}

?>
