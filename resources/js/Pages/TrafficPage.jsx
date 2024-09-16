import { Head } from "@inertiajs/react";
import Footer from "./Component/landingPage/Footer";
import "../../css/gradient.css";
import { useState, useEffect } from "react";
import Navbars from "./Component/Navbars";
import GoogleMapComp from "@/Components/GoogleMap";

export default function TrafficPage() {
    const [getfooter, setfooter] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    // Footer
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
    return (
        <>
            <Head title="Traffic Notification" />
            <div className="relative isolate min-h-screen bg-dark">
                <Navbars />
                <GoogleMapComp />
            </div>
            <Footer getfooter={getfooter} />
        </>
    );
}
