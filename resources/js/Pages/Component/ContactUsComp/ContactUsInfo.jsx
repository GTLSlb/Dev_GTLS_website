import { InboxStackIcon, PrinterIcon } from "@heroicons/react/20/solid";
import {
    BuildingOffice2Icon,
    PhoneIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

// Refactored JSON object for all contact information
const contactInfo = {
    general: [
        // {
        //     icon: PhoneIcon,
        //     label: "Telephone",
        //     value: "1800 04 03 06",
        //     href: "tel:+1800040306",
        // },
        {
            icon: InboxStackIcon,
            label: "Box Address",
            value: "Box 167, Hoxton Park, NSW 2171",
            href: "#",
        },
    ],
    branches: [
        {
            name: "SYDNEY BRANCH",
            address: "3B Inglis Road, Ingleburn, NSW 2565",
            addressLink: "https://maps.app.goo.gl/xbdQABuBBcCj9UBs9",
            phone: "1800 04 03 06",
            phoneLink: "tel:+1800040306",
        },
        {
            name: "MELBOURNE BRANCH",
            address: "60-70 Monash Drive, Dandenong South, VIC 3175",
            addressLink: "https://maps.app.goo.gl/Vjvqoqf9zE1U5CMY9",
            phone: "03 8764 7058",
            phoneLink: "tel:+0387647058",
        },
        {
            name: "BRISBANE BRANCH",
            address: "839 Beaudesert Road ARCHERFIELD QLD 4108",
            addressLink: "https://maps.app.goo.gl/26eN7YExv8PJrRxp9",
            phone: "07 3416 9744",
            phoneLink: "tel:+0734169744",
        },
    ],
};

export default function ContactUsInfo() {
    return (
        <div className="max-w-7xl mx-auto pb-8">
            <h2 className="text-4xl font-bold tracking-tight text-goldt text-center lg:text-left">
                Contact Us
            </h2>
            {/* General contact information section */}
            <div className="my-2 flex flex-wrap gap-x-6">
                {contactInfo.general.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 my-2">
                        <item.icon className="h-6 w-6 text-goldt" aria-hidden="true" />
                        <a
                            className="text-white hover:text-goldt text-lg"
                            href={item.href}
                        >
                            {item.value}
                        </a>
                    </div>
                ))}
            </div>

            {/* Branch contact information section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {contactInfo.branches.map((branch, index) => (
                    <div
                        key={index}
                        className="bg-white/5 p-6 rounded-lg space-y-4"
                    >
                        <div className="flex items-center gap-4">
                            <BuildingOffice2Icon className="h-7 w-7 text-goldt" />
                            <h3 className="text-xl font-bold text-gray-100">
                                {branch.name}
                            </h3>
                        </div>
                        <div className="space-y-2 text-gray-300 mt-4">
                            <div className="flex items-start gap-2">
                                <a
                                    href={branch.addressLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MapPinIcon className="h-6 w-6 text-goldt" />
                                </a>
                                <a
                                    href={branch.addressLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-goldt text-lg"
                                >
                                    {branch.address}
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={branch.phoneLink}>
                                    <PhoneIcon className="h-6 w-6 text-goldt" />
                                </a>
                                <a
                                    className="hover:text-goldt text-lg"
                                    href={branch.phoneLink}
                                >
                                    {branch.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}