import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

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
        <div className="hubspot-form-wrapper w-full">
            <div className="flex w-full flex-col">
                <Tabs
                    aria-label="Options"
                    classNames={{
                        tabList:
                            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                        cursor: "w-full bg-white",
                        tab: "max-w-fit px-0 h-12",
                        tabContent:
                            "text-xl group-data-[selected=true]:text-goldt group-data-[selected=true]:border-b-2 group-data-[selected=true]:border-goldt pb-2",
                    }}
                    color="primary"
                    variant="underlined"
                >
                    <Tab
                        key="sales"
                        title="Sales Inquiry"
                        className="text-white"
                    >
                        <div
                            className="hs-form-frame w-full"
                            data-region="ap1"
                            data-portal-id="441740132"
                            data-form-id="825dd6df-6a62-4da6-be38-f15be454bb17"
                        ></div>
                    </Tab>
                    <Tab
                        key="general"
                        title="General Inquiry"
                        className="text-white"
                    >
                        <div
                            className="hs-form-frame w-full bg-white"
                            data-region="ap1"
                            data-portal-id="441740132"
                            data-form-id="b1c96eb3-3310-4a1b-8a1b-680a2e82207c"
                        ></div>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
};

export default ContactUsHubspot;
