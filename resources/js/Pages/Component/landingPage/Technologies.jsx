// import technologies from "../../../assets/pictures/goldtiger_technologies.webp";
// import technologiess from "../../../assets/pictures/goldtiger_technologies-2.png";
// import Tech from "../../../assets/partners/volvo.webp";
// import haccp from "../../../assets/partners/haccp.webp";
// import JAIX from "../../../assets/partners/JAIX.webp";
// import nhvr from "../../../assets/partners/nhvr.webp";
// import hvac from "../../../assets/partners/hvac.webp";
// import navman from "../../../assets/partners/Navman-logo.webp";


export default function Technologies(props) {
    const gettechnologies = props.gettechnologies;


    // const features = [
    // {
    //     name: "Sleek design",
    //     description:
    //         "Technology plays an important role in Gold Tiger’s commitment to continuous improvement. It enables us to deliver transparent and responsive services and keeps us accountable for the commitments we make to our clients.",
    // },
    // const features = [
    //     {
    //         name: "Sleek design",
    //         description:
    //             "Technology plays an important role in Gold Tiger’s commitment to continuous improvement. It enables us to deliver transparent and responsive services and keeps us accountable for the commitments we make to our clients.",
    //     },
  
// ];
    return (
        <div className="overflow-hidden relative bg-dark py-10" id="technologies">
            
            <div className="mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col justify-center  lg:flex-row items-center gap-y-16  ">

                    <div className="h-auto w-12/12   md:w-1/2 md:pr-16">

                        <a href="/technologies" target="_blank">
                            <img
                                src={"/app/webimages/"+gettechnologies?.image}
                                alt={gettechnologies?.image_alt}
                                className="h-auto sm:h-auto w-full"
                            />
                        </a>
                    </div>
   
   

                    <div className="w-full md:w-1/2  border-l-4 border-goldt pl-5 lg:pl-16">
                        <div className=" pb-2">
                            <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                {/* Technologies */}
                                {gettechnologies?.name}
                            </p>
                            <h2 className="text-gray-100 mt-2 font-bold">
                                {/* {gettechnologies ? gettechnologies.elements[0].name:null} */}
                                {/* {gettechnologies ? gettechnologies.elements[0].name:null} */}
                                Modern technologies for an accountable service
                            </h2>
                        </div>

                        {/* {gettechnologies?.elements?.map((feature) => (
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
                        ))} */}
                        {gettechnologies?.elements?.map((feature) => (
                            <dl className="mt-5 " key={feature.name}>
                                <h2 className="mt-10 text-xl font-bold text-goldt">
                                    {/* {gettechnologies?.elements[1]?.name} */}
                                    {feature.name}
                                </h2>
                            
                                <div key={feature.name}>
                                    {/* <dt className="text-sm font-medium text-gray-900">{feature.name}</dt> */}
                                    <dd
                                        className=" text-base text-gray-300"
                                        dangerouslySetInnerHTML={{
                                            __html: feature.content,
                                        }}
                                    ></dd>
                                    <div className="text-goldt mt-3">
                                        <a href={gettechnologies?.url} className="text-sm leading-6 text-goldl hover:text-white">
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </dl>
                        ))}

                    </div>
                </div>
            </div>
            <div className="absolute top-0  right-[-20rem]"> 
                <img src={"/app/webimages/"+gettechnologies?.background} alt="volvo" className="h-[60rem] opacity-20"/>
            </div>
        </div>
    );
}
