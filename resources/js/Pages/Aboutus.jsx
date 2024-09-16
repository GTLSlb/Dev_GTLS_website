import { Head } from "@inertiajs/react";
import Team from "../Pages/Component/landingPage/Team";
import { useState, useEffect } from "react";
import axios from "axios";

import Footer from "./Component/landingPage/Footer";
import Navbars from "./Component/Navbars";
import BounceLoader from "react-spinners/BounceLoader";


export default function AboutUs(props) {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const [getfooter, setfooter] = useState([]);
    const [getHeader, setHeader] = useState([]);
    const [getCoreValue, setCoreValue] = useState([]);
    const [getSolutions, setSolutions] = useState([]);
    const [getTeam, setTeam] = useState([]);

    const [loading, setLoading] = useState(true); // Add this state to manage loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [
                    axios.get("/aboutPageHeader"),
                    axios.get("/aboutPageCoreValue"),
                    axios.get("/aboutPageSolutions"),
                    axios.get("/aboutPageTeam"),
                    axios.get("/footer"),
                ];

                // Execute all requests concurrently
                const responses = await Promise.all(requests);

                // Destructure responses array
                const [
                    headerResponse,
                    coreValueResponse,
                    solutionsResponse,
                    teamResponse,
                    footerResponse,
                ] = responses;

                // Set states with data
                setHeader(headerResponse.data);
                setCoreValue(coreValueResponse.data);
                setSolutions(solutionsResponse.data);
                setTeam(teamResponse.data);
                setfooter(footerResponse.data);

                // Set loading to false when all requests are completed
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
            }
        };

        fetchData();
    }, []);

    // Now you can use the loading state to conditionally render loading indicators or content

    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************

    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;

        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

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
                <>
                    <Head title="About Gold Tiger" />
                    <div className="relative isolate bg-dark">
                        {/* <Chatbot /> */}
                        <Navbars />
                        {/* <HeroSection/> */}

                        <div
                            aria-hidden="true"
                            className="relative pt-20 w-full"
                        >
                            <img
                                src={"/app/webimages/" + getHeader[0]?.image}
                                alt={getHeader[0]?.image_alt}
                                className="pt-30 w-full h-96 object-cover object-top "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                        </div>

                        <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                        </div>
                        <div className="relative isolate overflow-hidden  py-16 sm:py-16 mb-10">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <div className="relative lg:order-last lg:col-span-5">
                                    <figure className="mb-10">
                                        <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                            {getHeader[0]?.name}
                                        </h1>
                                    </figure>
                                    <div
                                        className="mt-3 text-smooth"
                                        dangerouslySetInnerHTML={{
                                            __html: getHeader[0]?.description,
                                        }}
                                    ></div>

                                    <figure className="mb-5">
                                        <h2 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                            {getCoreValue?.name}
                                            {/* Core values */}
                                        </h2>
                                        <div
                                            className="mt-3 text-smooth"
                                            dangerouslySetInnerHTML={{
                                                __html: getCoreValue?.description,
                                            }}
                                        ></div>
                                    </figure>
                                    {getCoreValue?.elements?.map((feature) => (
                                        <div
                                            key={feature.id}
                                            className="mt-3 text-smooth pl-5"
                                        >
                                            <span className="text-goldt font-bold">
                                                - {feature.name}
                                            </span>
                                            <div
                                                className="mt-3 text-smooth pl-5"
                                                dangerouslySetInnerHTML={{
                                                    __html: getCoreValue?.description,
                                                }}
                                            ></div>
                                        </div>
                                    ))}
                                    <figure className="mb-10">
                                        <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                            {getSolutions?.name}
                                            {/* Integrated solutions */}
                                        </h1>
                                    </figure>
                                    <div
                                        className="mt-3 text-smooth"
                                        dangerouslySetInnerHTML={{
                                            __html: getSolutions?.description,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <Team getTeam={getTeam} />

                        <div className="text-smooth "></div>

                        <Footer getfooter={getfooter} />
                    </div>
                </>
            )}
        </>
    );
}
