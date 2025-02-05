import React from "react";
import SearchLatest from "./SearchLatest";
import SearchList from "./SearchList";

function SearchContent({ content, getLatestBlogs }) {
    return (
        <div>
            {content.length > 0 || content != "" ? (
                <SearchList />
            ) : (
                <SearchLatest getLatestBlogs={getLatestBlogs} />
            )}
        </div>
    );
}

export default SearchContent;
