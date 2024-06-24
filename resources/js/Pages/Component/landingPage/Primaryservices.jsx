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


export default function PrimaryServices(props) {
    const getservices = props.getservices;
    const setServices = props.setServices;




    return (
        <div className="bg-dark mt-[100px] pb-12 " id="services">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto pt-10 w-full">
                    <div className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                        {getservices ? getservices.name:null}
                    </div>
                    <div className="mt-6 text-base  text-gray-300">
                        <div className="mt-6  text-base  text-gray-300" dangerouslySetInnerHTML={{ __html: getservices?.description }}></div>
                    </div>
                </div>
      
                <div className="mx-auto mt-16  sm:mt-20 ">
                    <div className="grid max-w-xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {getservices?.elements?.map((feature) => (
                            <div key={feature.name} className="  relative  flex flex-col lg:flex-row ">
                                <div className=" top-0 left-0 flex mr-5 h-auto w-1/4 items-center mb-1 md:mb-0  rounded-lg ">
                                    <img className="w-full" src={"/app/webimages/"+feature.image} alt="" />
                                </div>
                                <div className="w-3/4 border-l border-goldt border-opacity-30 pl-5">
                                    <div className="text-2xl font-semibold leading-7 text-goldt">
                                        {feature.name}
                                    </div>
                                    <div className="mt-1 text-base text-gray-300">
                                        <div className="" dangerouslySetInnerHTML={{ __html: feature.content }}></div>
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


