import { useState, useEffect, Fragment } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    ChevronDownIcon,
    PhoneIcon,
} from "@heroicons/react/20/solid";
import { Link } from "@inertiajs/inertia-react";
import TrainNotification from "./TrainNotification";

const strapiUrl = window.Laravel.strapiAppUrl;
// Top Bar component
function TopBar({ topBarLinks, phoneNb }) {
    return (
        <div className="w-full h-6 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd px-2">
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
}

// Login Popover component
function LoginPopover() {
    return (
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
                <Popover.Panel className="absolute left-12 top-8 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                    <div className="max-w-md flex-auto overflow-hidden rounded-lg bg-gradient-to-r from-goldl to-goldd text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div className="w-full">
                            <div className="flex flex-col gap-y-0">
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
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
}

// Navigation Links component
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

// Mobile Menu component
function MobileMenu({
    mobileMenuOpen,
    setMobileMenuOpen,
    getNavigation,
    navLinks,
}) {
    return (
        <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <Dialog.Panel className="fixed inset-0 z-10 overflow-y-auto bg-dark px-6 py-6 lg:hidden">
                <div className="flex flex-row-reverse items-center justify-between">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldd"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img
                            className="h-8"
                            src={strapiUrl + getNavigation.Icon.url}
                            alt="GoldTiger"
                        />
                    </a>
                </div>
                <div className="mt-6 space-y-2">
                    {navLinks.map((item) => (
                        <Link
                            key={item.documentId}
                            href={item.Url}
                            className="hover:cursor-pointer -mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-goldt hover:bg-gray-400/10"
                        >
                            {item.Name}
                        </Link>
                    ))}
                </div>
            </Dialog.Panel>
        </Dialog>
    );
}

export default function Navbars({ getNavigation, getTrainNotification }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [topBarLinks, setTopBarLinks] = useState([]);
    const [navLinks, setNavLinks] = useState([]);
    useEffect(() => {
        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);

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
            getNavigation.navigation_links.filter((link) => link.TopBar)
        );
    }, [getNavigation]);
    return (
        <div className="absolute pb-2 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd shadow-xl shadow-bottom z-30 w-full">
            <div className="bg-dark">
                <TopBar
                    topBarLinks={topBarLinks}
                    phoneNb={getNavigation.PhoneNb}
                />
                <nav
                    className="mx-auto lg:max-w-7xl max-w-7xl px-6 pb-2 pt-2 lg:flex lg:items-center lg:gap-x-10 lg:px-10 flex items-center justify-between"
                    aria-label="Global"
                >
                    <div className="flex lg:flex-1">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="h-14"
                                src={strapiUrl + getNavigation.Icon.url}
                                alt="GoldTiger"
                            />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <LoginPopover />
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-goldt"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12 h-8">
                        <NavigationLinks navLinks={navLinks} />
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <LoginPopover />
                    </div>
                </nav>
            </div>
            <MobileMenu
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                getNavigation={getNavigation}
                navLinks={navLinks}
            />
            {/* Fixed Navbar when scrolling */}
            <div
                className={`shadow-md shadow-bottom z-50 h-auto pb-2 bg-goldd bg-gradient-to-r from-goldl via-goldt to-goldd lg:pr-0 fixed bg-white top-0 left-0 w-full transition duration-500 ease-in-out ${
                    showNavbar ? "opacity-100" : "opacity-0 -translate-y-full"
                }`}
            >
                <div className="w-full bg-dark">
                    {getTrainNotification.Active && (
                        <TrainNotification
                            getTrainNotification={getTrainNotification}
                        />
                    )}
                    <TopBar
                        topBarLinks={topBarLinks}
                        phoneNb={getNavigation.PhoneNb}
                    />
                     <div className="flex gap-x-14 relative h-6">
                        <SearchWebsite />
                    <nav
                        className="mx-auto lg:max-w-7xl max-w-7xl px-6 pt-2 pb-2 lg:flex lg:items-center lg:gap-x-10 lg:px-10 flex items-center justify-between"
                        aria-label="Global"
                    >
                        <div className="flex lg:flex-1">
                            <a href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">Gold Tiger</span>
                                <img
                                    className="h-14"
                                    src={strapiUrl + getNavigation.Icon.url}
                                    alt="GoldTiger"
                                />
                            </a>
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
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-12 h-8">
                            <NavigationLinks navLinks={navLinks} />
                        </div>
                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <LoginPopover />
                        </div>
                    </nav>
                </div>
                <MobileMenu
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    getNavigation={getNavigation}
                    navLinks={navLinks}
                />
            </div>
        </div>
    );
}
