import { Head } from "@inertiajs/react";
import pallet from "../assets/pictures/pallet.webp";
import { useState, useEffect } from "react";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import { BounceLoader } from "react-spinners";
import { getFromStrapi } from "@/CommonFunctions";
import MainLayout from "@/Layouts/MainLayout";

export default function Opportunities(props) {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    const [getCareers, setCareers] = useState();
    const [loading, setLoading] = useState(true); // Add this state to manage loading state
    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const careerReq = await getFromStrapi(`/api/career?pLevel=4`);

                if (careerReq.success) {
                    setJobsarray(careerReq.data.positions);
                    setCareers(careerReq.data);
                }
                // Set loading to false when all requests are completed
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
                setLoading(false); // Set loading to false if there's an error
            }
        };

        fetchData();
    }, []);

    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************
    const [jobsarray, setJobsarray] = useState([]);

    const [activeJob, setActiveJob] = useState(jobsarray[0]?.id);

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

    return (
        <>
            {loading ? (
                <>
                    {" "}
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>{" "}
                </>
            ) : (
                <>
                    <MainLayout>
                        <Head title="Opportunities" />
                        <div className="relative isolate bg-dark">
                            <div aria-hidden="true" className="relative">
                                <img
                                    src={
                                        strapiApiUrl +
                                        getCareers?.HeroSection.url
                                    }
                                    alt={
                                        strapiApiUrl +
                                        getCareers?.HeroSection.alternativeText
                                    }
                                    className="h-96 w-full object-cover object-center "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                            </div>

                            <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
                                <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
                                    <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                        {getCareers?.Introduction.Title}
                                    </h2>
                                    <div
                                        className="mt-4"
                                        dangerouslySetInnerHTML={{
                                            __html: getCareers?.Introduction
                                                .Description,
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
                                                    {
                                                        getCareers
                                                            .WorkConditions
                                                            .Title
                                                    }
                                                </h1>
                                                <div className="">
                                                    <div
                                                        className="mt-4"
                                                        dangerouslySetInnerHTML={{
                                                            __html: getCareers
                                                                ?.WorkConditions
                                                                .Description,
                                                        }}
                                                    ></div>
                                                </div>
                                            </figure>
                                        </div>
                                        <div className=" text-base leading-7 text-gray-700 ">
                                            <h1 className="mt-2 text-3xl pb-2 font-bold tracking-tight text-goldt sm:text-3xl">
                                                {
                                                    getCareers?.RelevantSkills
                                                        .Title
                                                }
                                            </h1>
                                            <div className="text-gray-300">
                                                <div
                                                    className="mt-4 text-gray-300"
                                                    dangerouslySetInnerHTML={{
                                                        __html: getCareers
                                                            ?.RelevantSkills
                                                            .Description,
                                                    }}
                                                ></div>
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
                                                {jobsarray?.map(
                                                    (job, index) => (
                                                        <li
                                                            key={job.id}
                                                            className={`cursor-pointer list-none text-xs sm:text-xl py-2 ${
                                                                Boolean(
                                                                    job.image_alt
                                                                ) === true
                                                                    ? "text-goldt border-b-4  border-goldd font-bold "
                                                                    : "text-smooth  "
                                                            }`}
                                                            onClick={() =>
                                                                changeActiveJob(
                                                                    job.id
                                                                )
                                                            }
                                                        >
                                                            <div className="px-2">
                                                                {
                                                                    job.PositionTitle
                                                                }
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                            <div className="">
                                                {jobsarray?.map((job, index) =>
                                                    Boolean(job.image_alt) ===
                                                    true ? (
                                                        <div
                                                            key={job.image_alt}
                                                            className="mt-5 text-smooth"
                                                            dangerouslySetInnerHTML={{
                                                                __html: job.PositionDetails,
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
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
