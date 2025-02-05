import React from "react";
import SearchCard from "../SearchCard/SearchCard";
function SearchLatest({ getLatestBlogs }) {

    return (
        <div>
            {" "}
            <div className="border-b-2 border-goldt text-goldt w-fit mb-4 ">
                Latest News
            </div>
            <div className="flex w-full justify-center gap-4">
                {getLatestBlogs.map((blog) => (
                    <SearchCard blog={blog} />
                ))}
            </div>
        </div>
    );
}

export default SearchLatest;
