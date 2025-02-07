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
    isSearchDone,
}) {
    return (
        <div>
            { searchQuery != "" ? (
                <SearchList
                    searching={searching}
                    searchQuery={searchQuery}
                    errorMsg={errorMsg}
                    content={content}
                    setSearching={setSearching}
                    isSearchDone={isSearchDone}
                />
            ) : (
                <SearchLatest getLatestBlogs={getLatestBlogs} />
            )}
        </div>
    );
}

export default SearchContent;
