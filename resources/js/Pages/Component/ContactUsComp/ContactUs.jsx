import ContactUsInfo from "./ContactUsInfo";
import ContactUsForm from "./ContatcUsForm";

export default function ContatcUs() {
    return (
        <div className=" pt-8">
            <div className=" lg:max-w-7xl mx-auto gap-24 flex w-full">
                <ContactUsForm />
                <ContactUsInfo />
            </div>
        </div>
    );
}
