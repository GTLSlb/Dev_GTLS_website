import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import axios from "axios";
import SearchPopup from "./SearchPopup";
import PropTypes from "prop-types";

export default function SearchWebsite() {
    const host = window.Laravel.typesenseHost;
    const protocol = window.Laravel.typesenseProtocol;
    const port = window.Laravel.typesensePort;
    const apiKey = window.Laravel.typesenseAdminKey;
    const [showSearch, setShowSearch] = useState(false);
    const [errMsg, setError] = useState("");

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
                        query_by: "description, title",
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
            } else if (item.tableName == "blogs") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title, slug",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "pallet_terms") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "enquiries_types") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "name",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "capability_statements") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "aboutuses") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "technologies") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "going_greens") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title, description",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "safety_compliances") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title",
                        highlight_full_fields: "",
                    },
                };
            } else if (item.tableName == "terms") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title",
                        highlight_full_fields: "",
                    },
                };
            } else {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body, title, slug",
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
                    config.query_by = "description, title";
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
                case "blogs":
                    config.query_by = "body, title, slug";
                    break;
                case "pallet_terms":
                    config.query_by = "body, title";
                    break;
                case "enquiries_types":
                    config.query_by = "name";
                    break;
                case "capability_statements":
                    config.query_by = "body, title";
                    break;
                case "aboutuses":
                    config.query_by = "body";
                    break;
                case "technologies":
                    config.query_by = "body";
                    break;
                case "going_greens":
                    config.query_by = "body, title, description";
                    break;
                case "safety_compliances":
                    config.query_by = "body, title";
                    break;
                case "terms":
                    config.query_by = "body, title";
                    break;
                default:
                    config.query_by = "body, title, slug";
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
                console.error("err", err);
            });
    };

    useEffect(() => {
        fetchAllComponents();
    }, []);

    const addCollections = async () => {
        const formData = {
            collections: components,
        };
        axios
            .post("/addCollections", formData)
            .then(() => {})
            .catch((error) => {
                console.error(error);
            });
    };
    useEffect(() => {
        if (components?.length > 0 && indices?.length > 0) {
            addCollections();
        }
    }, [components, indices]);

    function findElementByText(text) {
        const elements = document.body.getElementsByTagName("*");

        for (let el of elements) {
            if (el.textContent.includes(text)) {
                return el; // Return the first matching element
            }
        }
        return null; // Return null if no matching element is found
    }


    function navigateToSelector(selector, url) {
        if (getPathname(url) !== window.location.pathname) {
            window.location.href = url;
            setShowSearch(false);
            handleClearInput();
        }
        else{
            const field = selector?.highlights?.[0]?.field == 'slug' ? selector?.highlights?.[1]?.field : selector?.highlights?.[0]?.field;

            const selectorParts = selector?.document[field].split(" > ");
            const currentElement = findElementByText(selectorParts);

            if (currentElement) {
                setShowSearch(false);
                currentElement.scrollIntoView({ behavior: "smooth" });
                handleClearInput();
            }else{
                setShowSearch(false);
                handleClearInput();
            }
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

        // If the query is not found, return original text
        if (index === -1) {
            return normalizedText.slice(0, 200) + "...";
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
                className="px-2 py-1 hover:bg-goldt/50 hover:cursor-pointer"
                onClick={() => navigateToSelector(hit, hit?.document?.url)}
            >
                <h3 className="text-gray-600 text-xs">{title}</h3>
                <p className="hit-description">{description}</p>
            </div>
        );
    };
    Hit.propTypes = {
        hit: PropTypes.object,
    }

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleSearchChange = async (event) => {
        setIsLoading(true);
        setShowSearch(true);
        setError("");
        const query = event.target.value;
        setSearchQuery(event.target.value);

        axios
            .post("/searchCollections", {
                query: query,
                indices: indices,
            })
            .then((res) => {
                setResults(res.data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
                setResults([]);
                setError(err.response.data.message || "Something went wrong");
            });
    };

    const handleFeedbackButtonClick = () => {
        setShowSearch(!showSearch);
    };
    const handlePopUpClose = () => {
        setShowSearch(false);
        handleClearInput();
    };

    const handleClearInput = () => {
        setResults([]);
        setSearchQuery("");
    };

    return (
        <div className="fixed right-0 top-[22%] z-50">
            <button
                className="flex items-center justify-center bg-goldd text-black p-2 py-6 rounded font-bold"
                onClick={handleFeedbackButtonClick}
            >
                <SearchIcon />
            </button>
            {showSearch && (
                <SearchPopup
                    errMsg={errMsg}
                    handleClearInput={handleClearInput}
                    Hit={Hit}
                    results={results}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    handleSearchChange={handleSearchChange}
                    handlePopUpClose={handlePopUpClose}
                    isOpen={showSearch}
                    indices={indices}
                    setIsOpen={setShowSearch}
                />
            )}
        </div>
    );
}
