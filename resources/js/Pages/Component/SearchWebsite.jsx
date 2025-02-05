import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import SearchPopup from "./SearchPopup";
import {
    addSearchIndex,
    addSearchParameters,
} from "@/Components/utils/SearchUtils";
import { navigateAfterRedirect } from "@/Components/utils/SearchUtils";

export default function SearchWebsite() {
    const [errMsg, setError] = useState("");
    const [indices, setIndices] = useState([]);
    const [results, setResults] = useState([]);
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const handleSearchButtonClick = () => {
        setShowSearch(!showSearch);
    };
    const handlePopUpClose = () => {
        setShowSearch(false);
    };

    const handleClearInput = () => {
        setResults([]);
        setSearchQuery("");
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
                setIndices(items);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };
    const addCollections = async () => {
        const formData = {
            collections: components,
        };
        axios
            .post("/addCollections", formData)
            .then((res) => {})
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchAllComponents();
        if(localStorage.getItem("selector") != null){
            navigateAfterRedirect(setShowSearch)
        }
    }, []);

    useEffect(() => {
        if (components?.length > 0 && indices?.length > 0) {
            addCollections();
        }
    }, [components, indices]);

    return (
        <div className="fixed right-0 top-[22%] z-50">
            <button
                className="flex items-center justify-center bg-goldd text-black p-2 py-6 rounded font-bold"
                onClick={handleSearchButtonClick}
            >
                <SearchIcon />
            </button>
            {showSearch && (
                <SearchPopup
                    errMsg={errMsg}
                    setResults={setResults}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setSearchQuery={setSearchQuery}
                    handleClearInput={handleClearInput}
                    results={results}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    handlePopUpClose={handlePopUpClose}
                    isOpen={showSearch}
                    indices={indices}
                    setIsOpen={setShowSearch}
                />
            )}
        </div>
    );
}
