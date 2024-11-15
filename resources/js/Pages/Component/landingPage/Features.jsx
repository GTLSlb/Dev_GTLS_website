import aboutcircle from "../../../assets/pictures/aboutcircle.webp";

export default function Features(props) {
    const getwhygtls = props.getwhygtls;
    return (
        <div className="bg-dark">
            <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="mt-20">
                    <dl className="space-y-16 sm:grid sm:grid-cols-4  sm:gap-x-6 sm:gap-y-16 sm:space-y-0 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-10 ">
                        <div className="col-span-4">
                            <div className=" text-4xl font-semibold leading-10 text-goldt">
                                {getwhygtls.Title}
                            </div>
                        </div>
                        {getwhygtls.values.map((faq) => (
                            <div
                                key={faq.id}
                                className="col-span-4 md:col-span-2 lg:col-span-1 border-l-[1px] shadow-2xl  pl-5 border-goldt transition-transform hover:scale-110 text-gray-300 hover:text-white hover:font-bold overflow-hidden"
                            >
                                <dd className="mt-2 text-md leading-7 relative ">
                                    <div className="absolute">
                                        <img
                                            className="opacity-50"
                                            width="w-full"
                                            src={aboutcircle}
                                            alt="circle"
                                        />
                                    </div>
                                    {faq.Description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
