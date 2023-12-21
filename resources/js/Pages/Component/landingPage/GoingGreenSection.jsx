import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid"
import Green from "../../../assets/pictures/gogreen.webp"
import "../../../../css/gradient.css"
import Calc from "../../Component/landingPage/Calc";

export default function GoingGreenSection (){
return(
    <div>
        <div className=" text-smooth py-32">
                    <div className="bg-gg bg-cover">
                        <div className="mx-auto max-w-7xl  px-6 lg:px-8  flex flex-col md:flex-row gap-x-10 gap-y-10 py-2 items-center">
                            <div className="wfull md:w-1/2">
                                <img src={Green} alt="" className="" />
                            </div>
                            <div className="md:w-1/2">
                                <h2 className="gradient-text py-5 text-4xl font-bold">
                                GTLS Towards a Green  Future
                                </h2>
                                <p className="mt-2 text-smooth">
                                    Gold Tiger is working toward a more
                                    sustained future by managing the risks of
                                    climate change. Going green is our major
                                    focus and we understand how air pollution
                                    and resource depletion impact the
                                    environment. That’s why we decided to
                                    implement a positive action program.
                                     {/* We
                                    acknowledge that the most effective efforts
                                    should be directed at the decarbonisation of
                                    the transport industry, our intention is to
                                    produce an outcome that will positively
                                    impact global society. */}
                                </p>
                               
                                
                                <div className="flex items-center gap-x-1 text-goldt mt-2 hover:text-smooth">
                                    
                                <a href="/goinggreen" className="text">Read more</a>
                                    <ChevronDoubleRightIcon className="h-4"/>
                                </div>

                                <Calc/>
                            </div>
                            
                        </div>
                    </div>
                   
                </div>
    </div>
)
}