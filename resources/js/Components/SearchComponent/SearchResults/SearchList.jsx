import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import SearchHit from "@/Pages/Component/SearchHit";

function SearchList({searchQuery, errorMsg, content, setSearching}) {
    console.log("results", content);
    return (
        <div className="mt-8">
            <div className="text-sm text-gray-400 mb-4">
                Suggested Search List
            </div>
            {content?.length > 0 &&
                content.map((hit, index) => (
                    <SearchHit
                        hit={hit}
                        key={index}
                        searchQuery={searchQuery}
                        setIsOpen={setSearching}
                    />
                ))}
        </div>
    );
}

export default SearchList;
