import { Head } from "@inertiajs/react";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "@/Components/Navbars";

export default function Opportunities(props) {
    const [getfooter, setfooter] = useState([]);
    const [getCareerHead, setCareerHead] = useState([]);
    const [getCareerAttractive, setCareerAttractive] = useState([]);
    const [getCareerSkills, setCareerSkills] = useState([]);
    const [getCareerJobs, setCareerJobs] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    //CareerHead
    useEffect(() => {
        axios
            .get("/CareerHead")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setCareerHead(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    //Attractive
    useEffect(() => {
        axios
            .get("/CareerAttractive")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setCareerAttractive(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    //skills
    useEffect(() => {
        axios
            .get("/CareerSkills")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setCareerSkills(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    //Jobs
    useEffect(() => {
        axios
            .get("/CareerJobs")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setCareerJobs(response.data);
                setJobsarray(response.data.elements);
                setActiveJob(0);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    //footer
    useEffect(() => {
        axios
            .get("/footer")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setfooter(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);
    const [jobsarray, setJobsarray] = useState([]);

    const [activeJob, setActiveJob] = useState(66);

    function changeActiveJob(index) {
        setActiveJob(index);
        const updatedElements = jobsarray.map((element) => {
            if (element.id === index) {
                return { ...element, image_alt: true };
            } else {
                return { ...element, image_alt: false };
            }
        });
        setJobsarray(updatedElements);
    }

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
            <Head title="Opportunities" />
            <div className="relative isolate bg-dark">
                <Navbars />
                <div aria-hidden="true" className="relative">
                    <img
                        src={"/app/webimages/" + getCareerHead?.background}
                        alt="jobs"
                        className="h-96 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>

                <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                        <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                            {/* CAREERS AT GOLD TIGER */}
                            {getCareerHead?.name}
                        </h2>
                        <div
                            className="mt-4 text-gray-300"
                            dangerouslySetInnerHTML={{
                                __html: getCareerHead?.description,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="relative isolate overflow-hidden  py-16 sm:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto mt-16    lg:mx-0 lg:mt-10 ">
                            <div className="relative lg:order-last lg:col-span-5">
                                <figure className="mb-10">
                                    <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                        {getCareerAttractive?.name}
                                        {/* Attractive package of conditions */}
                                    </h1>
                                    <div className="text-gray-200">
                                        <div
                                            className="mt-4 text-gray-300"
                                            dangerouslySetInnerHTML={{
                                                __html: getCareerAttractive?.description,
                                            }}
                                        ></div>
                                    </div>

                                    <ul
                                        role="list"
                                        className="mt-8 max-w-xl space-y-2 text-gray-300"
                                    >
                                        {getCareerAttractive?.elements?.map(
                                            (feature) => (
                                                <li
                                                    key={feature.name}
                                                    className="flex gap-x-3 items-center"
                                                >
                                                    <div className=" h-2 w-2 flex-none rounded-full bg-goldt" />
                                                    <span>{feature?.name}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </figure>
                            </div>
                            <div className=" text-base leading-7 text-gray-700 ">
                                <h1 className="mt-2 text-3xl pb-2 font-bold tracking-tight text-goldt sm:text-3xl">
                                    {getCareerSkills?.name}
                                </h1>
                                <div className="text-gray-300">
                                    <div
                                        className="mt-4 text-gray-300"
                                        dangerouslySetInnerHTML={{
                                            __html: getCareerSkills?.description,
                                        }}
                                    ></div>

                                    {getCareerSkills?.elements?.map(
                                        (feature) => (
                                            <a
                                                className="text-goldt font-bold"
                                                key={feature.name}
                                                href={feature.url}
                                            >
                                                <div
                                                    className="text-goldt font-bold"
                                                    dangerouslySetInnerHTML={{
                                                        __html: feature.content,
                                                    }}
                                                ></div>
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="">
                        <div className="relative isolate overflow-hidden  pb-16 sm:pb-16">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                <ul className="flex space-x-2 mt-5 border-b">
                                    {jobsarray?.map((job, index) => (
                                        <li
                                            key={job.id}
                                            className={`cursor-pointer text-xs sm:text-xl py-2 ${
                                                Boolean(job.image_alt) === true
                                                    ? "text-goldt border-b-4  border-goldd font-bold "
                                                    : "text-smooth  "
                                            }`}
                                            onClick={() =>
                                                changeActiveJob(job.id)
                                            }
                                        >
                                            <div className="px-2">
                                                {job.name}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="">
                                    {jobsarray?.map((job, index) =>
                                        Boolean(job.image_alt) === true ? (
                                            <div
                                                key={job.image_alt}
                                                className="mt-5 text-smooth"
                                                dangerouslySetInnerHTML={{
                                                    __html: job.content,
                                                }}
                                            ></div>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative isolate py-24 px-6 sm:py-24 lg:px-8">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
                        <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row items-center">
                            <div className="w-full lg:w-6/12">
                                <ContactForm />
                            </div>
                            <div className="lg:mt-6 w-full lg:w-6/12 flex flex-col gap-y-10 text-center items-center">
                                <div className=" flex flex-col items-center">
                                    <p className="text-6xl sm:text-[100px] font-bold  text-white">
                                        We Are
                                    </p>
                                    <p className="text-goldt text-7xl sm:text-[120px] leading-none font-bold mt-2">
                                        Hiring
                                    </p>
                                </div>
                                <div className="">
                                    <p className=" flex  text-white text-3xl sm:text-5xl">
                                        Join Our Team
                                    </p>
                                </div>
                                <img
                                    src={pallet}
                                    alt="pallet"
                                    className="w-full h-auto rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer getfooter={getfooter} />
            </div>
        </>
    );
}
