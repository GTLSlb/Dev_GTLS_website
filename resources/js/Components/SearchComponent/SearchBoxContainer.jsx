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
            navigateAfterRedirect(setSearching)
        }
    }, []);

    useEffect(() => {
        if (components?.length > 0 && indices?.length > 0) {
            addCollections();
        }
    }, [components, indices]);


    // Effect to set content 500ms after searching is updated
    useEffect(() => {
        if (searching) {
            const timer = setTimeout(() => {
                setSearching(false);
            }, 500);
            handleSearchChange(searchQuery, setContent, setErrorMsg, indices);
            return () => clearTimeout(timer); // Cleanup timeout on re-render
        }
    }, [searching]);

    return (
        <div
            className={`w-auto flex justify-center py-5 bg-dark text-white h-[30rem] border-b-goldt border-b-1 absolute overflow-auto inset-0 transition-opacity duration-300 ${
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
                        input: "border-0 focus:ring-0 focus:shadow-none !text-white",
                        inputWrapper:
                            "!border-0 focus:ring-0 focus:shadow-none after:!bg-[#ffffff] after:transition-colors after:duration-300 ",
                        clearButton: "text-[#ffffff] hover:text-[#ffffff]",
                    }}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleValueChange();
                    }}
                    onClear={(e) => {
                        setSearching(false);
                        setContent([]);
                    }}
                />
                <div className="">
                    {searching ? (
                        <SearchLoading />
                    ) : (
                        <SearchContent
                            content={content}
                            getLatestBlogs={getLatestBlogs}
                        searchQuery={searchQuery} errorMsg={errorMsg} setSearching={setSearching}/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBoxContainer;
