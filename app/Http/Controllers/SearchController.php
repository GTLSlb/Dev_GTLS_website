<?php

namespace App\Http\Controllers;

use Exception;
use Log;
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
                case "blogs":
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'slug',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
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
                case "aboutuses":
                case "technologies":
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    break;
                case "safety_compliances":
                case "terms":
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    break;
                    case "going_greens":
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'description',
                        'type' => 'string',
                    ];
                    break;
                default:
                    $fields[] = [
                        'name' => 'body',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'title',
                        'type' => 'string',
                    ];
                    $fields[] = [
                        'name' => 'slug',
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

    public function get_url($item, $routes, $tableName) {
        switch ($tableName) {
            case 'blogs':
                return $routes[$tableName] . '/' .$item['slug'];
            default:
                return $routes[$tableName] ?? '';
        }
    }

    public function fetchData(){
        $url = $_ENV['APP_URL'];
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
            'news_posts' => $url . '/news',
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
                $tableName == 'heared_froms' ||
                $tableName == 'search_indices'
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
                            $combined_data = [
                                ['id' => $value['id'], 'body' => $value['body'], 'title' => $value['title'], 'slug' => $value['slug'], 'url' => $this->get_url($value, $routes, $tableName)]
                            ];
                            $data[] = [
                                'tableName' => $value['title'],
                                'url' => $this->get_url($value, $routes, $tableName),
                                'data' => $combined_data,
                                'schema' => $this->addSchema(is_string($tableData), $value['title']),
                            ];
                        }
                    }
                    break;
                default:
                    $url = $routes[$tableName] ?? '';
                    $hasPublishedAtKey = $tableData->contains(function ($item) {
                        return array_key_exists('published_at', $item);
                    });

                    // Filter the data if the key exists
                    $filteredData = $hasPublishedAtKey ? $tableData->filter(function ($item) {
                        return isset($item['published_at']) && $item['published_at'] !== null;
                    }) : $tableData;

                    // Reset the keys if needed
                    $filteredData = $filteredData->values();

                    // Check if there's any data with published_at not null
                    if ($filteredData->isNotEmpty() && $filteredData->contains(function ($item) {
                        return isset($item['published_at']) && $item['published_at'] !== null;
                    })) {
                        $data[] = [
                            'tableName' => $tableName,
                            'url' => $url,
                            'data' => $filteredData,
                            'schema' => $this->addSchema(is_string($tableData), $tableName),
                        ];
                    }
                    break;
            }
        }

        // Return the collected data as JSON
        return response()->json($data);
    }

    public function createSearchIndices() {
        $config = [];
        $items = [];
        $data = [];

        $components = json_decode($this->fetchData()->getContent(), true);
        foreach ($components as $item) {
            if (isset($item['tableName'])) {
                //$config[$item['tableName']] = $this->addSearchParameters($item);
                $items[] = $this->addSearchIndex($item);
            }
        }
            // Add items to search_indices table
    foreach ($items as $item) {
        // Check if item already exists in search_indices table
        $existingItem = DB::connection('mysqlOne')->table('search_indices')->where('name', $item['name'])->where('title', $item['title'])->first();
        if (!$existingItem) {
            // Convert searchParameters from JSON to string
            $searchParameters = json_encode($item['searchParameters']);

            // Add item to search_indices table
            DB::connection('mysqlOne')->table('search_indices')->insert([
                'name' => $item['name'],
                'title' => $item['title'],
                'searchParameters' => $searchParameters,
            ]);
        }
    }
        $data[] = [
            'components' => $components,
            'config' => $config,
            'items' => $items,
        ];
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
            $components = json_decode($this->fetchData()->getContent(), true);
            $allCollections = [];

            // Retrieve all collections from Typesense
            $allCollections = $this->client->collections->retrieve();
            // Log::info($allCollections);
            if (empty($allCollections)) {
                // If allCollections is empty, map over components and create client collection
                array_map(function ($component) use ($components) {
                    $this->client->collections->create($component['schema']);
                    $this->addDocuments($components, $component);
                }, $components);
            }else{
                    foreach ($components as $comp) {
                        $collectionExists = array_reduce($allCollections, function ($carry, $collection) use ($comp) {
                            return $carry || $collection['name'] == isset($comp['tableName']) ? $comp['tableName'] : $comp['title'];
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

    public function getPostImgUrl($newsArticle, $hits){
        $relatedfileID = DB::connection('mysqlOne')->table('files_related_mph')->where('related_type', 'api::blog.blog')->where('field', 'CoverImage')->where('related_id', $newsArticle->id)->first();
        if(isset($relatedfileID)){
            // There is a cover image related to this blog post
            $file = DB::connection('mysqlOne')->table('files')->where('id', $relatedfileID->file_id)->first();

            if(isset($file)){
                // Add URl and alternative text to the hits
                if(is_array($hits) && isset($hits[0]['document'])){

                    $hits[0]['document']['img_url'] = $file->url;
                    $hits[0]['document']['alternative_text'] = $file->alternative_text;
                    return $hits;
                }else{
                    return $hits;
                }
            }else{
                return $hits;
            }
        }
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
                        'prioritize_exact_match' => true
                    ]);
                $isFromNews = DB::connection('mysqlOne')->table('blogs')->where('title', $col['name'])->first();
                if(isset($isFromNews) && !empty($response['hits'])){
                    $alteredhits = $this->getPostImgUrl($isFromNews, $response['hits']);
                    $results = $alteredhits;
                }else{
                    $results = $response['hits'];

                }
                $allResults = array_merge($allResults, $results);
            }

            usort($allResults, function($a, $b) {
                $aScore = isset($a['text_match_info']) && is_array($a['text_match_info']) ? $a['text_match_info']['score'] : 0;
                $bScore = isset($b['text_match_info']) && is_array($b['text_match_info']) ? $b['text_match_info']['score'] : 0;
                return $bScore <=> $aScore;
            });
            return response()->json(['data' => $allResults, 'message' => "Search Success"], 200);
        }catch(Exception $e){
            if(str_contains($e->getMessage(), 'cURL error') == 1){
                return response()->json(['error' => $e, 'message' => 'Network Error, Check Connection'], 500);
            }else{
                return response()->json(['error' => $e->getMessage(), 'message' => 'Search Failed'], 500);
            }
        }
    }

    public function addSearchIndex($item){
        if (is_string($item['data'])) {
            return [
                'name' => $item['tableName'],
                'title' => $item['tableName'],
                'searchParameters' => [
                    'query_by' => 'data',
                    'highlight_full_fields' => '',
                ],
            ];
        } else {
            switch ($item['tableName']) {
                case 'branches':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'branch_name',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'certificates':
                case 'news_posts':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'description, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'positions':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'position_details, position_title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'services':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'description, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'socials':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'name, url',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'team_members':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'member_name',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'blogs':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title, slug',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'pallet_terms':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'enquiries_types':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'name',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'capability_statements':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'aboutuses':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'technologies':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'going_greens':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title, description',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'safety_compliances':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                case 'terms':
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters' => [
                            'query_by' => 'body, title',
                            'highlight_full_fields' => '',
                        ],
                    ];
                default:
                    return [
                        'name' => $item['tableName'],
                        'title' => $item['tableName'],
                        'searchParameters'=> [
                            'query_by'=> "body, title, slug",
                            'highlight_full_fields'=> "",
                        ],
                    ];
            }}
    }

    public function addSearchParameters($item){
        $config = [
            'query_by' => "",
            'highlight_full_fields'=> "",
        ];
        if (is_string($item['data'])) {
            $config['query_by'] = 'data';
        }else {
            switch ($item['tableName']) {
                case 'branches':
                    $config['query_by'] = 'branch_name';
                    break;
                case 'certificates':
                case 'news_posts':
                    $config['query_by'] = 'description, title';
                    break;
                case 'positions':
                    $config['query_by'] = 'position_details, position_title';
                    break;
                case 'services':
                    $config['query_by'] = 'description, title';
                    break;
                case 'socials':
                    $config['query_by'] = 'name, url';
                    break;
                case 'team_members':
                    $config['query_by'] = 'member_name';
                    break;
                case 'blogs':
                    $config['query_by'] = 'body, title, slug';
                    break;
                case 'pallet_terms':
                    $config['query_by'] = 'body, title';
                    break;
                case 'enquiries_types':
                    $config['query_by'] = 'name';
                    break;
                case 'capability_statements':
                    $config['query_by'] = 'body, title';
                    break;
                case 'aboutuses':
                    $config['query_by'] = 'body';
                    break;
                case 'technologies':
                    $config['query_by'] = 'body';
                    break;
                case 'going_greens':
                    $config['query_by'] = 'body, title, description';
                    break;
                case 'safety_compliances':
                    $config['query_by'] = 'body, title';
                    break;
                case 'terms':
                    $config['query_by'] = 'body, title';
                    break;
                default:
                    $config['query_by'] = 'body, title, slug';
                    break;
            }
        }
        return $config;
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
