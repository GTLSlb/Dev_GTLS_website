import SearchIcon from "@mui/icons-material/Search";
import { Input } from "@nextui-org/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import SearchLoading from "./SearchResults/SearchLoading";
import SearchContent from "./SearchResults/SearchContent";

function SearchBoxContainer({ isSearchActive }) {
    const [searching, setSearching] = useState(false);
    const [content, setContent] = useState([]);
    const handleValueChange = useCallback(
        debounce(() => {
            setSearching((prev) => !prev);
        }, 500),
        []
    );

    // Effect to set content 500ms after searching is updated
    useEffect(() => {
        if (searching) {
            const timer = setTimeout(() => {
                setContent("Search started...");
                setSearching(false);
            }, 500);

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
                        <SearchContent content={content} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBoxContainer;
