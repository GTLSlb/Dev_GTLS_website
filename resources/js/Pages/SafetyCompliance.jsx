import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";

const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/contact_us", ref: "contact" },
];

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

export default function AboutUs(props) {
    const [getfooter, setfooter] = useState([]);

    // ********************************************************* 
    // ********************* All requests  ********************* 
    // ********************************************************* 

    useEffect(() => {
        axios.get('/footer')
          .then(response => {
              // console.log('fetching data:',response.data);
              setfooter(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
      // ********************************************************* 
      // ********************* End requests  ********************* 
      // ********************************************************* 
      
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
            <Head title="Safety and compliance" />
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
                                    Safety and compliance
                                </h1>
                            </figure>
                            <p className="mt-3 text-smooth">
                                Gold Tiger remains committed to the safety of all road users. As part of our ongoing safety innovation program, we have made a significant enhancement to our safety practices through the integration of two state-of-the-art weighbridge systems.
                            </p>
                            <p className="mt-3 text-smooth">
                                The latest of these cutting-edge weighbridges, recently installed in the Sydney depot, complements a similar unit introduced last year in the Melbourne depot.
                            </p>
                            <p className="mt-3 text-smooth">
                                With the introduction of this second weighbridge, a remarkable 80% of all interstate linehaul movements now undergo thorough checks before departing from our depots, enabling us to proactively prevent overloaded vehicles from taking to the roads.
                            </p>
                            <p className="mt-3 text-smooth">
                                This not only lightens the burden on our road infrastructure but also guarantees that all our vehicles operate within the legally prescribed weight limits.
                            </p>
                            <p className="mt-3 text-smooth">
                                We have introduced these advanced weighbridge systems to augment our capabilities and to revolutionise the weighing process by automating it and eliminating human error. It is our responsibility to ensure that our weighing procedures are robust and protect consumers from inaccuracies in product weight, thereby preserving their trust in our services.
                            </p>
                            <p className="mt-3 text-smooth">
                                The weighbridge systems also serve as valuable tools for our internal documentation requirements. The weighbridges play pivotal roles in streamlining the management of incoming/outgoing vehicles, significantly boosting overall operational efficiency. The weighbridge systems have eliminated the need for time-consuming reloads, ensuring that no time or effort is wasted while passing on cost savings and maintaining DIFOT efficiency for consignments.
                            </p>
                            <p className="mt-3 text-smooth">
                                This advancement has created a higher degree of confidence for our drivers, assuring them that the vehicle they are operating complies fully with safety standards and is perfectly suited for its intended purpose.
                            </p>
                            <p className="mt-3 text-smooth">
                                Gold Tiger is better equipped than ever to uphold the highest standards of safety, compliance and efficiency in the logistics industry.
                            </p>
                            <p className="mt-3 text-smooth">
                                Soon our whole fleet of Volvo trucks will meet the Euro 6 standard, with a replacement program well under way. We have recently installed a MAHA braking testing system at our workshop to accurately measure our vehicles’ brake system performance.
                            </p>
                            <p className="mt-3 text-smooth">
                                We have an outstanding health and safety record (no injuries) and our drivers have accident-free driving records. All drivers have the relevant driving licences and tickets they need to complete their work safely and use any required equipment. Our drivers are professionals with excellent driving skills and are trained in topics such as fatigue management, mass management and dangerous goods.
                            </p>
                            








                           

                        </div>


                    </div>
                </div>

                <Footer getfooter={getfooter}/>
            </div>
        </>
    );
}
