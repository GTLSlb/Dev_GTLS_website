import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";

defineElement(lottie.loadAnimation);

export default function PrimaryServices(props) {
    const getservices = props.getservices;
    const strapiURL = window.Laravel.strapiAppUrl;

    return (
        <div className="bg-dark lg:mt-[100px] pb-12 " id="services">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <div className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        {getservices ? getservices.Title : null}
                    </div>
                    <div className="mt-6 text-base  text-gray-300">
                        <div
                            className="mt-6  text-base  text-gray-300"
                            dangerouslySetInnerHTML={{
                                __html: getservices?.Description,
                            }}
                        ></div>
                    </div>
                </div>

                <div className="mx-auto mt-16  sm:mt-20 ">
                    <div className="grid  grid-cols-1 gap-y-10 gap-x-8  md:grid-cols-2 lg:gap-y-16">
                        {getservices?.services?.map((feature) => (
                            <div
                                key={feature.id}
                                className="  relative  flex flex-col lg:flex-row "
                            >
                                <div className=" top-0 left-0 flex mr-5 h-auto w-1/4 items-center mb-1 md:mb-0  rounded-lg ">
                                    <img
                                        className="w-full"
                                        src={strapiURL + feature.Icon.url}
                                        alt=""
                                    />
                                </div>
                                <div className="w-3/4 border-l border-goldt border-opacity-30 pl-5">
                                    <div className="text-2xl font-semibold leading-7 text-goldt">
                                        {feature.Title}
                                    </div>
                                    <div className="mt-1 text-base text-gray-300">
                                        <div
                                            className=""
                                            dangerouslySetInnerHTML={{
                                                __html: feature.Description,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
