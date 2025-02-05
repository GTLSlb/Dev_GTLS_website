import React from "react";
import SearchLatest from "./SearchLatest";
import SearchList from "./SearchList";

function SearchContent({ content, searchQuery, errorMsg, setSearching }) {
    return (
        <div>
            {content.length > 0 || content != "" ? (
                <SearchList searchQuery={searchQuery} errorMsg={errorMsg} content={content} setSearching={setSearching} />
            ) : (
                <SearchLatest />
            )}
        </div>
    );
}

export default SearchContent;
