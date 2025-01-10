import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Downshift from "downshift";
import Typesense from "typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import axios from "axios";

export default function SearchWebsite() {
    const [searchResults, setSearchResults] = useState([]);
    const [filteredResults, setfilteredResults] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const host = window.Laravel.typesenseHost;
    const protocol = window.Laravel.typesenseProtocol;
    const port = window.Laravel.typesensePort;
    const apiKey = window.Laravel.typesenseAdminKey;

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
            logLevel: "SILENT",
            connectionTimeoutSeconds: 20,
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
        connectionTimeoutSeconds: 20,
        logLevel: "SILENT",
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

    const addCollections = async () => {
        const formData = {
            collections: components
        }
        axios.post('/addCollections', formData)
        .then((res) => {
            console.log('Collections added');
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
        if (components?.length > 0) {
            // createCollection();
            addCollections()
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

    const divRef = useRef();
    useEffect(() => {
        const handleScroll = () => {
          if (isOpen) {
            setIsOpen(false);
          }
        };
        const handleClickOutside = (event) => {
          if (!divRef.current?.contains(event.target)) {
            setIsOpen(false);
          }
        };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          window.removeEventListener("scroll", handleScroll);
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [setIsOpen, isOpen, divRef]);

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
    const [isLoading, setIsLoading] = useState(false);
    const handleSearchChange = async (event) => {
        setIsLoading(true);
        setIsOpen(true);
        const query = event.target.value;
        setSearchQuery(event.target.value);

        axios.post('/searchCollections', {
            query: query,
            indices: indices
        }).then((res) => {
            console.log(res.data);
            setResults(res.data.data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);
        })
    };

    return (
        <div className="flex items-center justify-between w-full max-h-[40px] focus:outline-none">
            {indices?.length > 0 && (
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onMouseDown={() => setIsOpen(true)}
                        onClick={() => setIsOpen(true)}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        className="bg-[#e7c160]/40 border-none h-[20px] w-full text-gray-700 placeholder-gray-600 focus:ring-gray-400"
                    />
                    {isOpen && isLoading &&(
                        <div>Loading..</div>
                    )}
                    {isOpen &&<div
                        ref={divRef}
                        className={`w-full absolute bg-white top-7 z-[100] max-h-[200px] overflow-auto containerscroll`}
                    >
                        {results.map((hit) => (
                            <Hit hit={hit} />
                        ))}
                    </div>}
                </div>
            )}
        </div>
    );
}
