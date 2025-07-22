import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import LoadingComp from "@/Components/LoadingComp";
import MainLayout from "@/Layouts/MainLayout";
import { getFromStrapi } from "@/CommonFunctions";

export default function AboutUs() {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const [getSafetyCompliance, setSafetyCompliance] = useState([]);
    const [loading, setLoading] = useState(true);
    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const safetyComplianceReq = await getFromStrapi(
                    `/api/safety-compliance?pLevel=4`
                );

                if (safetyComplianceReq.success) {
                    setSafetyCompliance(safetyComplianceReq.data);
                }
                // Set loading to false when all requests are completed
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
                setLoading(false); // Set loading to false if there's an error
            }
        };

        fetchData();
    }, []);
    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************

    return (
        <>
            {loading ? (
                <LoadingComp />
            ) : (
                <MainLayout loading={loading}>
                    <Head title="Safety and compliance" />
                    <div className="relative isolate bg-dark">
                        <div aria-hidden="true" className="relative">
                            <img
                                src={
                                    strapiApiUrl +
                                    getSafetyCompliance.HeroSection.url
                                }
                                alt="jobs"
                                className="h-96 w-full object-cover object-center "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                        </div>
                        <div className="relative mx-auto -mt-12 max-w-7xl px-8 mb-5">
                            <div className="text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                    {getSafetyCompliance.Title}
                                </h1>
                            </div>
                        </div>
                        <div className="relative isolate overflow-hidden">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="mx-auto text-smooth">
                                    <div
                                        className=""
                                        dangerouslySetInnerHTML={{
                                            __html: getSafetyCompliance.Body,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </MainLayout>
            )}
        </>
    );
}
