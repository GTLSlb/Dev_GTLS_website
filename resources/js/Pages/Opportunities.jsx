import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { BounceLoader } from "react-spinners";
import ContactForm from "./Component/landingPage/ContactForm";
import MainLayout from "@/Layouts/MainLayout";
import { getFromStrapi } from "@/CommonFunctions";
import pallet from "../assets/pictures/pallet.webp";

// Hero Section Component
const strapiApiUrl = window.Laravel.strapiAppUrl;

const HeroSection = ({ heroSection }) => (
    <div className="relative isolate bg-dark">
        <div aria-hidden="true" className="relative">
            <img
                src={strapiApiUrl + heroSection?.url}
                alt={heroSection?.alternativeText}
                className="h-96 w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
        </div>
    </div>
);

// Introduction Section Component
const IntroductionSection = ({ introduction }) => (
    <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                {introduction?.Title}
            </h2>
            <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: introduction?.Description }}
            />
        </div>
    </div>
);

// Work Conditions Section Component
const WorkConditionsSection = ({ workConditions }) => (
    <div className="relative isolate overflow-hidden py-16 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="lg:order-last lg:col-span-5">
                <h1 className="mt-2 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                    {workConditions?.Title}
                </h1>
                <div
                    className="mt-4"
                    dangerouslySetInnerHTML={{
                        __html: workConditions?.Description,
                    }}
                />
            </div>
        </div>
    </div>
);

// Relevant Skills Section Component
const RelevantSkillsSection = ({ relevantSkills }) => (
    <div className="relative isolate overflow-hidden py-16 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h1 className="mt-2 text-3xl pb-2 font-bold tracking-tight text-goldt sm:text-3xl">
                {relevantSkills?.Title}
            </h1>
            <div
                className="mt-4 text-gray-300"
                dangerouslySetInnerHTML={{
                    __html: relevantSkills?.Description,
                }}
            />
        </div>
    </div>
);

// Jobs List Section Component
const JobsListSection = ({ jobsArray, activeJob, changeActiveJob }) => (
    <div className="relative isolate overflow-hidden pb-16 sm:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <ul className="flex space-x-2 mt-5 border-b">
                {jobsArray.map((job) => (
                    <li
                        key={job.id}
                        className={`cursor-pointer list-none text-xs sm:text-xl py-2 ${
                            job.image_alt
                                ? "text-goldt border-b-4 border-goldd font-bold"
                                : "text-smooth"
                        }`}
                        onClick={() => changeActiveJob(job.id)}
                    >
                        <div className="px-2">{job.PositionTitle}</div>
                    </li>
                ))}
            </ul>
            <div className="mt-5 text-smooth">
                {jobsArray.map((job) =>
                    job.image_alt ? (
                        <div
                            key={job.id}
                            dangerouslySetInnerHTML={{
                                __html: job.PositionDetails,
                            }}
                        />
                    ) : null
                )}
            </div>
        </div>
    </div>
);

// Contact Section Component
const ContactSection = () => (
    <div className="relative isolate py-24 px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mt-16 flex flex-col gap-16 sm:gap-y-20 lg:flex-row items-center">
                <div className="w-full lg:w-6/12">
                    <ContactForm />
                </div>
                <div className="lg:mt-6 w-full lg:w-6/12 flex flex-col gap-y-10 text-center items-center">
                    <div className="flex flex-col items-center">
                        <p className="text-6xl sm:text-[100px] font-bold text-white">
                            We Are
                        </p>
                        <p className="text-goldt text-7xl sm:text-[120px] leading-none font-bold mt-2">
                            Hiring
                        </p>
                    </div>
                    <p className="flex text-white text-3xl sm:text-5xl">
                        Join Our Team
                    </p>
                    <img
                        src={pallet}
                        alt="pallet"
                        className="w-full h-auto rounded-md"
                    />
                </div>
            </div>
        </div>
    </div>
);

// Main Opportunities Component
export default function Opportunities(props) {
    const [getCareers, setCareers] = useState();
    const [loading, setLoading] = useState(true);
    const [jobsArray, setJobsArray] = useState([]);
    const [activeJob, setActiveJob] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const careerReq = await getFromStrapi(`/api/career?pLevel=4`);
                if (careerReq.success) {
                    setJobsArray(
                        careerReq.data.positions.map((job, index) => ({
                            ...job,
                            image_alt: index === 0, // Default active job
                        }))
                    );
                    setActiveJob(careerReq.data.positions[0]?.id);
                    setCareers(careerReq.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const changeActiveJob = (jobId) => {
        setActiveJob(jobId);
        setJobsArray((prevJobs) =>
            prevJobs.map((job) => ({
                ...job,
                image_alt: job.id === jobId,
            }))
        );
    };

    return (
        <>
            {loading ? (
                <div className="bg-dark flex justify-center items-center h-screen">
                    <BounceLoader color="#e2b540" />
                </div>
            ) : (
                <MainLayout>
                    <Head title="Opportunities" />
                    <div className="bg-dark">
                        <HeroSection heroSection={getCareers.HeroSection} />
                        <IntroductionSection
                            introduction={getCareers?.Introduction}
                        />
                        <WorkConditionsSection
                            workConditions={getCareers?.WorkConditions}
                        />
                        <RelevantSkillsSection
                            relevantSkills={getCareers?.RelevantSkills}
                        />
                        <JobsListSection
                            jobsArray={jobsArray}
                            activeJob={activeJob}
                            changeActiveJob={changeActiveJob}
                        />
                        <ContactSection />
                    </div>
                </MainLayout>
            )}
        </>
    );
}
