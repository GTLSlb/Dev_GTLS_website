import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { Input, Divider } from "@nextui-org/react";
import SearchIcon from "@mui/icons-material/Search";
import BlogResult from "./Component/SearchPageComp/BlogResult";
import SearchResult from "./Component/SearchPageComp/SearchResult";
import { useCallback, useEffect, useState } from "react";
import { handleSearchChange } from "@/Components/utils/SearchUtils";
import { debounce } from "lodash";

function WebsiteSearchResults({}) {
    const storedContent = JSON.parse(localStorage.getItem("searchState"));

    const [content, setContent] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [indices, setIndices] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleValueChange = useCallback(
        debounce(() => {
            setSearching((prev) => !prev);
        }, 500),
        []
    );

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
        <MainLayout>
            <Head title="About Gold Tiger" />
            <div className="mt-4 py-6 bg-dark pt-24 flex justify-center">
                <div className=" container">
                    <div className="">
                        <Input
                            placeholder="Search..."
                            variant="bordered"
                            startContent={
                                <SearchIcon style={{ color: "white" }} />
                            }
                            size="lg"
                            className="py-2 rounded-md w-1/3"
                            isClearable={true}
                            classNames={{
                                input: "border-0 focus:ring-0 focus:shadow-none !text-white placeholder:text-white",
                                inputWrapper:
                                    "!border-1 focus:ring-0 focus:shadow-none after:!border-[#ffffff] after:!bg-[#ffffff] after:transition-colors after:duration-300 ",
                                clearButton:
                                    "text-[#ffffff] hover:text-[#ffffff]",
                            }}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleValueChange();
                            }}
                            onClear={(e) => {
                                setSearching(false);
                                setSearchQuery("");
                                setContent([]);
                            }}
                        />

                        <Divider className="bg-white mt-5" />
                        <p className="text-xs text-white mt-2">
                            400 results found
                        </p>
                    </div>

                    <div className=" text-white flex flex-col gap-5 mt-10 mb-10 pr-4">
                        <BlogResult />
                        <Divider className="bg-gray-400" />
                        <BlogResult />
                        <Divider className="bg-gray-400" />
                        <BlogResult />
                        <Divider className="bg-gray-400" />
                        <SearchResult />
                        <Divider className="bg-gray-400" />
                        <SearchResult />
                        <Divider className="bg-gray-400" />
                        <SearchResult />
                        <Divider className="bg-gray-400" />
                        <SearchResult />
                        <Divider className="bg-gray-400" />
                        <SearchResult />
                        <Divider className="bg-gray-400" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default WebsiteSearchResults;
