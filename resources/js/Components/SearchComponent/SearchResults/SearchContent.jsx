import React from "react";
import SearchLatest from "./SearchLatest";
import SearchList from "./SearchList";

function SearchContent({
    content,
    getLatestBlogs,
    searchQuery,
    errorMsg,
    setSearching,
    searching,
}) {
    return (
        <div>
            {searchQuery.length > 0 || searchQuery != "" ? (
                <SearchList
                    searching={searching}
                    searchQuery={searchQuery}
                    errorMsg={errorMsg}
                    content={content}
                    setSearching={setSearching}
                />
            ) : (
                <SearchLatest getLatestBlogs={getLatestBlogs} />
            )}
        </div>
    );
}

export default SearchContent;
