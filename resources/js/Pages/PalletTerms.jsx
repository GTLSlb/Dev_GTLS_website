import { getFromStrapi } from "@/CommonFunctions";
import LoadingComp from "@/Components/LoadingComp";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";


export default function PalletTerms(props) {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const [getPalletTerm, setPalletTerm] = useState([]);
    const [loading, setLoading] = useState(true);
    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const termReq = await getFromStrapi(
                    `/api/pallet-term?pLevel=4`
                );

                if (termReq.success) {
                    console.log(termReq.data);
                    setPalletTerm(termReq.data);
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
                <>
                    <MainLayout>
                        <Head title="GTLS Pallet T&C" />
                        <div className="relative isolate bg-dark">
                            <div aria-hidden="true" className="relative">
                                <img
                                    src={
                                        strapiApiUrl +
                                        getPalletTerm.HeroSection.url
                                    }
                                    alt="jobs"
                                    className="h-96 w-full object-cover object-center "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                            </div>

                            <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                                <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                                    <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                        {getPalletTerm.Title}
                                    </h2>
                                    <a
                                        href="/downloadGTLS-Pallets"
                                        className="w-auto inline-block "
                                    >
                                        <button className=" flex items-center gap-x-2 mt-5 rounded-3xl   px-10 py-2.5 text-center text-md font-bold text-white hover:text-goldt shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="text-goldt w-8 h-auto"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                                                />
                                            </svg>
                                            <span>Download as PDF</span>
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className="relative isolate overflow-hidden  py-16 sm:py-16">
                                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                    <div className="mx-auto text-smooth">
                                        <div
                                            className=""
                                            dangerouslySetInnerHTML={{
                                                __html: getPalletTerm.Body,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
