import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";
import News from "./Component/landingPage/News";
import { getFromStrapi } from "@/CommonFunctions";
import { BounceLoader } from "react-spinners";
import MainLayout from "@/Layouts/MainLayout";

export default function Newss(props) {
    const [loading, setLoading] = useState(true);
    const [getPosts, setPosts] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    useEffect(() => {
        const fetchData = async () => {
            const result = await getFromStrapi(`/api/news-post?pLevel=4`);
            if (result.success) {
                setPosts(result.data);
                setLoading(false);
            } else {
                console.error("Fetch failed:", result.error);
                setLoading(false);
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
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                </>
            ) : (
                <MainLayout loading={loading}>
                    <Head title="News Gold Tiger" />
                    <div className="relative isolate bg-dark">
                        <div aria-hidden="true" className="relative">
                            <img
                                src={jobs}
                                alt="jobs"
                                className="h-2 w-full object-cover object-center "
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                        </div>
                        <News getPosts={getPosts} />
                    </div>
                </MainLayout>
            )}
        </>
    );
}
