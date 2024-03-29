import { Head } from "@inertiajs/react";
import Footer from "./Component/landingPage/Footer";
import Calc from "./Component/landingPage/Calc";
import Navbars from "./Component/Navbars";
import "../../css/gradient.css";
import Green from "../assets/pictures/gogreen.webp";
import { useState, useEffect } from "react";

const content = [
    {
        id: 1,
        title: "Developing environment friendly locations:",
        parag: "Gold Tiger is committed to the highest standards of sustainability, efficiency, and safety. We are implementing green practices by using efficient LED lighting with the intention of reducing our carbon footprint and the ultimate target making our facilities energy/emissions neutral.",
    },
    {
        id: 2,
        title: "Alternative natural sources:",
        parag: "At Gold Tiger we use Solar to reduce carbon emissions as well as operational costs. Solar energy addresses many of the challenges facing our world today and the use of a sustainable non fossil based energy source will ultimately play a major part in the reduction of air pollution and assist positive climate change.",
    },
    {
        id: 3,
        title: "We are implementing green practices:",
        parag: "We are an environmentally aware company. We use eco-friendly recycling and managing materials consumption as well as planting trees. Our Volvo trucks are Euro 6 compliant (with the addition of Adblue which reduces polluting emissions into the environment). At Gold Tiger we ensure the proper disposal and recycling of tyres and batteries.",
    },
    {
        id: 4,
        title: "Transportation sustainability considerations:",
        parag: "At Gold Tiger we have adopted efficient transportation technology. By utilising transportation and routing management systems to effectively minimise travel distances. This reduces overall kilometres driven and reduces costs while also having the additional benefit of improving DIFOT. This solution makes the Gold Tiger business partners more efficient due to the ability to accurately forecast delivery and shorten lead times.",
    },
    {
        id: 5,
        title: "Warehousing:",
        parag: "The company is constantly working on improving and maintaining warehousing strategies to meet customer needs. An example is the utilisation of multifunctional forklift trucks, this lean process makes it easier for Gold Tiger to reduce their carbon footprint by reducing inventories, optimising product movements, supply chain and network design. The warehouse design and distribution structures are consciously designed to meet sustainability standards.",
    },
];

export default function GoingGreen() {

    const [getfooter, setfooter] = useState([]);
    const [getGreen, setGreen] = useState([]);



    // ********************************************************* 
    // ********************* All requests  ********************* 
    // ********************************************************* 

    // Going Green
    
    useEffect(() => {
        axios.get('/GreenPage')
          .then(response => {
              // console.log('fetching data:',response.data);
              setGreen(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
    
    // Footer

    useEffect(() => {
        axios.get('/footer')
          .then(response => {
              // console.log('fetching data:',response.data);
              setfooter(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
      // ********************************************************* 
      // ********************* End requests  ********************* 
      // ********************************************************* 
    return (
        <>
            <Head title="Going Green" />
            <div className="relative isolate min-h-screen bg-dark"><Navbars />
                <div className=" py-28 text-smooth ">
                    <div className="bg-gg bg-cover" >
                        <div className="mx-auto max-w-7xl  px-6 lg:px-8  flex flex-col md:flex-row gap-x-10 gap-y-10 py-20 items-center">
                            <div className="md:w-6/12">
                                <h1 className="gradient-text py-5 text-4xl font-bold">
                                    {getGreen?.name}
                                    {/* GTLS Towards a Green  Future */}
                                </h1>
                                <div className="mt-3 text-smooth" dangerouslySetInnerHTML={{ __html: getGreen?.description }}></div>
                                {/* <p className="mt-2 text-smooth">
                                    Gold Tiger is working toward a more
                                    sustained future by managing the risks of
                                    climate change. Going green is our major
                                    focus and we understand how air pollution
                                    and resource depletion impact the
                                    environment. That’s why we decided to
                                    implement a positive action program. We
                                    acknowledge that the most effective efforts
                                    should be directed at the decarbonisation of
                                    the transport industry, our intention is to
                                    produce an outcome that will positively
                                    impact global society.
                                </p> */}
                                <Calc/>
                            </div>
                            <div className="w-full md:w-1/2 ">
                                <img src={"/app/webimages/"+getGreen?.image} alt={getGreen?.image_alt} className="" />
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <p className="text-smooth ">
                            We took the following initiative to reduce
                            environmental impact:
                        </p>
                        <ul className="mt-5 space-y-8">
                            {getGreen?.elements?.map((item) => (
                                <li key={item.id}>
                                    <h1 className="text-goldt text-3xl font-bold">
                                        {item.name}
                                    </h1>
                                    <div className="mt-2 text-smooth pl-10"  dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Footer getfooter={getfooter}/>
        </>
    );
}
