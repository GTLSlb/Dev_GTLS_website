import React from "react";
import { BounceLoader } from "react-spinners";

function LoadingComp() {
    return (
        <div className="bg-dark flex justify-center items-center h-screen">
            {" "}
            <BounceLoader color="#e2b540" />
        </div>
    );
}

export default LoadingComp;
