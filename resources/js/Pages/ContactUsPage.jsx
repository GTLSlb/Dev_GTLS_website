import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import ContactUs from "./Component/ContactUsComp/ContactUs";

import { BounceLoader } from "react-spinners";
import { getFromStrapi } from "@/CommonFunctions";
import MainLayout from "@/Layouts/MainLayout";

export default function Capability(props) {
    const [getContactUsInfo, setContactUsInfo] = useState([]);
    const [getFormSection, setFormSection] = useState([]);
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
                    setContactUsInfo(contactUsReq.data.ContactInformation);
                    setFormSection(contactUsReq.data.FormSection);
                }
                // Set loading to false when all requests are completed
                setLoading(false);
            } catch (error) {
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
                <div className="bg-dark flex justify-center items-center h-screen">
                    {" "}
                    <BounceLoader color="#e2b540" />
                </div>
            ) : (
                <>
                    <MainLayout loading={loading}>
                        <Head title="Contact Us" />
                        <div className="relateive isolate bg-dark">
                            <ContactUs
                                getContactUsInfo={getContactUsInfo}
                                getFormSection={getFormSection}
                            />
                        </div>
                    </MainLayout>
                </>
            )}
        </>
    );
}
