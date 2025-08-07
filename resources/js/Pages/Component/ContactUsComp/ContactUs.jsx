import ContactUsInfo from "./ContactUsInfo";
import ContactUsHubspot from "./ContactUsHubspot";

export default function ContactUs() {
    return (
        <div className="py-32">
            <div className=" lg:max-w-7xl mx-auto lg:gap-24 w-full">
                {/* <ContactUsForm /> */}
                <ContactUsInfo />
                <ContactUsHubspot />
            </div>
        </div>
    );
}
