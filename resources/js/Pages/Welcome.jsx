import React from "react";
import { getFromStrapi } from "@/CommonFunctions";
import MainLayout from "@/Layouts/MainLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";
import "../../css/certficatesSwiper.css";
import AboutUs from "./Component/landingPage/AboutUs";
import Certifiactesw from "./Component/landingPage/certificatesw";
import Features from "./Component/landingPage/Features";
import GoingGreenSection from "./Component/landingPage/GoingGreenSection";
import GTRS from "./Component/landingPage/GtrsDemo";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Safety from "./Component/landingPage/Safety";
import Technologies from "./Component/landingPage/Technologies";
import VideoHeader from "./Component/landingPage/VideoHeader";
import SearchWebsite from "./Component/SearchWebsite";
const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

export default function Welcome() {
    const [getSafety, setSafety] = useState([]);

    useEffect(() => {
        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            // setIsSuggOpen(false);
            const hash = window.location.hash;
            if (hash && document.querySelector(hash)) {
                const element = document.querySelector(hash);
                const elementTop =
                    element.getBoundingClientRect().top + scrollTop;
                const navbarHeight = document.querySelector("nav").offsetHeight;
                if (elementTop <= navbarHeight) {
                    window.scrollTo(0, elementTop - navbarHeight);
                }
            }
        }

        function handleHashChange() {
            setTimeout(() => handleScroll(), 0);
        }

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("hashchange", handleHashChange);
        handleScroll(); // Call the function on initial page load

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("hashchange", handleHashChange);
        };
    }, []);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    const [getcertificates, setcertificates] = useState([]);
    const [getHeader, setGetHeader] = useState();
    const [getGtrs, setGtrs] = useState();
    const [getAbout, setGetAbout] = useState();
    const [getservices, setServices] = useState([]);
    const [getwhygtls, setwhygtls] = useState([]);
    const [getGreen, setGreen] = useState([]);
    const [gettechnologies, settechnologies] = useState([]);

    const [loading, setLoading] = useState(true); // Add this state to manage loading state
    function handleScroll() {
        const hash = window.location.hash;

        if (hash && document.getElementById(hash.substring(1))) {
            // Scroll to the element smoothly
            document.getElementById(hash.substring(1)).scrollIntoView({
                behavior: "smooth",
            });
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getFromStrapi(
                    `/api/home-page?pLevel=4`
                );

                if (result.success) {
                    setGetHeader(result.data);
                    setGetAbout(result.data.Dynamic_zone[1]);
                    setServices(
                        result.data.Dynamic_zone.find(
                            (zone) =>
                                zone.__component === "global.related-services"
                        )
                    );
                    setGreen(
                        result.data.Dynamic_zone.find(
                            (zone) => zone.sectionName === "GoingGreen-HomePage"
                        )
                    );
                    setwhygtls(
                        result.data.Dynamic_zone.find(
                            (zone) =>
                                zone.__component === "global.related-values"
                        )
                    );
                    setGtrs(
                        result.data.Dynamic_zone.find(
                            (zone) =>
                                zone.__component === "global.video-section"
                        )
                    );
                    setSafety(
                        result.data.Dynamic_zone.find(
                            (zone) => zone.sectionName === "Safety-HomePage"
                        )
                    );
                    settechnologies(
                        result.data.Dynamic_zone.find(
                            (zone) =>
                                zone.sectionName === "Technologies-HomePage"
                        )
                    );
                    setcertificates(
                        result.data.Dynamic_zone.find(
                            (zone) =>
                                zone.__component ===
                                "global.related-certificate"
                        )
                    );
                }

                // Set loading to false when all requests are completed
                setLoading(false);
                // scroll to the correct div
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        handleScroll();
    }, []);

    useEffect(() => {
        if (loading == false) {
            if (window.location.hash === "#services") {
                scrollToElement("services");
            }
            // Adding an event listener to handle hash changes while on the page
            const handleHashChange = () => {
                if (window.location.hash === "#services") {
                    scrollToElement("services");
                }
            };
            window.addEventListener("hashchange", handleHashChange);
            // Cleanup the event listener on component unmount
            return () =>
                window.removeEventListener("hashchange", handleHashChange);
        }
    }, [loading]);

    return (
        <>
            {loading ? (
                <div className="bg-dark flex justify-center items-center h-screen">
                    {" "}
                    <BounceLoader color="#e2b540" />
                </div>
            ) : (
                <>
                    <Head title="Welcome" />
                    {/* <Navbars /> */}
                    <div className="relative isolate bg-dark">
                        <MainLayout loading={loading} isHomeScreen={true}>
                            <SearchWebsite />
                            <VideoHeader getHeader={getHeader} />
                            <AboutUs getAbout={getAbout} />
                            <PrimaryServices getservices={getservices} />
                            <GoingGreenSection getGreen={getGreen} />
                            <Features getwhygtls={getwhygtls} />
                            <GTRS getGtrs={getGtrs} />
                            <Safety getSafety={getSafety} />
                            <Technologies gettechnologies={gettechnologies} />
                            <Certifiactesw getcertificates={getcertificates} />
                        </MainLayout>

                    </div>
                </>
            )}
        </>
    );
}
