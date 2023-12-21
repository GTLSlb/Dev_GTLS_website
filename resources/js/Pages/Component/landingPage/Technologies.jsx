import technologies from "../../../assets/pictures/goldtiger_technologies.webp";
import technologiess from "../../../assets/pictures/goldtiger_technologies-2.png";
import Tech from "../../../assets/partners/volvo.webp";
import haccp from "../../../assets/partners/haccp.webp";
import JAIX from "../../../assets/partners/JAIX.webp";
import nhvr from "../../../assets/partners/nhvr.webp";
import hvac from "../../../assets/partners/hvac.webp";
import navman from "../../../assets/partners/Navman-logo.webp";
const features = [
    {
        name: "Sleek design",
        description:
            "Technology plays an important role in Gold Tiger’s commitment to continuous improvement. It enables us to deliver transparent and responsive services and keeps us accountable for the commitments we make to our clients.",
    },
  
];

export default function Technologies() {
    return (
        <div className="overflow-hidden relative bg-dark py-10" id="technologies">
            
            <div className="mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col justify-center  lg:flex-row items-center gap-y-16  ">
                    <div className="h-auto w-12/12   md:w-1/2 md:pr-16">
                        <a href="https://www.volvotrucks.com.au/en-au/" target="_blank">
                            <img
                                src={technologies}
                                alt="volvo"
                                className="h-auto sm:h-auto w-full"
                            />
                        </a>
                    </div>

                    <div className="w-full md:w-1/2  border-l-4 border-goldt pl-5 lg:pl-16">
                        <div className=" pb-2">
                            <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                Technologies
                            </p>
                            <h2 className="text-gray-100 mt-2 font-bold">
                                Modern technologies for an accountable service
                            </h2>
                        </div>

                        <dl className="mt-5 ">
                            {features.map((feature) => (
                                <div key={feature.name}>
                                    {/* <dt className="text-sm font-medium text-gray-900">{feature.name}</dt> */}
                                    <dd
                                        className=" text-base text-gray-300"
                                        dangerouslySetInnerHTML={{
                                            __html: feature.description,
                                        }}
                                    ></dd>
                                </div>
                            ))}
                        </dl>
                        <div className="text-goldt mt-3">
                            <a href={"/technologies"} className="text-sm leading-6 text-goldl hover:text-white">
                                Read More
                            </a>
                        </div>
                        <h2 className="mt-10 text-xl font-bold text-goldt">
                            IT services
                        </h2>
                        <p className=" text-base text-gray-300">
                            Gold Tiger is developing a new IT infrastructure that will provide enhanced security measures for our systems and customer information.
                        </p>

                        <div className="text-goldt mt-3">
                            <a href={"/technologies"} className="text-sm leading-6 text-goldl hover:text-white">
                                Read More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0  right-[-20rem]"> 
                <img src={technologiess} alt="volvo" className="h-[60rem] opacity-20"/>
            </div>
        </div>
    );
}
