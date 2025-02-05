import React from "react";
import SearchLatest from "./SearchLatest";
import SearchList from "./SearchList";

function SearchContent({ content }) {
    return (
        <div>
            {content.length > 0 || content != "" ? (
                <SearchList />
            ) : (
                <SearchLatest />
            )}
        </div>
    );
}

export default SearchContent;
