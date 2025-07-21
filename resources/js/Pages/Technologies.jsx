import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { getFromStrapi } from "@/CommonFunctions";
import BounceLoader from "react-spinners/BounceLoader";


export default function Technology() {
    const [getTechnology, setTechnology] = useState([]);
    const [loading, setLoading] = useState(true); // Add this state to manage loading state

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const technoloyReq = await getFromStrapi(
                    `/api/technology?pLevel=4`
                );

                if (technoloyReq.success) {
                    setTechnology(technoloyReq.data);
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
                <>
                    {" "}
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                </>
            ) : (
                <MainLayout loading={loading}>
                    <Head title="Technology" />
                    <div className="relative isolate bg-dark">
                        <div aria-hidden="true" className="relative">
                            <img
                                src={
                                    strapiApiUrl + getTechnology?.CoverImage.url
                                }
                                alt={getTechnology?.image_alt}
                                className="h-96 w-full object-cover object-center "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                        </div>
                        <div className="relative isolate overflow-hidden  py-16 sm:py-16">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="relative lg:order-last lg:col-span-5">
                                    <div
                                        className="mt-3"
                                        dangerouslySetInnerHTML={{
                                            __html: getTechnology?.Body,
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
