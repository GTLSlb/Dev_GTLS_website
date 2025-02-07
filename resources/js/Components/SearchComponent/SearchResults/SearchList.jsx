import SearchHit from "@/Pages/Component/SearchHit";

function SearchList({ searchQuery, errorMsg, content, setSearching, searching, isSearchDone }) {
    const handleRedirect = () => {
        setSearching(false);
        const searchQuery = 'example';
        const state = { content: content, searchQuery: searchQuery };

        localStorage.setItem("searchState", JSON.stringify(state));
        window.location.href = `/searchResults`;
    }

    return (
        <div className="mt-4">
            <div className="text-sm text-gray-400 mb-4">
                Suggested Search List
            </div>
            <button onClick={()=>handleRedirect()} className="text-sm text-gray-400 mb-4">
                Showing {content?.length < 6 ? content?.length : 6 } out of {content?.length} results, see all results for "{searchQuery}"
            </button>
            {content?.length > 0 && !searching && searchQuery != "" && isSearchDone ? (
                content?.slice(0, 6)?.map((hit, index) => (
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
