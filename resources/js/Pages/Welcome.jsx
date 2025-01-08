import { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LogoWhite from "../assets/pictures/LogoWhite.webp";
import Truck from "../assets/pictures/truck.png";
import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/inertia-react";
import { Link as ScrollLink } from "react-scroll";
import Branches from "./Component/landingPage/branches";
import ContatcUs from "./Component/landingPage/ContactUs";
import Footer from "./Component/landingPage/Footer";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Video from "./Component/landingPage/video";
import GTRS from "./Component/landingPage/GtrsDemo";
import FeedbackButton from "./Component/landingPage/FeedbackButton";
import AboutUs from "./Component/landingPage/AboutUs";
import News from "./Component/landingPage/News";
import Map from "../Components/map";
import Certifiactesw from "./Component/landingPage/certificatesw";
import VideoHeader from "./Component/landingPage/VideoHeader";
import Technologies from "./Component/landingPage/Technologies";
import ScrollNav from "./Component/scrollnavmain";
import ScrollToTopButton from "@/Components/ScrollUpButton";
import { components } from "react-select";
import { Popover, Transition } from "@headlessui/react";
import SearchIcon from "@mui/icons-material/Search";
import { Fragment } from "react";
import {
    ChevronDownIcon,
    PhoneIcon,
    BellAlertIcon,
} from "@heroicons/react/20/solid";
import CookiePopup from "./Component/CookiePopup";
import GoingGreenSection from "./Component/landingPage/GoingGreenSection";
import Features from "./Component/landingPage/Features";
import Safety from "./Component/landingPage/Safety";
import Subscribe from "@/Components/Subscribe";
import GoogleMap from "@/Components/GoogleMap";
import GoogleMapComp from "@/Components/GoogleMap";
import { BounceLoader } from "react-spinners";
import TrainNotification from "@/Components/TrainNotification";
import CircularProgress from "@mui/material/CircularProgress";
import { set } from "date-fns";
import Downshift from "downshift";
import SearchWebsite from "@/Pages/Component/SearchWebsite";
const mapUrl = window.Laravel.mapUrl;
const navigation = [
    { id: 1, name: "About Us", href: "/aboutus", link: true },
    { id: 2, name: "Services", href: "services", link: false },
    { id: 3, name: "Technologies", href: "/technologies", link: true },
    { id: 4, name: "Media & News", href: "/news", link: true },
    { id: 5, name: "Careers", href: "/opportunities", link: true },
    { id: 6, name: "Contact Us", href: "/contact_us", link: true },
    { id: 7, name: "Going Green", href: "/goinggreen", link: true },
    { id: 8, name: "National Road Alerts", href: mapUrl, link: true },
];

const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
};

export default function Welcome(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [nextPage, setNextPage] = useState(false);
    const [getSafety, setSafety] = useState([]);

    useEffect(() => {
        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
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
    const [getVistis, setVistis] = useState([]);
    const [getservices, setServices] = useState([]);
    const [getwhygtls, setwhygtls] = useState([]);
    const [getGreen, setGreen] = useState([]);
    const [gettechnologies, settechnologies] = useState([]);
    const [getfooter, setfooter] = useState([]);
    const [getTrainNotification, setTrainNotification] = useState();
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
                const requests = [
                    axios.get("/getheader"),
                    axios.get("/getTrainNotification"),
                    axios.get("/getGtrs"),
                    axios.get("/visitor"),
                    axios.get("/getaboutus"),
                    axios.get("/getservices"),
                    axios.get("/getgoingGreen"),
                    axios.get("/whygtls"),
                    axios.get("/safety"),
                    axios.get("/tecnologies"),
                    axios.get("/certificates"),
                    axios.get("/footer"),
                ];

                // Execute all requests concurrently
                const responses = await Promise.all(requests);

                // Destructure responses array
                const [
                    headerResponse,
                    getTrainNotificationResponse,
                    GtrsResponse,
                    visitorResponse,
                    aboutResponse,
                    servicesResponse,
                    goingGreenResponse,
                    whyGTLSResponse,
                    safetyResponse,
                    technologiesResponse,
                    certificatesResponse,
                    footerResponse,
                ] = responses;

                // Set states with data
                setGetHeader(headerResponse);
                setTrainNotification(getTrainNotificationResponse.data);
                setGtrs(GtrsResponse);
                setVistis(visitorResponse.data);
                setGetAbout(aboutResponse.data);
                setServices(servicesResponse.data);
                setGreen(goingGreenResponse.data);
                setwhygtls(whyGTLSResponse.data);
                setSafety(safetyResponse.data);
                settechnologies(technologiesResponse.data);
                setcertificates(certificatesResponse.data);
                setfooter(footerResponse.data);
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
                        <TrainNotification
                            getTrainNotification={getTrainNotification}
                        />
                        <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd ">
                            <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8 flex items-center h-full justify-end lg:justify-between">
                                <div className="hidden lg:flex gap-x-7 ">
                                    <a
                                        href="/contact_us"
                                        className="text-xs sm:text-sm font-bold flex h-full items-center"
                                    >
                                        Contact Us
                                    </a>
                                    <a
                                        href="/opportunities"
                                        className="text-xs sm:text-sm font-bold flex h-full items-center"
                                    >
                                        Careers
                                    </a>
                                </div>
                                <div className="flex gap-x-4 sm:gap-x-8 md:gap-x-14 relative h-6">
                                    <SearchWebsite />
                                    <a
                                        href="tel:+1800040306"
                                        className="whitespace-nowrap text-xs sm:text-sm font-bold flex h-full items-center"
                                    >
                                        {" "}
                                        <PhoneIcon
                                            className="h-5 sm:h-6 w-auto p-0.5"
                                            aria-hidden="true"
                                        />
                                        Call: 1800-040-306
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="absolute z-30 w-full">
                            <nav
                                className=" mx-auto lg:max-w-7xl max-w-7xl px-6  py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8   flex items-center justify-between"
                                aria-label="Global"
                            >
                                <div className="flex lg:flex-1">
                                    <a href="/" className="-m-1.5 p-1.5">
                                        <span className="sr-only">
                                            Your Company
                                        </span>
                                        <img
                                            className="h-20"
                                            src={LogoWhite}
                                            alt="Gold Tiger"
                                        />
                                    </a>
                                </div>
                                <div className="flex lg:hidden">
                                    <Popover className="relative object-right flex-item md:ml-auto">
                                        <Popover.Button
                                            className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                                        >
                                            Login
                                            <ChevronDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute left-12 top-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                    <div className="w-full">
                                                        <div className=" flex flex-col gap-y-0">
                                                            <a
                                                                href="/login"
                                                                className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                            >
                                                                <div className=" w-full flex justify-center">
                                                                    <button className="font-bold p-2 px-4">
                                                                        Log In
                                                                    </button>
                                                                </div>
                                                            </a>
                                                            <div className="bg-gray-600 h-[0.05rem]"></div>
                                                            <a
                                                                target={
                                                                    "_blank"
                                                                }
                                                                href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                                className=" hover:bg-dark text-dark hover:text-goldt "
                                                            >
                                                                <div className="w-full flex justify-center">
                                                                    <button className=" font-bold p-2 px-4">
                                                                        Client
                                                                        Login
                                                                    </button>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                            <button
                                                // onClick={handleDownloadExcel}
                                                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                            >
                                                Export XLS
                                            </button>
                                        </div> */}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </Popover>
                                    <button
                                        type="button"
                                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                                        onClick={() => setMobileMenuOpen(true)}
                                    >
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        <Bars3Icon
                                            className="h-6 w-6 text-goldt"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                                <div className="hidden lg:flex lg:gap-x-8">
                                    {navigation.map((item) =>
                                        item.id == 5 ||
                                        item.id == 6 ? null : item.id != 8 ? (
                                            <div key={item.name}>
                                                {item.link ? (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        // data={item.ref}
                                                        // smooth={true}
                                                        className="hover:cursor-pointer hover:border-b hover:border-goldt p-1   text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ) : (
                                                    <ScrollLink
                                                        key={item.name}
                                                        to={item.href}
                                                        smooth={true}
                                                        className="hover:cursor-pointer h-8 hover:border-b hover:border-goldt p-1 hover:text-white text-md font-semibold leading-6 text-goldt"
                                                    >
                                                        {item.name}
                                                    </ScrollLink>
                                                )}
                                            </div>
                                        ) : (
                                            <a
                                                href={item.href}
                                                key={item.name}
                                                target="_blank"
                                                className="hover:cursor-pointer hover:border-b hover:border-goldt text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                                            >
                                                {item.name}
                                            </a>
                                        )
                                    )}
                                </div>
                                <div className="hidden  lg:flex lg:flex-1 lg:justify-end">
                                    <FeedbackButton />
                                    <Popover className="relative object-right flex-item md:ml-auto ">
                                        <Popover.Button
                                            className={` inline-flex items-center  px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white`}
                                        >
                                            Login
                                            <ChevronDownIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </Popover.Button>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute left-12 top-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                <div className=" max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                    <div className="w-full">
                                                        <div className=" flex flex-col gap-y-0">
                                                            <a
                                                                href="/login"
                                                                className=" mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                                                            >
                                                                <div className=" w-full flex justify-center">
                                                                    <button className="font-bold p-2 px-4">
                                                                        Log In
                                                                    </button>
                                                                </div>
                                                            </a>
                                                            <div className="bg-gray-600 h-[0.05rem]"></div>
                                                            <a
                                                                target={
                                                                    "_blank"
                                                                }
                                                                href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                                                                className=" hover:bg-dark text-dark hover:text-goldt "
                                                            >
                                                                <div className="w-full flex justify-center">
                                                                    <button className=" font-bold p-2 px-4">
                                                                        Client
                                                                        Login
                                                                    </button>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                    {/* <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                                            <button
                                                // onClick={handleDownloadExcel}
                                                className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                            >
                                                Export XLS
                                            </button>
                                        </div> */}
                                                </div>
                                            </Popover.Panel>
                                        </Transition>
                                    </Popover>
                                </div>
                            </nav>
                            <Dialog
                                as="div"
                                open={mobileMenuOpen}
                                onClose={setMobileMenuOpen}
                            >
                                <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark px-6 py-6 lg:hidden">
                                    <div className="flex items-center justify-between">
                                        <a href="#" className="-m-1.5 p-1.5">
                                            <span className="sr-only">
                                                Your Company
                                            </span>
                                            <img
                                                className="h-8"
                                                src={LogoWhite}
                                                alt="Gold Tiger"
                                            />
                                        </a>
                                        <button
                                            type="button"
                                            className="-m-2.5 rounded-md p-2.5 text-goldd"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close menu
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div className="mt-6 flow-root">
                                        <div className="-my-6 divide-y divide-gray-500/10">
                                            <div className="space-y-2 py-6">
                                                {navigation.map((item) => (
                                                    <div key={item.name}>
                                                        {item.link ? (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className="hover:cursor-pointer  -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ) : (
                                                            <ScrollLink
                                                                key={item.name}
                                                                to={item.href}
                                                                smooth={true}
                                                                className="hover:cursor-pointer  -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                                                            >
                                                                {item.name}
                                                            </ScrollLink>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Dialog>
                            <ScrollNav
                                getTrainNotification={getTrainNotification}
                            />
                        </div>
                        <VideoHeader getHeader={getHeader} />
                        <AboutUs
                            getAbout={getAbout}
                            setGetAbout={setGetAbout}
                        />
                        <div
                            id="services"
                            className="lg:mb-32 hidden lg:block"
                        ></div>
                        <PrimaryServices
                            getservices={getservices}
                            setServices={setServices}
                        />
                        <GoingGreenSection
                            getGreen={getGreen}
                            setGreen={setGreen}
                        />

                        <Features
                            getwhygtls={getwhygtls}
                            setwhygtls={setwhygtls}
                        />
                        <GTRS getGtrs={getGtrs} />
                        <Safety getSafety={getSafety} />
                        {/* <Video /> */}

                        <Technologies gettechnologies={gettechnologies} />
                        {/* <Softwares /> */}

                        {/* <WhyGoldTiger /> */}
                        <Certifiactesw getcertificates={getcertificates} />

                        {/* <Partners/> */}
                        <Footer getfooter={getfooter} />
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
                    </div>
                </>
            )}
        </>
    );
}
