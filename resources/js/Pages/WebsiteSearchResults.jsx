import { getFromStrapi } from "@/CommonFunctions";
import SearchLatest from "@/Components/SearchComponent/SearchResults/SearchLatest";
import SearchLoading from "@/Components/SearchComponent/SearchResults/SearchLoading";
import { handleSearchChange } from "@/Components/utils/SearchUtils";
import MainLayout from "@/Layouts/MainLayout";
import { Head, usePage } from "@inertiajs/react";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, Input } from "@nextui-org/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import BlogResult from "../Components/SearchComponent/SearchCard/BlogResult";

function WebsiteSearchResults({}) {
    const { query } = usePage().props;

    const [content, setContent] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [indices, setIndices] = useState([]);
    const [searching, setSearching] = useState(true);
    const [isSearchDone, setIsSearchDone] = useState(false);
    const [loading, setLoading] = useState(true);
    const [latestBlogs, setLatestBlogs] = useState([]);

    const fetchAllIndices = async () => {
        await axios
            .get("https://test-web.gtls.store/searchIndices")
            .then((res) => {
                setIndices(res.data[0].items);
            })
            .catch((err) => {
                console.log("err", err);
            });
    };

    const handleValueChange = useCallback(
        debounce((e) => {
            setSearching((prev) => !prev);
            setSearchQuery(e.target.value);
        }, 500),
        []
    );

    useEffect(() => {
        fetchAllIndices().then(() => {
            if (query) {
                setSearchQuery(query);
                setSearching(true);
            }
        });
    }, []);

    useEffect(() => {
        if (searching && searchQuery.length > 0) {
            handleSearchChange(
                searchQuery,
                setContent,
                setErrorMsg,
                indices,
                setSearching,
                setIsSearchDone
            ); // Set searching to false after completion
        } else {
            setSearching(false);
        }
    }, [searching, searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const latestBlogs = await getFromStrapi(
                    `/api/blogs?sort=DatePublished:desc&pagination[withCount]=true&pagination[limit]=6&fields=Title,Slug,Body,DatePublished&populate=CoverImage`
                );
                if (latestBlogs.success) {
                    setLatestBlogs(latestBlogs.data);
                }
                setLoading(false);
                // scroll to the correct div
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
            }
        };

        fetchData();
    }, []);

    return (
        <MainLayout loading={loading}>
            <Head title={searchQuery + " Results"} />
            <div className="mt-4 py-6 bg-dark pt-24 flex justify-center">
                <div className=" mx-auto max-w-7xl ">
                    <div className="">
                        <Input
                            placeholder="Search..."
                            variant="bordered"
                            aria-label="Search website content"
                            startContent={
                                <SearchIcon style={{ color: "white" }} />
                            }
                            size="lg"
                            className="py-2 rounded-md sm:w-1/2 md:w-1/3 px-4 "
                            isClearable={true}
                            value={searchQuery}
                            classNames={{
                                input: "border-0 focus:ring-0 focus:shadow-none !text-white placeholder:text-white",
                                inputWrapper:
                                    "!border-1 focus:ring-0 focus:shadow-none after:!border-[#ffffff] after:!bg-[#ffffff] after:transition-colors after:duration-300 ",
                                clearButton:
                                    "text-[#ffffff] hover:text-[#ffffff]",
                            }}
                            onValueChange={setSearchQuery}
                            onChange={(e) => {
                                setIsSearchDone(false);
                                handleValueChange(e);
                            }}
                            onClear={(e) => {
                                setSearching(false);
                                setSearchQuery("");
                                setContent([]);
                            }}
                        />

                        <Divider className="bg-white mt-5" />
                        <p className="text-xs text-white mt-2 px-4">
                            {content ? content.length : 0} results found
                        </p>
                    </div>

                    {searching ? (
                        <div className="h-full min-h-screen w-full flex justify-center items-center">
                            <SearchLoading />
                        </div>
                    ) : (
                        <div className=" text-white flex flex-col gap-5 mt-10 mb-10 px-4 ">
                            {content.length > 0 ? (
                                content.map((result, index) => (
                                    <div key={index} className="">
                                        <BlogResult result={result} />
                                        <Divider className="bg-gray-400 mt-5" />
                                    </div>
                                ))
                            ) : (
                                <div className="min-h-screen">
                                    <SearchLatest
                                        getLatestBlogs={latestBlogs}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default WebsiteSearchResults;
