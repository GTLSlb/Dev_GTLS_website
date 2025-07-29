import React, { useEffect, useState } from "react";

const ContactUsHubspot = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHubspotScript = () => {
            const scriptId = "hubspot-embed-script";
            if (!document.getElementById(scriptId)) {
                const script = document.createElement("script");
                script.src =
                    "https://js-ap1.hsforms.net/forms/embed/441740132.js";
                script.charset = "utf-8";
                script.type = "text/javascript";
                script.async = true;
                script.id = scriptId;
                script.onload = () => {
                    console.log("HubSpot embed script loaded!");
                    setLoading(false);
                };
                script.onerror = (e) => {
                    console.error("Failed to load HubSpot embed script:", e);
                    setLoading(false);
                };

                document.body.appendChild(script);
            } else {
                setLoading(false);
            }
        };

        loadHubspotScript();
        return () => {};
    }, []);
    if (loading) {
        return (
            <div className="text-white flex lg:flex-row gap-4 lg:max-w-7xl mx-auto mt-10 min-h-[500px] items-center justify-center">
                <p>Loading contact forms...</p>
            </div>
        );
    }

    return (
        <div className="hubspot-form-wrapper flex lg:flex-row gap-4 lg:max-w-7xl mx-auto mt-10">
            <div
                className="hs-form-frame w-full"
                data-region="ap1"
                data-portal-id="441740132"
                data-form-id="825dd6df-6a62-4da6-be38-f15be454bb17"
            ></div>

            <div
                className="hs-form-frame w-full"
                data-region="ap1"
                data-portal-id="441740132"
                data-form-id="2f944b6d-0828-4181-96a6-43a3cd7d4ac9"
            ></div>
        </div>
    );
};

export default ContactUsHubspot;
