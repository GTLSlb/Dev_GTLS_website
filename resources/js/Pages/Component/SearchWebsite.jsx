import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Downshift from "downshift";
import Typesense from "typesense";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { Hits, InstantSearch, SearchBox } from "react-instantsearch-dom";
import data from "@/testDataset";
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
            query_by: "data, description, title, body",
        },
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
    const [indices, setIndices] = useState([]);

    const addSearchIndex = (item) => {
        if (typeof item.data == "string") {
            return {
                name: item.tableName,
                title: item.tableName,
                searchParameters: {
                    query_by: "data",
                },
            };
        } else {
            if (item.tableName == "branches") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "branch_name",
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
                    },
                };
            } else if (item.tableName == "positions") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "position_details, position_title",
                    },
                };
            } else if (item.tableName == "services") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "description, title",
                    },
                };
            } else if (item.tableName == "socials") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "name, url",
                    },
                };
            } else if (item.tableName == "team_members") {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "member_name",
                    },
                };
            } else {
                return {
                    name: item.tableName,
                    title: item.tableName,
                    searchParameters: {
                        query_by: "body",
                    },
                };
            }
        }
    };

    const addSearchParameters = (item) => {
        const config = {
            query_by: "", // Default value
            highlight_full_fields: "", // Set this to a valid value if needed
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
    const addDocuments = async (obj) => {
        try {
            // Step 1: Retrieve existing documents
            const col = await client.collections(obj.tableName);
            const existingDocuments = new Set(obj.data.map(doc =>  col.documents(doc.documentId)));

            const updatedData = obj.data.map(item => {
                const exists = existingDocuments.has(item.id); // Check if the ID exists
console.log('exists', col.documents('100'));
                return {
                    ...item, // Spread the original item properties
                    id: exists ? item.id : null, // Add 'id' field if exists, otherwise null
                    document: exists ? documents.find(doc => doc.documentId === item.id) : null // Add the corresponding document if exists
                };
            });

            // Step 2: Filter new documents to find those that don't exist
            const newDocuments = obj.data.filter(
                (doc) => !updatedData.find((d) => d.id == doc.id)
            );

            // Step 3: Add new documents
            if (newDocuments.length > 0) {
                await Promise.all(
                    newDocuments.map((doc) =>
                        client
                            .collections(obj.tableName)
                            .documents()
                            .create(doc)
                    )
                );
                // console.log('New documents added successfully');
            } else {
                // console.log('No new documents to add');
            }
        } catch (error) {
            console.error("Error adding documents:", error);
        }
    };

    const createCollection = async () => {
        try {
            components?.map(async (comp) => {
                // Check if the collection exists
                const existingCollections = await client
                    .collections(comp.tableName)
                    .retrieve();
                const collectionExists = existingCollections.name == comp?.tableName;
                // Create the collection if it doesn't exist
                if (!collectionExists) {
                    await client.collections().create(comp.schema);
                    // console.log('Collection created successfully');
                } else {
                    // console.log('Collection already exists');
                }

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
            {indices && (
                <InstantSearch searchClient={searchClient} indices={indices}>
                    <SearchBox />
                    {indices.map((index) => {
                    console.log('index', index);
                    return(
                        <Hits
                            key={index.name}
                            hitComponent={Hit}
                            indexName={index.name}
                        />
                    )})}
                </InstantSearch>
            )}
        </div>
    );
}
