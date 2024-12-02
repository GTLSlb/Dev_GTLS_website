import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";

import Branches from "./Component/landingPage/branches";
import ContatcUs from "./Component/ContactUsComp/ContactUs";

import Footer from "./Component/landingPage/Footer";
import Navbars from "./Component/Navbars";


export default function Capability(props) {

    return (
        <>
            <Head title="Contact Us" />
            <div className="relative isolate bg-dark">
                {/* <Chatbot /> */}
                <Navbars />
                <ContatcUs />
                {/* <Branches /> */}
                <Footer />
            </div>
        </>
    );
}
