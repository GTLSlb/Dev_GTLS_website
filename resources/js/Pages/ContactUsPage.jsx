import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import Branches from "./Component/landingPage/branches";
import ContatcUs from "./Component/landingPage/ContactUs";

import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "./Component/Navbars";
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
                <Footer />
            </div>
        </>
    );
}
