import React from "react";
import SearchIcon from "@mui/icons-material/Search";

function SearchButton({ toggleSearch }) {
    return (
        <button onClick={toggleSearch}>
            <SearchIcon height={20} width={20} />
            <span className="ml-2">Search</span>
        </button>
    );
}

export default SearchButton;
