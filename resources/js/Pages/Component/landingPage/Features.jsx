import aboutcircle from "../../../assets/pictures/aboutcircle.webp";
const faqs = [
    {
        id: 1,
        question: "",
        answer: "We have a can-do attitude to solving transport problems.",
    },
    {
        id: 2,
        question: "",
        answer: "We are flexible and able to tailor our services to our customers’ needs.",
    },
    {
        id: 3,
        question: "",
        answer: "We place an emphasis on developing personal relationships and the overall partnership.",
    },
    {
        id: 4,
        question: "",
        answer: "We have a flat management structure where customers can talk to the director whenever they want.",
    },
    {
        id: 5,
        question: "",
        answer: "We have a keen understanding of the transport and logistics industry, both at the client’s day-to-day level and how it is developing into the future.",
    },
    {
        id: 6,
        question: "",
        answer: "We are reliable, proactive and transparent in our business and our dealings with clients.",
    },
    {
        id: 7,
        question: "",
        answer: "Gold Tiger’s drivers are all employees, not contractors, which means they are exclusively dedicated to the needs of our clients.",
    },
    {
        id: 8,
        question: "",
        answer: "Gold Tiger owns its Sydney office, warehouse and its vehicle fleet.",
    },
    {
        id: 9,
        question: "",
        answer: "Driver and truck performance and location are monitored through Volvo’s Dynafleet on-board software package. The data produced is accessible to clients in real time.",
    },
    {
        id: 10,
        question: "",
        answer: "Our gold partnership with Volvo provides a regular maintenance schedule to the highest manufacturer standards (OEM replacement parts), 24-hour breakdown repair around Australia, and replacement vehicles if trucks need to be off the road more than 24 hours.",
    },
    {
        id: 11,
        question: "",
        answer: "We make excellent use of technology for track-and-trace, RFID and inventory management. We can integrate with client systems to provide access to extensive data and reports.",
    },
    {
        id: 12,
        question: "",
        answer: "Each client has a dedicated Account Manager, Allocator and Customer Service representative attached to their account.",
    },
    // More questions...
];

export default function Features() {
    return (
        <div className="bg-dark">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-4  sm:gap-x-6 sm:gap-y-16 sm:space-y-0 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-10 ">
                        <div className="col-span-4">
                            <div className=" text-4xl font-semibold leading-10 text-goldt">
                                Why Gold<span className="text-white"> Tiger</span>?
                            </div>
                        </div>
                        {faqs.map((faq) => (

                        <div key={faq.id} className="col-span-4 md:col-span-2 lg:col-span-1 border-l-[1px] shadow-2xl  pl-5 border-goldt transition-transform hover:scale-110 text-gray-300 hover:text-white hover:font-bold overflow-hidden" >
                            <dt className="text-xl font-semibold leading-7 text-goldt">
                                {faq.question}
                            </dt>
                            <dd className="mt-2 text-md leading-7 relative ">
                                <div className="absolute">
                                    <img className="opacity-50" width="w-full"src={aboutcircle} alt="circle" />
                                </div>
                                
                                {faq.answer}
                            </dd>
                        </div>

                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
