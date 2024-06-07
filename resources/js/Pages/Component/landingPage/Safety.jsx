import Safetyimg from "../../../assets/backgrounds/safety-and-compliences.webp";



export default function Safety(props) {
    const getSafety = props.getSafety;
    const Safetybackground= {
        backgroundImage: 'url("/app/webimages/ffcKcQospNDx6hOe1UGNaPcDtu7CqnAuuLy4Vafw.webp")',
        backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    };
    
    
    return (
        <div className=" bg-fixed bg-cover" id="technologies" style={Safetybackground}>
            <div className="relative">

                <div className="bg-black opacity-70  absolute w-full top-0 bottom-0"></div>
                
                
                <div className=" mx-auto max-w-2xl  py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl ">
                    <div className="relative w-full  border-goldt ">
                        <div className=" pb-2">
                            <div className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                {/* Safety and compliance */}
                                {getSafety[0]?.name}
                            </div>
                            <div className="text-gray-100 mt-2 font-bold" dangerouslySetInnerHTML={{ __html: getSafety[0]?.description }}>
                                
                                {/* Gold Tiger remains committed to the safety of all road users. As part of our ongoing safety innovation program, we have made a significant enhancement to our safety practices through the integration of two state-of-the-art weighbridge systems.
                                The latest of these cutting-edge weighbridges, recently installed in the Sydney depot, complements a similar unit introduced last year in the Melbourne depot.
                                With the introduction of this second weighbridge, a remarkable 80% of all interstate linehaul movements now undergo thorough checks before departing from our depots, enabling us to proactively prevent overloaded vehicles from taking to the roads. */}
                            </div>
                            <div className="text-goldt mt-3">
                                <a href={getSafety[0]?.url} className="text-sm leading-6 text-goldl hover:text-white">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
        </div>
    );
}
