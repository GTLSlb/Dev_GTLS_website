import { Head } from "@inertiajs/react";
import jobs from "../assets/backgrounds/Goldtiger-Tech.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "./Component/Navbars";
const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/contact_us", ref: "contact" },
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
            <Head title="Technology" />
            <div className="relative isolate bg-dark">
                {/* <Chatbot /> */}
                <Navbars />
                {/* <HeroSection/> */}

                <div aria-hidden="true" className="relative">
                    <img
                        src={jobs}
                        alt="jobs"
                        className="h-96 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>

                <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                    {/* <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                            About Gold<span className="text-white">Tiger</span>
                        </h2>
                    </div> */}
                </div>
                <div className="relative isolate overflow-hidden  py-16 sm:py-16 mb-10">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="relative lg:order-last lg:col-span-5">
                            <figure className="mb-10">
                                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    Technology
                                </h1>
                            </figure>
                            <p className="mt-3 text-smooth">
                            Technology plays an important role in Gold Tiger’s commitment to continuous improvement. It enables us to deliver transparent and responsive services and keeps us accountable for the commitments we make to our clients.
                            </p>
                            <p className="mt-3 text-smooth">
                            We are <a className="underline underline-offset-1" href="https://www.volvotrucks.com.au/en-au/">Volvo</a> partners, and our <a className="underline underline-offset-1" href="https://www.volvotrucks.com.au/en-au/">Volvo</a> truck fleet uses innovative solutions such as <a className="underline underline-offset-1" href="https://www.volvotrucks.com.au/en-au/">Volvo</a>’s fuel-saving I-Save technology.                   
                            </p>
                            <p className="mt-3 text-smooth">
                            <a className="underline underline-offset-1" href="https://www.volvotrucks.com.au/en-au/">Volvo</a>’s dynamic steering offers perfect stability, total control at low speeds and reduced strain on our drivers. It also helps to avoid skidding and unintentional lane changes and lets drivers set steering wheel preferences.
                            </p>
                            <p className="mt-3 text-smooth">
                            We use leading technologies throughout our operations, from track-and-trace through to RF scanning and JAIX logistics software. We can also integrate our system with our customers’ system, enabling you to see the same data that we do. We can provide all kinds of reporting including on-time performance, DIFOT, Power BI, GTRS and KPI reports.
                            </p>
                            <p className="mt-3 text-smooth">
                            Much of the data, with automatically generated reports, is available through the customer portal accessed via our website. It contains the important basics – where is my freight, when will it arrive, proof of delivery – through to more advanced information for forecasting, budgeting and reporting purposes. Anything not available in the portal can usually be provided by your Account Manager or Customer Service representative through one of our reporting systems.
                            </p>
                            




                            <figure className="mb-10">
                                <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                    IT services
                                </h1>
                            </figure>
                            <p className="mt-3 text-smooth">
                            Gold Tiger is developing a new IT infrastructure that will provide enhanced security measures for our systems and customer information.                            
                            </p>
                            <p className="mt-3 text-smooth">
                            The new infrastructure will include cybersecurity tools and protocols to protect against digital attacks, data breaches and other security threats. We are also implementing enhanced data privacy and compliance measures to ensure that sensitive customer information is always protected.
                            </p>
                            <p className="mt-3 text-smooth">
                            With this new IT infrastructure, we are demonstrating our commitment to protecting our customers’ sensitive information and providing the highest level of security possible.
                            </p>

                        </div>


                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
