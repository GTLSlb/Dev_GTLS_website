import SearchHit from "@/Pages/Component/SearchHit";

function SearchList({ searchQuery, errorMsg, content, setSearching, searching }) {
    return (
        <div className="mt-4">
            <div className="text-sm text-gray-400 mb-4">
                Suggested Search List
            </div>
            {content?.length > 0 && !searching ? (
                content.map((hit, index) => (
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
