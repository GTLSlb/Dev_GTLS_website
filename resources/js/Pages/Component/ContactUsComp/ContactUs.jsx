import ContactUsInfo from "./ContactUsInfo";
import ContactUsHubspot from "./ContactUsHubspot";

export default function ContactUs() {
    return (
        <div className="py-16">
            <div className=" lg:max-w-7xl mx-auto w-full">
                {/* <ContactUsForm /> */}
                <ContactUsInfo />
                <ContactUsHubspot />
            </div>
        </div>
    );
}
