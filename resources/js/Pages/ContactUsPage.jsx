import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";


import Footer from "./Component/landingPage/Footer";
import Navbars from "@/Components/Navbars";
import ContatcUs from "./Component/ContactUsComp/ContactUs";



export default function Capability(props) {

    const [getfooter, setfooter] = useState([]);

    // ********************************************************* 
    // ********************* All requests  ********************* 
    // ********************************************************* 
    
    // Footer

    useEffect(() => {
        axios.get('/footer')
          .then(response => {
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
            <Head title="Contact Us" />
            <div className="relative isolate bg-dark">
                <Navbars />
                <div aria-hidden="true" className="relative">
                    <img
                        src={jobs}
                        alt="jobs"
                        className="h-10 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>
                {/* <ContatcUs getContsct={getContsct}/> */}
                {/* <Branches getBranch={getBranch}/> */}
                <ContatcUs />
                <Footer getfooter={getfooter}/>
            </div>
        </>
    );
}
