import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
function SearchList() {
    return (
        <div className="mt-8">
            <div className="text-sm text-gray-400 mb-4">
                Suggested Search List
            </div>
            {[
                "Search List 1",
                "Search List 2",
                "Search List 3",
                "Search List 4",
                "Search List 5",
            ].map((item, index) => (
                <div key={index} className="py-1">
                    <ArrowRightAltIcon height={20} width={20}/> {item}
                </div>
            ))}
        </div>
    );
}

export default SearchList;
