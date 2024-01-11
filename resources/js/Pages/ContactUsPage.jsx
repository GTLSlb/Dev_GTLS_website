import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import Branches from "./Component/landingPage/branches";
import ContatcUs from "./Component/landingPage/ContactUs";

import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "./Component/navbars";
const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "contact_us", ref: "contact" },
];

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

export default function Capability(props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);

    const handleFileUpload = (file) => {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
    };

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
            <Head title="Contact Us" />
            <div className="relative isolate bg-dark">
                {/* <Chatbot /> */}
                <Navbars />
                {/* <HeroSection/> */}
                
                <div aria-hidden="true" className="relative">
                    <img
                        src={jobs}
                        alt="jobs"
                        className="h-10 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>
                <ContatcUs />
                <Branches />
                

                {/* <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                            About Gold<span className="text-white">Tiger</span>
                        </h2>
                    </div>
                </div> */}
                {/* <div className="relative isolate overflow-hidden  py-16 sm:py-16 mb-10">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="relative lg:order-last lg:col-span-5">
                            
                            
                        </div>


                    </div>
                </div> */}

                <Footer />
            </div>
        </>
    );
}
