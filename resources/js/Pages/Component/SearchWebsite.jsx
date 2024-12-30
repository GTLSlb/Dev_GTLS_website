import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Downshift from "downshift";
import Typesense from "typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-dom";

export default function SearchWebsite() {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setfilteredResults] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const suggRef = useRef(null);
    const host = window.Laravel.typesenseHost;
    const protocol = window.Laravel.typesenseProtocol;
    const port = window.Laravel.typesensePort;
    const apiKey = window.Laravel.typesenseAdminKey;

    const handleScroll = (event) => {
        // Get the bounding rectangle of the referenced div
        if (suggRef.current) {
            const rect = suggRef.current.getBoundingClientRect();
            // Check if the scroll happened outside the div
            if (rect.top > window.innerHeight || rect.bottom < 0) {
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

    const getPathname = (url) => {
        const parsedUrl = new URL(url);
        if (parsedUrl.pathname == "/") {
            return url;
        } else {
            return parsedUrl.pathname;
        }
    };

    const typesenseSearchAdapter = new TypesenseInstantsearchAdapter({
        server: {
            apiKey: apiKey,
            nodes: [
                {
                    host: host,
                    port: port,
                    protocol: protocol,
                },
            ],
        },
        additionalSearchParameters: {
            query_by: "body",
        },
        collectionSpecificSearchParameters: [
            { name: "aboutuses", query_by: "body" },
        ],
    });

    // Initialize the Typesense client
    const client = new Typesense.Client({
        nodes: [
            {
                host: host, // Your Typesense server host
                port: port, // Your Typesense server port
                protocol: protocol, // Protocol (http or https)
            },
        ],
        apiKey: apiKey, // Your Typesense API key
    });

    const [components, setComponents] = useState([]);
    const [indices, setIndices] = useState([]);

    const addSearchIndex = (item) => {
        if (typeof item.data == "string") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "data",
                    highlight_full_fields: "",
                },
            };
        } else {
            if (item.tableName == "branches") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "branch_name",
                        highlight_full_fields: "",
                    },
                };
            } else if (
                item.tableName == "certificates" ||
                item.tableName == "news_posts"
            ) {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "description",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "positions") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "position_details, position_title",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "services") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "description, title",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "socials") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "name, url",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "team_members") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "member_name",
                        highlight_full_fields: "",
                    },
                };
            } else {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body",
                        highlight_full_fields: "",
                    },
                };
            }
        }
    };

    const addSearchParameters = (item) => {
        const config = {
            query_by: "",
            highlight_full_fields: "",
        };

        if (typeof item.data === "string") {
            config.query_by = "data";
        } else {
            switch (item.tableName) {
                case "branches":
                    config.query_by = "branch_name";
                    break;
                case "certificates":
                case "news_posts":
                    config.query_by = "description";
                    break;
                case "positions":
                    config.query_by = "position_details, position_title";
                    break;
                case "services":
                    config.query_by = "description, title";
                    break;
                case "socials":
                    config.query_by = "name, url";
                    break;
                case "team_members":
                    config.query_by = "member_name";
                    break;
                default:
                    config.query_by = "body";
                    break;
            }
        }

        return config;
    };
    const fetchAllComponents = async () => {
        await axios
            .get("/getAllComponents")
            .then((res) => {
                setComponents(res.data);
                let items = [],
                    config = {},
                    temp = res.data;
                temp.map((item) => {
                    config[item.tableName] = addSearchParameters(item);
                    items.push(addSearchIndex(item));
                });
                typesenseSearchAdapter.updateConfiguration({
                    server: {
                        apiKey: apiKey,
                        nodes: [
                            {
                                host: host,
                                port: port,
                                protocol: protocol,
                            },
                        ],
                    },
                    additionalSearchParameters: {
                        query_by: "data",
                    },
                    collectionSpecificSearchParameters: config,
                });
                setIndices(items);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    useEffect(() => {
        fetchAllComponents();
    }, []);

    // client.collections("aboutuses").delete()
    // client.collections("Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight Test").delete()
    // client.collections("Introducing Gold Tiger Logistics’ National Road Alerts Feature Test").delete()
    // client.collections("Introducing Gold Tiger Logistics’ National Road Alerts Feature").delete()
    // client.collections("branches").delete()
    // client.collections("capability_statements").delete()
    // client.collections("certificates").delete()
    // client.collections("going_greens").delete()
    // client.collections("news_posts").delete()
    // client.collections("pallet_terms").delete()
    // client.collections("positions").delete()
    // client.collections("safety_compliances").delete()
    // client.collections("services").delete()
    // client.collections("socials").delete()
    // client.collections("team_members").delete()
    // client.collections("technologies").delete()
    // client.collections("terms").delete()
    const addDocuments = async (obj) => {
        try {
            // Step 1: Retrieve existing documents
            const col = await client.collections(obj.tableName);
            const docFromDb = components?.find(
                (comp) => comp.tableName === obj.tableName
            );

            // Check if docFromDb.data is an array
            if (!Array.isArray(docFromDb?.data)) return;

            // Step 2: Create an array of promises to check and add documents
            const promises = docFromDb.data.map(async (doc) => {
                try {
                    // Attempt to retrieve the document
                    await col.documents(doc.id).retrieve();
                } catch (err) {
                    // If the document is not found, create it
                    if (err.toString().startsWith("ObjectNotFound2")) {
                        try {
                            const newDoc = {
                                ...doc,
                                url: doc.url,
                            };

                            const createdDoc = await col
                                .documents()
                                .create(newDoc)
                                .then((res) => {})
                                .catch((err) => {});
                        } catch (createErr) {
                            //console.error('Error adding document:', createErr);
                        }
                    } else {
                        // Log other types of errors if necessary
                        //console.error('Error retrieving document:', err);
                    }
                }
            });

            // Step 3: Wait for all promises to complete
            await Promise.all(promises);
        } catch (error) {
            //console.error("Error adding documents:", error);
        }
    };

    const createCollection = async () => {
        try {
            components?.map(async (comp) => {
                // Check if the collection exists
                client
                    .collections()
                    .retrieve()
                    .then(async (res) => {
                        const existingCollections = res;

                        const collectionExists =
                            existingCollections?.find(
                                (collection) =>
                                    collection.name == comp?.tableName
                            ) ?? false;
                        // Create the collection if it doesn't exist
                        if (collectionExists == false) {
                            console.log("creating collection", comp);
                            await client.collections().create(comp.schema);
                        }
                    });

                // Add documents to the collection
                addDocuments(comp);
            });
        } catch (error) {
            console.error(
                "Error creating collection or adding documents:",
                error
            );
        }
    };

    useEffect(() => {
        if (components?.length > 0) {
            createCollection();
        }
    }, [components, indices]);

    function navigateToSelector(selector, url) {
        if (getPathname(url) !== window.location.pathname) {
            window.location.href = url;
        }
        const elements = document.body.getElementsByTagName("*");
        const selectorParts = selector.split(" > ");
        const currentElement = findElement(elements, selectorParts);

        if (currentElement) {
            setIsOpen(false);
            currentElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    const [searchQuery, setSearchQuery] = useState("");
    // Define a search function to find relevant words
    function highlightRelevantWords(text, query) {
        // Normalize the text and query for case-insensitive matching
        const normalizedText = text.toLowerCase();
        const normalizedQuery = query.toLowerCase();

        // Find the index of the query in the text
        const index = normalizedText.indexOf(normalizedQuery);

        // If the query is not found, return an empty string
        if (index === -1) {
            return ""; // or return the original text if preferred
        }

        // Calculate the start and end positions for the result
        const start = Math.max(0, index - 20); // Show 20 characters before
        const end = Math.min(text.length, index + query.length + 20); // Show 20 characters after

        // Extract the relevant substring
        const relevantSubstring = text.slice(start, end);

        // Format the result with the specified syntax
        return `... ${relevantSubstring.replace(
            new RegExp(query, "gi"),
            (match) => match
        )} ...`;
    }

    const Hit = ({ hit }) => {
        const title = hit?.document?.url || "No title available";
        const parser = new DOMParser();
        const key = hit?.highlights?.[0]?.field;
        const doc = parser.parseFromString(hit?.document[key], "text/html");

        // Extract the text content from the HTML
        const textContent = doc.body.textContent;
        const description = highlightRelevantWords(textContent, searchQuery);

        return (
            <div
                className="px-4 py-1 hover:bg-goldt/50 hover:cursor-pointer"
                onClick={() =>
                    navigateToSelector(
                        hit?.document?.selector,
                        hit?.document?.url
                    )
                }
            >
                <h3 className="text-gray-600 text-xs">{title}</h3>
                <p className="hit-description">{description}</p>
            </div>
        );
    };

    const [results, setResults] = useState([]);
    const handleSearchChange = async (event) => {
        const query = event.target.value;
        setSearchQuery(event.target.value);

        if (query) {
            try {
                const allResults = [];
                const searchPromises = indices?.map(async (col) => {
                    const response = await client
                        .collections(col.name)
                        .documents()
                        .search({
                            q: query,
                            query_by: col.searchParameters.query_by,
                        });

                    // Only push if there are hits
                    if (response.hits?.length > 0) {
                        allResults.push(
                            ...response.hits.map((hit) => ({
                                ...hit,
                                collection: col.name,
                            }))
                        );
                    }
                });

                // Wait for all promises to resolve
                await Promise.all(searchPromises);
                setResults(allResults);
            } catch (error) {
                console.log("Search error:", error);
                // setResults([]);
            }
        } else {
            // setResults([]);
        }
    };

    return (
        <div className="flex items-center justify-between w-full max-h-[40px] focus:outline-none">
            {indices?.length > 0 && (
                /*<InstantSearch searchClient={searchClient} indexName="going_greens" indices={indices}>
                    <SearchBox
                        onChange={handleSearchChange}
                        value={searchQuery}
                        className="relative"
                        translations={{ placeholder: 'Search...' }}
                        searchAsYouType
                        showLoadingIndicator
                    />
                    <div className="w-full absolute bg-white top-7 z-[100] max-h-[200px] overflow-auto">
                    {indices.map((index) => (
                        <Hits
                            key={index.name}
                            hitComponent={Hit}
                            indexName={index.name}
                        />
                    ))}
                    </div>

                </InstantSearch>*/
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onMouseDown={() => setIsOpen(true)}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="bg-[#e7c160]/40 border-none h-[20px] w-full text-gray-700 placeholder-gray-600 focus:ring-gray-400"
                    />
                    <div
                        className={`w-full absolute bg-white top-7 z-[100] max-h-[200px] overflow-auto containerscroll`}
                    >
                        {results.map((hit) => (
                            <Hit hit={hit} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
