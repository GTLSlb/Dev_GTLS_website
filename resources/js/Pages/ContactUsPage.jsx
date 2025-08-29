import { Head } from "@inertiajs/react";
import Footer from "./Component/landingPage/Footer";
import Navbars from "./Component/Navbars";
import ContactUs from "./Component/ContactUsComp/ContactUs";

export default function Capability(props) {
    return (
        <>
            <Head title="Contact Us" />
            <div className="relative isolate bg-dark">
                <Navbars />
                <div className="pt-24">
                    <ContactUs />
                    <Footer />
                </div>
            </div>
        </>
    );
}
