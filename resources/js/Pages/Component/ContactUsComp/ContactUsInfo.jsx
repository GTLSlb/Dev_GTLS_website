import {
    BuildingOffice2Icon,
    EnvelopeIcon,
    PhoneIcon,
    PrinterIcon,
    InboxStackIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

export default function ContactUsInfo() {
    return (
        <div className="max-lg:px-8 pb-4 pt-20 sm:pb-32 lg:py-24 z-10  w-full">
            <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg py-8 w-full">
                <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                    Contact us
                </h2>
                <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300  w-full">
                    {/* <h2 className="text-xl font-bold tracking-tight text-gray-200">
                                Get in touch
                            </h2> */}
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Telephone</span>
                            <PhoneIcon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <a
                                className="hover:text-goldt text-lg"
                                href="tel:+1800 04 03 06"
                            >
                                1800 04 03 06
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Telephone</span>
                            <PrinterIcon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <a
                                className="hover:text-goldt text-lg"
                                href="tel:+02 9605 1700"
                            >
                                02 9605 1700
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Telephone</span>
                            <InboxStackIcon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd>
                            <a className=" text-lg" href="#">
                                Box 167, Hoxton Park, NSW 2171
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Telephone</span>
                            <BuildingOffice2Icon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd className="text-lg w-full">
                            SYDNEY BRANCH
                            <br />
                            <div className="flex items-center gap-2">
                                {" "}
                                3B Inglis Road, Ingleburn, NSW 2565{" "}
                                <a
                                    href="https://maps.app.goo.gl/xbdQABuBBcCj9UBs9"
                                    target={"_blank"}
                                >
                                    <MapPinIcon className="h-7 w-6 text-goldt" />
                                </a>
                            </div>
                            <a
                                className="hover:text-goldt text-lg"
                                href="tel:+1800 04 03 06"
                            >
                                1800 04 03 06
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6">
                        <dt className="flex-none">
                            <span className="sr-only">Location</span>
                            <BuildingOffice2Icon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd className="text-lg  w-full">
                            MELBOURNE BRANCH
                            <br />
                            <div className="flex items-center gap-2">
                                {" "}
                                60-70 Monash Drive, Dandenong South, VIC 3175
                                <a
                                    href="https://maps.app.goo.gl/Vjvqoqf9zE1U5CMY9"
                                    target={"_blank"}
                                >
                                    <MapPinIcon className="h-7 w-6 text-goldt" />
                                </a>
                            </div>
                            <a
                                className="hover:text-goldt text-lg"
                                href="tel:+03 8764 7058"
                            >
                                03 8764 7058
                            </a>
                        </dd>
                    </div>
                    <div className="flex gap-x-6  w-full">
                        <dt className="flex-none">
                            <span className="sr-only">Location</span>
                            <BuildingOffice2Icon
                                className="h-7 w-6 text-goldt"
                                aria-hidden="true"
                            />
                        </dt>
                        <dd className="text-lg  w-full">
                            BRISBANE BRANCH
                            <br />
                            <div className="flex items-center gap-2">
                                {" "}
                                839 Beaudesert Road ARCHERFIELD QLD 4108
                                <a
                                    href="https://maps.app.goo.gl/26eN7YExv8PJrRxp9"
                                    target={"_blank"}
                                >
                                    <MapPinIcon className="h-7 w-6 text-goldt" />
                                </a>
                            </div>
                            {/* <a
                                className="hover:text-goldt text-lg"
                                href="tel:+1800 04 03 06"
                            >
                                1800 04 03 06
                            </a> */}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
