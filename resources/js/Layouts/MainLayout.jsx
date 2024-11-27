import React, { useEffect } from "react";
import ScrollToTopButton from "@/Components/ScrollUpButton";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "@inertiajs/inertia-react";
import { Link as ScrollLink } from "react-scroll";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LogoWhite from "../assets/pictures/LogoWhite.webp";
import TrainNotification from "@/Components/TrainNotification";
import ScrollNav from "@/Pages/Component/scrollnavmain";
import CookiePopup from "@/Pages/Component/CookiePopup";
import FeedbackButton from "@/Pages/Component/landingPage/FeedbackButton";
import { useState } from "react";
import Footer from "@/Pages/Component/landingPage/Footer";
import { getFromStrapi } from "@/CommonFunctions";
import { BounceLoader } from "react-spinners";
import Navbars from "@/Components/Navbars";
import HomePageNavBar from "@/Components/HomePageNavBar";


function MainLayout({ children, loading, isHomeScreen }) {
    const [getTrainNotification, setTrainNotification] = useState();
    const [getfooter, setfooter] = useState([]);
    const [getNavigation, setNavigation] = useState([]);
    const [layoutloading, setLayoutLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLayoutLoading(true);
            try {
                const footerReq = await getFromStrapi(`/api/footer/?pLevel=2`);
                const navigationReq = await getFromStrapi(
                    `/api/nav-bar/?pLevel=2`
                );
                if (footerReq.success) {
                    setfooter(footerReq.data);
                }
                if (navigationReq.success) {
                    setNavigation(navigationReq.data);
                }
                setLayoutLoading(false);
                // scroll to the correct div
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
            }
        };

        fetchData();
    }, []);
    return (
        <div>
            <>
                {layoutloading || loading ? (
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                ) : (
                    <>
                        <TrainNotification
                            getTrainNotification={getTrainNotification}
                        />
                        {isHomeScreen ? (
                            <>
                                <HomePageNavBar getNavigation={getNavigation}/>
                            </>
                        ) : (
                            <>
                                <Navbars getNavigation={getNavigation} />
                            </>
                        )}

                        <div>{children}</div>
                        <CookiePopup />
                        <ScrollToTopButton />
                        <style>{`
                .max-w-8xl{
                    max-width: 85rem;
                }
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
                        <Footer getfooter={getfooter} />
                    </>
                )}
            </>
        </div>
    );
}

export default MainLayout;
