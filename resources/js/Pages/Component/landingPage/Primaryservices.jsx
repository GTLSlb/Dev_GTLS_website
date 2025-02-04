import {
    RectangleGroupIcon,
    BoltIcon,
    MapIcon,
    ArrowPathRoundedSquareIcon,
} from "@heroicons/react/24/outline";
import bolt from "../../../assets/json/bolt.json";
import lottie from "lottie-web";
import home from "../../../assets/pictures/home.gif";
import pl from "../../../assets/pictures/3pl-4pl.gif";
import earth from "../../../assets/pictures/distribution.gif";
import trans from "../../../assets/pictures/transport.gif";
import mix from "../../../assets/json/mix.json"
import { defineElement } from "lord-icon-element";
{/* <lord-icon
    src="https://cdn.lordicon.com/qeltvbrs.json"
    trigger="hover"
    colors="primary:#c79816,secondary:#f4dc9c"
    style="width:250px;height:250px">
</lord-icon> */}
defineElement(lottie.loadAnimation);
const features = [
   
    {
        name: "Warehousing",
        description:
            "Short or long-term storage solutions, container handling and cross-docking in warehouses around Australia. Check and manage your inventory in our warehouses through your computer system’s interface with our JAIX warehouse management system.",
            icon: home,
        state: "",
    },
    
    {
        name: "Transport",
        description:
            "Interstate linehaul, intrastate, cross dock, regional, metropolitan and last-mile delivery, express or general, all-around Australia.",
            icon: trans,
        state: "morph",
    },
    {
        name: "3PL/4PL solutions",
        description:
            "Gold Tiger offers solutions based on the third party and fourth party logistics models.",
            icon: pl,
        state: "",
    },
    {
        name: "Distribution",
        description:
            "Distribute from our warehouses to your distribution hubs or let us deliver that last mile to your individual stores. We use leading technologies throughout our operations, from track-and-trace through to RF Scanning, customer portal, EDI, ePOD, sign-on glass and inventory management software.",
            icon: earth,
        state: "",
    },
    
];

export default function PrimaryServices() {
    return (
        <div className="bg-dark mt-[100px] pb-12 " id="services">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        Services
                    </p>
                    <p className="mt-6 text-base  text-gray-300">
                        Whether you need us for a single service – transport,
                        line haul, warehousing, distribution – or an end-to-end
                        3PL or 4PL solution, Gold Tiger can customise its
                        service offering to meet your business’s requirements.
                        We will listen to what you want, offer our suggestions
                        and devise competitive pricing for a top-quality
                        service. Our team has expertise and experience in
                        transition management, which means bringing your
                        business to us can be done with the least possible
                        disruption to your customers.
                    </p>
                </div>
                <div className="mx-auto mt-16  sm:mt-20 ">
                    <div className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="  relative  flex flex-col lg:flex-row "
                            >
                                <div className=" top-0 left-0 flex mr-5 h-auto w-1/4 items-center mb-1 md:mb-0  rounded-lg ">
                                    {/* <lord-icon
                                        trigger="hover"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                        }}
                                        // colors="primary:#c79816,secondary:#000000"
                                        // colors='primary:#c79816,secondary:#f4dc9c'
                                        colors="primary:#8930e8,secondary:#f4dc9c"
                                       
                                        src={feature.icon}
                                        state={feature.state}
                                    ></lord-icon> */}
                                    <img className="w-full" src={feature.icon} alt="" />


                                    
                                </div>
                                <div className="w-3/4 border-l border-goldt border-opacity-30 pl-5">
                                    <div className="text-2xl font-semibold leading-7 text-goldt">
                                        {feature.name}
                                    </div>
                                    <div className="mt-1 text-base text-gray-300">
                                        {feature.description}
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
