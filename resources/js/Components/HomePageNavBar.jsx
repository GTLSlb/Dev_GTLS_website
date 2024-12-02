import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition, Popover } from "@headlessui/react";
import {
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/inertia-react";
import { PhoneIcon } from "@heroicons/react/20/solid";
import FeedbackButton from "@/Pages/Component/landingPage/FeedbackButton";
import TrainNotification from "./TrainNotification";

const strapiUrl = window.Laravel.strapiAppUrl;

const TopBar = ({ topBarLinks, phoneNb }) => (
    <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd">
        <div className="mx-auto sm:max-w-7xl sm:px-6 lg:px-8 flex items-center h-full justify-end lg:justify-between">
            <div className="hidden lg:flex gap-x-7">
                {topBarLinks.map((link) => (
                    <a
                        key={link.documentId}
                        href={link.Url}
                        className="text-xs sm:text-sm font-bold flex h-full items-center"
                    >
                        {link.Name}
                    </a>
                ))}
            </div>
            <a
                href={`tel:${phoneNb}`}
                className="whitespace-nowrap text-xs sm:text-sm font-bold flex h-full items-center"
            >
                <PhoneIcon
                    className="h-5 sm:h-6 w-auto p-0.5"
                    aria-hidden="true"
                />
                Call: {phoneNb}
            </a>
        </div>
    </div>
);

const Logo = ({ Image }) => (
    <a href="/" className="-m-1.5 p-1.5">
        <span className="sr-only">Your Company</span>
        <img className="h-20" src={strapiUrl + Image} alt="Gold Tiger" />
    </a>
);

const LoginPopover = () => (
    <Popover className="relative object-right flex-item md:ml-auto">
        <Popover.Button className="inline-flex items-center px-4 py-2 border-2 border-goldt rounded-3xl mr-6 hover:bg-black hover:text-goldt text-white">
            Login
            <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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
                <div className="max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                    <div className="w-full flex flex-col gap-y-0">
                        <a
                            href="/login"
                            className="mr-6 w-full hover:bg-dark hover:text-goldt text-dark"
                        >
                            <div className="w-full flex justify-center">
                                <button className="font-bold p-2 px-4">
                                    Log In
                                </button>
                            </div>
                        </a>
                        <div className="bg-gray-600 h-[0.05rem]"></div>
                        <a
                            target="_blank"
                            href="https://jaixwebapps.gtls.com.au/Portal/Account/Login.aspx"
                            className="hover:bg-dark text-dark hover:text-goldt"
                        >
                            <div className="w-full flex justify-center">
                                <button className="font-bold p-2 px-4">
                                    Client Login
                                </button>
                            </div>
                        </a>
                    </div>
                </div>
            </Popover.Panel>
        </Transition>
    </Popover>
);

function NavigationLinks({ navLinks }) {
    return (
        <>
            {navLinks.map((item) =>
                item.id === 5 || item.id === 6 ? null : item.id !== 8 ? (
                    <Link
                        key={item.Name}
                        href={item.Url}
                        className="hover:cursor-pointer hover:border-b hover:border-goldt p-1 text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                    >
                        {item.Name}
                    </Link>
                ) : (
                    <a
                        key={item.Name}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:cursor-pointer hover:border-b hover:border-goldt p-1 text-[1rem] font-semibold leading-6 text-goldt hover:text-white"
                    >
                        {item.Name}
                    </a>
                )
            )}
        </>
    );
}

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, getNavigation }) => (
    <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
    >
        <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark px-6 py-6 lg:hidden">
            <div className="flex items-center justify-between">
                <Logo Image={getNavigation.Icon.url} />
                <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-goldd"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
            </div>
            <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                        {getNavigation.navigation_links.map((item) => (
                            <Link
                                key={item.Name}
                                to={item.url}
                                className="hover:cursor-pointer -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                            >
                                {item.Name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Dialog.Panel>
    </Dialog>
);

const Header = ({
    getNavigation,
    navLinks,
    mobileMenuOpen,
    setMobileMenuOpen,
}) => (
    <nav
        className="mx-auto lg:max-w-7xl max-w-7xl px-6 py-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8 flex items-center justify-between"
        aria-label="Global"
    >
        <div className="flex lg:flex-1">
            <Logo Image={getNavigation.Icon.url} />
        </div>
        <div className="flex lg:hidden">
            <LoginPopover />
            <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                onClick={() => setMobileMenuOpen(true)}
            >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6 text-goldt" aria-hidden="true" />
            </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
            <NavigationLinks navLinks={navLinks} />
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <FeedbackButton />
            <LoginPopover />
        </div>
    </nav>
);

const ScrollNavBar = ({
    getTrainNotification,
    topBarLinks,
    navLinks,
    getNavigation,
}) => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
        }

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div className="relative bg-goldt">
            <div
                className={`shadow-md shadow-bottom z-50 h-auto pb-2 fixed bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd top-0 left-0 w-full transition duration-500 ease-in-out ${
                    showNavbar ? "opacity-100" : "opacity-0 -translate-y-full"
                }`}
            >
                {getTrainNotification.Active && (
                    <TrainNotification
                        getTrainNotification={getTrainNotification}
                    />
                )}

                <div className="bg-dark w-full">
                    <TopBar
                        topBarLinks={topBarLinks}
                        phoneNb={getNavigation.PhoneNb}
                    />
                    <nav className="mx-auto bg-dark lg:max-w-7xl max-w-7xl px-6 pb-2 pt-2 lg:flex lg:items-center lg:gap-x-10 lg:px-10 flex items-center justify-between">
                        <Logo Image={getNavigation.Icon.url} />
                        <div className="hidden lg:flex lg:gap-x-8">
                            <NavigationLinks navLinks={navLinks} />
                        </div>
                        <div className="flex lg:hidden">
                            <LoginPopover />
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon
                                    className="h-6 w-6 text-goldt"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <FeedbackButton />
                            <LoginPopover />
                        </div>
                    </nav>
                </div>
                <MobileMenu
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    getNavigation={getNavigation}
                />
            </div>
        </div>
    );
};
const HomePageNavBar = ({ getTrainNotification, getNavigation }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [topBarLinks, setTopBarLinks] = useState([]);
    const [navLinks, setNavLinks] = useState([]);

    useEffect(() => {
        setNavLinks(
            getNavigation.navigation_links
                .filter((link) => !link.TopBar) // Filter links where TopBar is false
                .sort((a, b) => {
                    // Extract the numeric part of the order field and compare
                    const orderA = parseInt(a.Order.split("-")[1], 10); // Get the number after "o-"
                    const orderB = parseInt(b.Order.split("-")[1], 10); // Get the number after "o-"
                    return orderA - orderB; // Sort in ascending order
                })
        );

        setTopBarLinks(
            getNavigation.navigation_links
                .filter((link) => link.TopBar)
                .sort((a, b) => {
                    // Extract the numeric part of the order field and compare
                    const orderA = parseInt(a.Order.split("-")[1], 10); // Get the number after "o-"
                    const orderB = parseInt(b.Order.split("-")[1], 10); // Get the number after "o-"
                    return orderA - orderB; // Sort in ascending order
                })
        );
    }, [getNavigation]);
    return (
        <div>
            <TopBar topBarLinks={topBarLinks} phoneNb={getNavigation.PhoneNb} />
            <div className="absolute z-30 w-full">
                <Header
                    navLinks={navLinks}
                    getNavigation={getNavigation}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />
                <MobileMenu
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    getNavigation={getNavigation}
                />
                <ScrollNavBar
                    getTrainNotification={getTrainNotification}
                    topBarLinks={topBarLinks}
                    navLinks={navLinks}
                    getNavigation={getNavigation}
                />
            </div>
        </div>
    );
};

export default HomePageNavBar;
