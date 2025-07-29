import ContactUsForm from "./ContactUsForm";
import ContactUsInfo from "./ContactUsInfo";
import ContactUsHubspot from "./ContactUsHubspot";

export default function ContatcUs() {
    return (
        <div className=" pt-8">
            <ContactUsHubspot />
            <div className=" lg:max-w-7xl mx-auto lg:gap-24 flex flex-col-reverse lg:flex-row w-full">
                <ContactUsForm />
                <ContactUsInfo />
            </div>
        </div>
    );
}
