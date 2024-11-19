import { Head } from "@inertiajs/react";
import Team from "../Pages/Component/landingPage/Team";
import { useState, useEffect } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import MainLayout from "@/Layouts/MainLayout";
import { getFromStrapi } from "@/CommonFunctions";

export default function AboutUs(props) {
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    const [getTeam, setTeam] = useState([]);
    const [aboutBody, setaboutBody] = useState();
    const [loading, setLoading] = useState(true); // Add this state to manage loading state
    const strapiApiUrl = window.Laravel.strapiAppUrl;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const aboutUsReq = await getFromStrapi(`/api/aboutus?pLevel=4`);

                if (aboutUsReq.success) {
                    setaboutBody(aboutUsReq.data);
                    setTeam(aboutUsReq.data.Team)
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
                    <MainLayout alt loading={loading}>
                        <Head title="About Gold Tiger" />
                        <div className="relative isolate bg-dark">
                            <div
                                aria-hidden="true"
                                className="relative pt-20 w-full"
                            >
                                <img
                                    src={
                                        strapiApiUrl +
                                        aboutBody.herosection.url
                                    }
                                    alt={
                                        aboutBody.herosection.formats.large.name
                                    }
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
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
