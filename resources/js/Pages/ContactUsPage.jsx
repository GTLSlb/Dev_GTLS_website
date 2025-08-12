import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";

import Footer from "./Component/landingPage/Footer";
import Navbars from "@/Components/Navbars";
import ContactUs from "./Component/ContactUsComp/ContactUs";

export default function Capability(props) {
    const [getfooter, setfooter] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    // Footer

    useEffect(() => {
        axios
            .get("/footer")
            .then((response) => {
                setfooter(response.data);
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
            <Head title="Contact Us" />
            <div className="relative isolate bg-dark">
                <Navbars />
                <div className="pt-24">
                    <ContactUs />
                    <Footer getfooter={getfooter} />
                </div>
            </div>
        </>
    );
}
