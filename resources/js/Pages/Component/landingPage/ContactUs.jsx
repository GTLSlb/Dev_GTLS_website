import ContactUsForm from "./ContatcUsForm";

export default function ContatcUs(props) {
    const getContsct = props.getContsct;
    return (
        <div className="bg-dark mt-12">
            <div className="relative " id="contact">
                <div className="absolute opacity-40  bg-world bg-cover w-full h-full"></div>
                <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 items-center z-10">
                    <div className="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:py-24 lg:px-8 ">
                        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg ">
                            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden  lg:w-1/2"></div>
                            <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {getContsct?.name}
                                {/* Contact us */}
                            </h2>
                            <dl className="pl-5 mt-10 space-y-4 text-base leading-7 text-gray-300">
                                {/* <h2 className="text-xl font-bold tracking-tight text-gray-200">
                                Get in touch
                            </h2> */}
                                {getContsct?.elements?.map((item) => (
                                    <div key={item.id} className="flex gap-x-6">
                                        <dt className="flex-none">
                                            <span className="sr-only">
                                                Telephone
                                            </span>
                                            <div
                                                className="h-7 w-6 text-goldt"
                                                dangerouslySetInnerHTML={{
                                                    __html: item.icon,
                                                }}
                                            ></div>
                                        </dt>
                                        <dd>
                                            <a
                                                className="hover:text-goldt text-lg"
                                                href={item.url}
                                            >
                                                {item.name}
                                                <br />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.content,
                                                    }}
                                                ></div>
                                            </a>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                    <ContactUsForm />
                </div>
            </div>
        </div>
    );
}
