import { Head } from "@inertiajs/react";
import aboutimage from "../assets/pictures/goldtiger-imad-elmasri-2.webp";
import jobs from "../assets/pictures/jobs.webp";
import pallet from "../assets/pictures/pallet.webp";
import Team from "../Pages/Component/landingPage/Team";
import { useState, useEffect } from "react";
import axios from "axios";

import Footer from "./Component/landingPage/Footer";
import Navbars from "./Component/navbars";
import { JsonTypes } from "@azure/msal-common/dist/utils/Constants";
import { parseJSON } from "date-fns";
import { json } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
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
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const [getfooter, setfooter] = useState([]);
    const [getHeader, setHeader] = useState([]);
    const [getCoreValue, setCoreValue] = useState([]);
    const [getSolutions, setSolutions] = useState([]);
    const [getTeam, setTeam] = useState([]);

    const [loading, setLoading] = useState(true); // Add this state to manage loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [
                    axios.get("/aboutPageHeader"),
                    axios.get("/aboutPageCoreValue"),
                    axios.get("/aboutPageSolutions"),
                    axios.get("/aboutPageTeam"),
                    axios.get("/footer"),
                ];

                // Execute all requests concurrently
                const responses = await Promise.all(requests);

                // Destructure responses array
                const [
                    headerResponse,
                    coreValueResponse,
                    solutionsResponse,
                    teamResponse,
                    footerResponse,
                ] = responses;

                // Set states with data
                setHeader(headerResponse.data);
                setCoreValue(coreValueResponse.data);
                setSolutions(solutionsResponse.data);
                setTeam(teamResponse.data);
                setfooter(footerResponse.data);

                // Set loading to false when all requests are completed
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
            }
        };

        fetchData();
    }, []);

    // Now you can use the loading state to conditionally render loading indicators or content

    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************

    const [showNavbar, setShowNavbar] = useState(false);

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
            {loading ? (
                <>
                    {" "}
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                </>
            ) : (
                <>
                    <Head title="About Gold Tiger" />
                    <div className="relative isolate bg-dark">
                        {/* <Chatbot /> */}
                        <Navbars />
                        {/* <HeroSection/> */}

                        <div
                            aria-hidden="true"
                            className="relative pt-20 w-full"
                        >
                            <img
                                src={"/app/webimages/" + getHeader[0]?.image}
                                alt={getHeader[0]?.image_alt}
                                className="pt-30 w-full h-96 object-cover object-top "
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
                                            {getHeader[0]?.name}
                                            {/* About Gold<span className="text-white">Tiger</span> */}
                                        </h1>
                                    </figure>
                                    <div
                                        className="mt-3 text-smooth"
                                        dangerouslySetInnerHTML={{
                                            __html: getHeader[0]?.description,
                                        }}
                                    ></div>

                                    {/* <p className="mt-3 text-smooth">
                                    Gold Tiger Logistics Solutions (Gold Tiger) was established in 2006 by the 19-year-old Imad El Masri, who was a truck enthusiast. He began with one truck and one driver – himself – and a first-year turnover of $50,000. Early in his career he became the youngest driver in Australia to earn a B-double licence.
                                </p>
                            <p className="mt-3 text-smooth">
                                With his passion for the business and his love of trucks, by the end of 2007 Mr El Masri had 10 trucks. By 2010 he had 20 trucks and had started doing interstate linehaul. The business’s continuing rapid growth prompted Mr El Masri to incorporate Gold Tiger in 2010.                            
                            </p>
                            <p className="mt-3 text-smooth">
                                Today, turnover is more than $55 million a year and growing. Gold Tiger’s wholly owned Volvo transport fleet has grown to more than 180 prime movers, 200 trailers and 40 delivery trucks and the workforce (drivers and administration) has passed 230. The growth, while rapid, has been strengthened by Mr El Masri’s decisions to use an all-employee driver workforce and to own his trucks, equipment and Sydney warehousing facilities.                            
                            </p>
                            <p className="mt-3 text-smooth">
                                Gold Tiger is also strengthened by its gold partner extended warranty contract with Volvo. The partnership includes a regular maintenance schedule to the highest manufacturer standards (OEM replacement parts), 24-hour breakdown repair around Australia, and replacement vehicles if trucks need to be off the road more than 24 hours. This is backed up by weekly checks and servicing by qualified mechanics in our own on-site workshops.
                            </p> */}

                                    <figure className="mb-5">
                                        <h2 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                            {getCoreValue?.name}
                                            {/* Core values */}
                                        </h2>
                                        <div
                                            className="mt-3 text-smooth"
                                            dangerouslySetInnerHTML={{
                                                __html: getCoreValue?.description,
                                            }}
                                        ></div>
                                        {/* <p className="mt-3 text-smooth">
                                    Commitment and dedication: we are dedicated and committed to delivering quality service, building lasting relationships and holding ourselves accountable.
                                </p> */}
                                    </figure>
                                    {getCoreValue?.elements?.map((feature) => (
                                        <div key={feature.id} className="mt-3 text-smooth pl-5">
                                            <span className="text-goldt font-bold">
                                                - {feature.name}
                                            </span>
                                            <div
                                                className="mt-3 text-smooth pl-5"
                                                dangerouslySetInnerHTML={{
                                                    __html: getCoreValue?.description,
                                                }}
                                            ></div>
                                        </div>
                                    ))}

                                    {/* <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Collaboration: </span>we highly value nurturing positive relationships at all levels of the company, cohesively and collaboratively. We work together across diverse teams to support and achieve our common goals.

                            </p> */}
                                    {/* <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Integrity and respect: </span> we highly value mutual respect and trust. Each team member brings unique skills and perspectives to the table; we take pride in this fact and act accordingly. We value communicating openly and honestly, making teammates feel appreciated and valued.
                            </p>
                            <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Customer service: </span> our customers are our solid foundation. We aim to build relationships that will make a positive difference in our customers’ businesses.
                            </p>
                            <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Sustainability: </span> we believe that we have the highest responsibility for the stewardship and protection of the environment. We aim to protect our most precious resources by taking steps to engage in sustainable business practices.
                            </p>
                            <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Communication: </span> we invest to get to the heart of our customers’ challenges. We are open and transparent in the way we work.
                            </p>
                            <p className="mt-3 text-smooth">
                                <span className="text-goldt font-bold">Creativity and innovation: </span> we are constantly developing better ways of working, thinking, learning and doing.
                            </p> */}

                                    <figure className="mb-10">
                                        <h1 className="mt-10 mb-4 text-3xl font-bold tracking-tight text-goldt sm:text-3xl">
                                            {getSolutions?.name}
                                            {/* Integrated solutions */}
                                        </h1>
                                    </figure>
                                    <div
                                        className="mt-3 text-smooth"
                                        dangerouslySetInnerHTML={{
                                            __html: getSolutions?.description,
                                        }}
                                    ></div>

                                    {/* <p className="mt-3 text-smooth">
                                Gold Tiger is an integrated transport, warehousing and distribution company. We provide independent, proactive logistics services that seamlessly integrate with our clients’ operations.
                            </p>
                            <p className="mt-3 text-smooth">
                                We do this through our fleet of Volvo trucks, our warehousing facilities in each state, our excellent use of technology, and our all-employee driving workforce that is committed exclusively to our clients.
                            </p>
                            <p className="mt-3 text-smooth">
                                Today, Gold Tiger transports more than 3.7 million tonnes of freight around Australia annually, with more than 800,000 tonnes moved for our largest client.
                            </p>
                            <p className="mt-3 text-smooth">
                                We have more than 40 clients from industries including food, packaging, manufacturing, retail, industrial and FMCG. Prominent clients include Unilever, General Mills, Sigma Healthcare, CIA Logistics, Triangle Logistics, TMA Group and Austral Bricks.
                            </p>
                            <p className="mt-3 text-smooth">
                                Gold Tiger will listen to what you want, offer our suggestions, and customise a solution with you that meets your needs.
                            </p>
                            <p className="mt-3 text-smooth">
                                Clients who work with us know they will get an authentic partner who will customise a unique solution to their business needs at a competitive price and proactively solve problems before they cost time and money. 
                            </p>
                            <p className="mt-3 text-smooth">
                                We methodically cover areas such as service levels, technology, communication, relationships, expectations, reporting, KPIs and documentation so that we become an integrated part of your business.
                            </p> */}
                                </div>
                            </div>
                        </div>
                        <Team getTeam={getTeam} />

                        <div className="text-smooth ">
                            {/* {
                getSec.map((sec)=>(<div>

                    <div dangerouslySetInnerHTML={
                                    { __html: sec.code }
                                } />
                    
                      
                    </div>))
                } */}
                        </div>

                        {/* <div className="text-smooth">{getSec?.data[1].title} </div> */}

                        <Footer getfooter={getfooter} />
                    </div>
                </>
            )}
        </>
    );
}
