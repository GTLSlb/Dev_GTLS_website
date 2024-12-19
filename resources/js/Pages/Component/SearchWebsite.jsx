import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Downshift from "downshift";

export default function SearchWebsite() {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const suggestionsRef = useRef(null);

    const getPathname = (url) => {
        const parsedUrl = new URL(url);
        if(parsedUrl.pathname == '/'){
            return url;
        }else{
            return parsedUrl.pathname;
        }
    }
    const handleClickOutside = (event) => {
        // Check if the click is outside the dropdown
        if (
            suggestionsRef.current &&
            !suggestionsRef.current.contains(event.target)
        ) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        // Attach event listeners to document
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("scroll", handleClickOutside);

        // Cleanup listeners on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleClickOutside);
        };
    }, []);

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

    const fetchOptions = async (inputValue) => {
        if (!inputValue) {
            return []; // Return empty array if not triggered or no input
        }
        setSearchResults([]);
        setIsLoadingResults(true); // Set loading state
        setIsOpen(true);
        try {
            const response = await axios.get("/search", {
                headers: {
                    searchKeyword: inputValue,
                },
            });

            // Map response data to match expected structure for AsyncSelect
            setIsOpen(true);
            setSearchResults(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching search results:", error);
            return []; // Return empty array on error
        } finally {
            setIsLoadingResults(false);
            setIsOpen(true);
        }
    };
    return (
        <Downshift
            onInputValueChange={(e) => setQuery(e)}
            isOpen={isOpen}
            itemToString={(item) => (item ? item.label : "")}
        >
            {({ getInputProps, getMenuProps, getItemProps }) => (
                <div>
                    <div className="relative flex items-center justify-between w-full max-h-[40px] focus:outline-none">
                        <input
                            {...getInputProps({
                                onKeyDown: (event) => {
                                    if (event.key === "Enter") {
                                        // Handle Enter key press
                                        setQuery(event.target.value);
                                        fetchOptions(event.target.value);
                                        event.preventDefault(); // Prevent form submission if in a form
                                    }
                                },
                            })}
                            placeholder="Search..."
                            className="focus:outline-none bg-[#edce80] sm:bg-[#ebcb7a] md:bg-[#e7c160] rounded-md w-full text-gray-700 placeholder-gray-600"
                        />
                        {isLoadingResults ? (
                            <div className="text-gray-600">
                                <CircularProgress size={12} color="inherit" />
                            </div>
                        ) : (
                            <SearchIcon
                                className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                                onClick={() => fetchOptions(query)}
                            />
                        )}
                    </div>
                    {isOpen && (
                        <ul
                            className="absolute max-w-[230px] z-[100] text-sm bg-gray-200 border border-gray-200 text-gray-700 max-h-[250px] mt-1 rounded-md overflow-auto"
                            {...getMenuProps()}
                            ref={suggestionsRef}
                        >
                            {isLoadingResults && (
                                <div className="text-gray-600 flex items-center p-3 w-[200px]">
                                    Loading...
                                </div>
                            )}
                            {
                                !isLoadingResults && searchResults?.length == 0 && (
                                    <div className="text-gray-600 flex items-center p-3 w-[200px]">
                                        No matching results
                                    </div>
                                )
                            }
                            {searchResults?.map((group, groupIndex) => (
                                <div
                                    key={`group-${groupIndex}`}
                                    className="w-full"
                                >
                                    <span className="text-gray-400 text-[12px] px-3">
                                        {getPathname(group.url)}:
                                    </span>
                                    <ul>
                                        {group.items.map((item, itemIndex) => (
                                            <li
                                                className={`${
                                                    itemIndex == 0
                                                        ? "border-t border-slate-300 pt-1"
                                                        : "py-3"
                                                } truncate px-3 hover:text-goldd hover:font-semibold hover:cursor-pointer`}
                                                {...getItemProps({
                                                    item: item, // Pass the item here
                                                    index: itemIndex,
                                                })}
                                                onClick={() => {
                                                    navigateToSelector(
                                                        item.selector,
                                                        group.url
                                                    );
                                                }}
                                                key={item.selector + itemIndex}
                                            >
                                                {item.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </Downshift>
    );
}
