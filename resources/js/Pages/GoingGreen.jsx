import { Head } from "@inertiajs/react";
import Calc from "./Component/landingPage/Calc";

import "../../css/gradient.css";
import React, { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { getFromStrapi } from "@/CommonFunctions";
import { BounceLoader } from "react-spinners";

export default function GoingGreen() {
    const [getGreen, setGreen] = useState([]);
    const [loading, setLoading] = useState(true); // Add this state to manage loading state
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const goingGreenReq = await getFromStrapi(
                    `/api/going-green?pLevel=4`
                );

                if (goingGreenReq.success) {
                    setGreen(goingGreenReq.data);
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
                <div className="bg-dark flex justify-center items-center h-screen">
                    {" "}
                    <BounceLoader color="#e2b540" />
                </div>
            ) : (
                <>
                    <MainLayout loading={loading}>
                        <Head title="Going Green" />
                        <div className="relative isolate min-h-screen bg-dark">
                            <div className=" py-28 text-smooth ">
                                <div className="bg-gg bg-cover">
                                    <div className="mx-auto max-w-7xl  px-6 lg:px-8  flex flex-col md:flex-row gap-x-10 gap-y-10 py-20 items-center">
                                        <div className="md:w-6/12">
                                            <h1 className="gradient-text py-5 text-4xl font-bold">
                                                {getGreen?.Title}
                                                {/* GTLS Towards a Green  Future */}
                                            </h1>
                                            <div
                                                className="mt-3 text-smooth"
                                                dangerouslySetInnerHTML={{
                                                    __html: getGreen?.Description,
                                                }}
                                            ></div>

                                            <Calc />
                                        </div>
                                        <div className="w-full md:w-1/2 ">
                                            <img
                                                src={
                                                    strapiApiUrl +
                                                    getGreen?.Image.url
                                                }
                                                alt={getGreen?.Image.alternativeText}
                                                className=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                    <div
                                        className="mt-2 text-smooth"
                                        dangerouslySetInnerHTML={{
                                            __html: getGreen.Body,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
