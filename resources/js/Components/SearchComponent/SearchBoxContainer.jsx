import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@nextui-org/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import SearchLoading from "./SearchResults/SearchLoading";
import SearchContent from "./SearchResults/SearchContent";
import {
    addSearchIndex,
    addSearchParameters,
    handleSearchChange,
    navigateAfterRedirect,
} from "@/Components/utils/SearchUtils";
import "../../../css/scroll.css";
function SearchBoxContainer({ isSearchActive, getLatestBlogs }) {
    const [searching, setSearching] = useState(false);
    const [content, setContent] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [indices, setIndices] = useState([]);
    const [components, setComponents] = useState([]);

    const handleValueChange = useCallback(
        debounce(() => {
            setSearching((prev) => !prev);
        }, 500),
        []
    );

    const fetchAllIndices = async () => {
        await axios
            .get("/searchIndices")
            .then((res) => {
              setIndices(res.data[0].items);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    useEffect(() => {
        // fetchAllComponents();
        fetchAllIndices()
        if (localStorage.getItem("selector") != null) {
            navigateAfterRedirect(setSearching);
        }
    }, []);

    // Effect to set content 500ms after searching is updated
    useEffect(() => {
        if (searching && searchQuery.length > 0) {
            handleSearchChange(
                searchQuery,
                setContent,
                setErrorMsg,
                indices,
                setSearching
            ); // Set searching to false after completion
        } else {
            setSearching(false);
        }
    }, [searching, searchQuery]);

    return (
        <div
            className={`w-auto flex justify-center py-5 bg-dark text-white h-[30rem] containerscroll border-b-goldt border-b-1 absolute overflow-auto inset-0 transition-opacity duration-300 ${
                isSearchActive ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div className="w-1/2 ">
                <Input
                    placeholder="Search..."
                    variant="underlined"
                    startContent={<SearchIcon />}
                    className="w-full py-2 rounded-md "
                    isClearable={true}
                    classNames={{
                        input: "border-0 focus:ring-0 focus:shadow-none !text-white placeholder:text-white",
                        inputWrapper:
                            "!border-0 focus:ring-0 focus:shadow-none after:!bg-[#ffffff] after:transition-colors after:duration-300 ",
                        clearButton: "text-[#ffffff] hover:text-[#ffffff]",
                    }}
                    onChange={(e) => {
                        setSearching(true);
                        setSearchQuery(e.target.value);
                        handleValueChange();
                    }}
                    onClear={(e) => {
                        setSearching(false);
                        setSearchQuery("");
                        setContent([]);
                    }}
                />

                <div className="h-full w-full">
                    {searching ? (
                        <div className="h-full w-full flex justify-center items-center"><SearchLoading /></div>
                    ) : (
                        <SearchContent
                            content={content}
                            getLatestBlogs={getLatestBlogs}
                            searchQuery={searchQuery}
                            errorMsg={errorMsg}
                            searching={searching}
                            setSearching={setSearching}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBoxContainer;
