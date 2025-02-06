import React from "react";
import {Spinner} from "@nextui-org/react";

function SearchLoading() {
    return (
        <div className="h-full flex justify-center items-center">
            <Spinner size="md" color="warning"/>
        </div>
    );
}

export default SearchLoading;
