import NewsCard from "@/Components/News/NewsCard";
import React from "react";
import SearchCard from "../SearchCard/SearchCard";
function SearchLatest({ getLatestBlogs }) {
    return (
        <div>
            {" "}
            <div className="border-b-2 border-goldt text-goldt w-fit mb-4 ">
                Latest News
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full justify-center gap-4">
                {getLatestBlogs.map((blog, index) => (
                    <SearchCard key={index} blog={blog} post={blog} />
                ))}
            </div>
        </div>
    );
}

export default SearchLatest;
