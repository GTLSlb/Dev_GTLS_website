import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";

import Branches from "./Component/landingPage/branches";
import ContactUs from "./Component/landingPage/ContactUs";
import { BounceLoader } from "react-spinners";
import { getFromStrapi } from "@/CommonFunctions";
import MainLayout from "@/Layouts/MainLayout";

export default function Capability(props) {
    const [getContactUs, setContactUs] = useState([]);
    const [getContsct, setContsct] = useState([]);
    const [getBranch, setBranch] = useState([]);
    const [loading, setLoading] = useState(true);
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    useEffect(() => {
        const fetchData = async () => {
            try {
                const contactUsReq = await getFromStrapi(
                    `/api/contact-us?pLevel=4`
                );

                if (contactUsReq.success) {
                    console.log(contactUsReq.data);
                    setContactUs(contactUsReq.data);
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

    useEffect(() => {
        axios
            .get("/ContactPage")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setContsct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************

    return (
        <>
            {loading ? (
                <div className="bg-dark flex justify-center items-center h-screen">
                    {" "}
                    <BounceLoader color="#e2b540" />
                </div>
            ) : (
                <>
                    <MainLayout loading={loading}>
                        <Head title="Contact Us" />
                        <div className="relative isolate bg-dark">
                            <div aria-hidden="true" className="relative">
                                <img
                                    src={jobs}
                                    alt="jobs"
                                    className="h-10 w-full object-cover object-center "
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                            </div>
                            <ContactUs getContsct={getContsct} />
                            <Branches getBranch={getContactUs.BranchSection} />
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
