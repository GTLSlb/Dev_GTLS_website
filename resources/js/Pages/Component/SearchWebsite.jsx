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
    const [query, setQuery] = useState("");
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
        },
        additionalSearchParameters: {
            query_by: "body",
        },
        collectionSpecificSearchParameters: [
            {   name:"aboutuses",
                "query_by": "body",
            }
        ]
    });

    const searchClient = typesenseSearchAdapter.searchClient;
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
    const [indices, setIndices] = useState([
        {name:
            "aboutuses",
            fields: [
                { name: "body", type: "auto" },
            ],
        }
    ]);

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
                console.log(config);
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
                // setIndices(items);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    useEffect(() => {
        fetchAllComponents();
    }, []);
    const addDocuments = async (obj) => {
        try {
            // Step 1: Retrieve existing documents
            const col = await client.collections(obj.tableName);
            const docFromDb = components?.find((comp) => comp.tableName === obj.tableName);

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
                        console.log("Document not found:", doc);
                        console.log("Creating document...", err);
                        try {
                            const createdDoc = await col.documents().create(doc)
                            .then((res) => {

                            })
                            .catch((err) => {

                            })
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
                client.collections().retrieve().then(async (res) => {
                    const existingCollections = res;

                    const collectionExists = existingCollections?.find((collection) => collection.name == comp?.tableName) ?? false;
                    // Create the collection if it doesn't exist
                    if (collectionExists == false) {
                        await client.collections().create(comp.schema);
                    }
                })

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

    const filterResults = (value) => {
        let filteredResults = searchResults.filter((result) => {
            // Check if the URL matches the search value
            const urlMatches = result.url.includes(value);

            // Check if any item's text matches the search value
            const itemsMatch = result.items.some((item) =>
                item.label.toLowerCase().includes(value.toLowerCase())
            );

            // Return true if either the URL or any item's text matches
            return urlMatches || itemsMatch;
        });
        setfilteredResults(filteredResults);
    };

    const fetchOptions = async (inputValue) => {
        if (searchResults?.length != 0) {
            return; // Return if already fetched
        }
        setSearchResults([]);
        setIsLoadingResults(true); // Set loading state
        try {
            const response = await axios.get("/search", {
                headers: {
                    searchKeyword: inputValue,
                },
            });

            // Map response data to match expected structure for AsyncSelect
            setSearchResults(response.data);
            setfilteredResults(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching search results:", error);
            return []; // Return empty array on error
        } finally {
            setIsLoadingResults(false);
        }
    };

    const Hit = ({ hit }) => {
        console.log('Hit data:', hit);
        const title = hit?.title || 'No title available';
        const description = hit?.description || 'No description available';

        return (
            <div className="hit-item">
                <h3 className="hit-title">{title}</h3>
                <p className="hit-description">{description}</p>
            </div>
        );
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        console.log(event.currentTarget.value);
        setSearchQuery(event.currentTarget.value);
    };
    return (
        // <Downshift
        //     onInputValueChange={(e) => setQuery(e)}
        //     isOpen={isOpen}
        //     onOuterClick={() => setIsOpen(false)}
        //     itemToString={(item) => (item ? item.label : "")}
        // >
        //     {({ getInputProps, getMenuProps, getItemProps }) => (
        //         <div>
        //             <div className="relative flex items-center justify-between w-full max-h-[40px] focus:outline-none">
        //                 <input
        //                     {...getInputProps({
        //                         onClick: () => {
        //                            setIsOpen(true)
        //                         },
        //                         onChange: (event) => {
        //                             filterResults(event.target.value)
        //                         }
        //                     })}
        //                     placeholder="Search..."
        //                     className="focus:outline-none bg-[#edce80] sm:bg-[#ebcb7a] md:bg-[#e7c160] rounded-md w-full text-gray-700 placeholder-gray-600"
        //                 />
        //                 {isLoadingResults ? (
        //                     <div className="text-gray-600">
        //                         <CircularProgress size={12} color="inherit" />
        //                     </div>
        //                 ) : (
        //                     <SearchIcon
        //                         className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
        //                         onClick={() => fetchOptions(query)}
        //                     />
        //                 )}
        //             </div>
        //             {isOpen && (
        //                 <ul
        //                     className="absolute max-w-[230px] z-[100] text-sm bg-gray-200 border border-gray-200 text-gray-700 max-h-[250px] mt-1 rounded-md overflow-auto"
        //                     {...getMenuProps()}
        //                 >
        //                     {isLoadingResults && (
        //                         <div className="text-gray-600 flex items-center p-3 w-[200px]">
        //                             Loading...
        //                         </div>
        //                     )}
        //                     {
        //                         !isLoadingResults && filteredResults?.length == 0 && (
        //                             <div className="text-gray-600 flex items-center p-3 w-[200px]">
        //                                 No matching results
        //                             </div>
        //                         )
        //                     }
        //                     {filteredResults?.map((group, groupIndex) => (
        //                         <div
        //                             key={`group-${groupIndex}`}
        //                             className="w-full"
        //                         >
        //                             <span className="text-gray-400 text-[12px] px-3">
        //                                 {getPathname(group.url)}:
        //                             </span>
        //                             <ul>
        //                                 {group.items.map((item, itemIndex) => (
        //                                     <li
        //                                         className={`${
        //                                             itemIndex == 0
        //                                                 ? "border-t border-slate-300 pt-1"
        //                                                 : "py-3"
        //                                         } truncate px-3 hover:text-goldd hover:font-semibold hover:cursor-pointer`}
        //                                         {...getItemProps({
        //                                             item: item, // Pass the item here
        //                                             index: itemIndex,
        //                                         })}
        //                                         onClick={() => {
        //                                             navigateToSelector(
        //                                                 item.selector,
        //                                                 group.url
        //                                             );
        //                                         }}
        //                                         key={item.selector + itemIndex}
        //                                     >
        //                                         {item.label}
        //                                     </li>
        //                                 ))}
        //                             </ul>
        //                         </div>
        //                     ))}
        //                 </ul>
        //             )}
        //         </div>
        //     )}
        // </Downshift>
        <div className="relative flex items-center justify-between w-full max-h-[40px] focus:outline-none">
            {indices?.length > 0 && (
                <InstantSearch searchClient={searchClient} indices={[
                    {indexName:
                        "aboutuses",
                        fields: [
                            { name: "body", type: "auto" },
                        ],
                    }
                ]}>
                    <SearchBox
                        onChange={handleSearchChange}
                        value={searchQuery}
                        translations={{ placeholder: 'Search...' }}
                        searchAsYouType
                        showLoadingIndicator
                    />
                    {indices.map((index) => (
                        <Hits
                            key={index.name}
                            hitComponent={Hit}
                            indexName={index.name}
                        />
                    ))}
                </InstantSearch>
            )}
        </div>
    );
}
