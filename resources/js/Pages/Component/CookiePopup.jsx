import React, { useState } from "react";
import Cookies from "js-cookie";

const CookiePopup = () => {
    const [showPopup, setShowPopup] = useState(
        !Cookies.get("cookiePermission")
    );

    const handleAccept = () => {
        Cookies.set("cookiePermission", "true", { expires: 365 });
        setShowPopup(false);
    };
    const handleCancel = () => {
        // Cookies.set('cookiePermission', 'false', { expires: 365 });
        setShowPopup(false);
    };

    return (
        showPopup && (
            <div className="z-50 cookie-popup bg-dark rounded-xl p-5 center button-0 border border-goldt text-white">
                <p className="pb-5">
                    When you visit any website, it may store or retrieve
                    information on your browser. This information might be about
                    you, your preferences or your device and is mostly used to
                    make the site work as you expect it to. The information does
                    not usually directly identify you, but it can give you a
                    more personalized web experience.
                </p>
                {/* <button onClick={handleAccept}>Accept</button> */}
                <div className="grid grid-cols-2 gap-4 ">
                    <button
                        onClick={handleCancel}
                        className="  rounded-md bg- px-3 py-2 text-sm font-semibold text-white  hover:text-black shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAccept}
                        className="rounded-md bg-goldd px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                    >
                        Accept
                    </button>
                </div>
            </div>
        )
    );
};

export default CookiePopup;
