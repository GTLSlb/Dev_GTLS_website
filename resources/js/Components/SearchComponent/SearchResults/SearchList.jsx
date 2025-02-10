import SearchHit from "@/Pages/Component/SearchHit";
import { Link } from "@inertiajs/react";

function SearchList({
    searchQuery,
    errorMsg,
    content,
    setSearching,
    searching,
    isSearchDone,
}) {
    return (
        <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">
                Suggested Search List
            </div>
            <Link href={route("searchResults", { q: "truck" })}>
                <button className="text-sm text-gray-400 mb-4">
                    Showing {content?.length < 6 ? content?.length : 6} out of{" "}
                    {content?.length} results, see all results for "
                    {searchQuery}"
                </button>
            </Link>

            {content?.length > 0 &&
            !searching &&
            searchQuery != "" &&
            isSearchDone ? (
                content
                    ?.slice(0, 6)
                    ?.map((hit, index) => (
                        <SearchHit
                            hit={hit}
                            key={index}
                            searchQuery={searchQuery}
                            setIsOpen={setSearching}
                        />
                    ))
            ) : (
                <div className="text-sm text-gray-200"> Nothing Found</div>
            )}
        </div>
    );
}

export default SearchList;
