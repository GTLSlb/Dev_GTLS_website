import { Head } from "@inertiajs/react";
import Team from "../Pages/Component/landingPage/Team";
import { useState, useEffect } from "react";
import axios from "axios";

import Footer from "./Component/landingPage/Footer";
import BounceLoader from "react-spinners/BounceLoader";
import Navbars from "@/Components/Navbars";

export default function AboutUs(props) {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    const [getfooter, setfooter] = useState([]);
    const [getTeam, setTeam] = useState([]);
    const [aboutBody, setaboutBody] = useState();
    const [loading, setLoading] = useState(true); // Add this state to manage loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requests = [
                    axios.get(
                        "http://localhost:1337/api/team?populate=%2A",
                        {
                            headers: {
                                Authorization: `Bearer a52291dd122f236acd4ec2068ff84a8efb1bb6e61000effcb15ba104e53101656eeaba4be6ccf1fb93f15bddbe6ec430f4e08e4be3c4a073067446b86444d7684cd55098e354236e860894e0d31b1c049e43a0a1531415cfd59c8debd9d5ba34315561fa2dbd2457810d5179ebff4a753bbda0ccc5c038d8a0593a3830d71264`,
                            },
                        }
                    ),
                    axios.get("/footer"),
                    axios.get(
                        "http://localhost:1337/api/aboutus?populate=%2A",
                        {
                            headers: {
                                Authorization: `Bearer a52291dd122f236acd4ec2068ff84a8efb1bb6e61000effcb15ba104e53101656eeaba4be6ccf1fb93f15bddbe6ec430f4e08e4be3c4a073067446b86444d7684cd55098e354236e860894e0d31b1c049e43a0a1531415cfd59c8debd9d5ba34315561fa2dbd2457810d5179ebff4a753bbda0ccc5c038d8a0593a3830d71264`,
                            },
                        }
                    ),
                ];

                // Execute all requests concurrently
                const [teamResponse, footerResponse, aboutResponse] =
                    await Promise.all(requests);

                // Set state for each response
                setTeam(teamResponse.data.data);
                setfooter(footerResponse.data);
                setaboutBody(aboutResponse.data.data);

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
                        <Navbars />
                        <div
                            aria-hidden="true"
                            className="relative pt-20 w-full"
                        >
                            <img
                                src={
                                    "http://localhost:1337" +
                                    aboutBody.herosection.url
                                }
                                alt={aboutBody.herosection.formats.large.name}
                                className="pt-30 w-full h-96 object-cover "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                        </div>
                        <div className="py-2 sm:py-32 px-1 sm:pb-1">
                            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                                {" "}
                                <div
                                    className=""
                                    dangerouslySetInnerHTML={{
                                        __html: aboutBody.Body,
                                    }}
                                ></div>
                            </div>
                        </div>
                        <Team getTeam={getTeam} />
                        <div className="text-smooth "></div>
                        <Footer getfooter={getfooter} />
                    </div>
                </>
            )}
        </>
    );
}
