import { Link } from "@inertiajs/react";

import image8 from "../../../assets/teams/Antoine.png";
import image3 from "../../../assets/teams/Aref_Al_Nehmani.png";

import image1 from "../../../assets/teams/imad_el_masri.png";
import image2 from "../../../assets/teams/Theodoros.png";
import image9 from "../../../assets/teams/Danialaa.png";
import image13 from "../../../assets/teams/Debora.png";
import image14 from "../../../assets/teams/Florance.png";
import image11 from "../../../assets/teams/jay.png";
import image6 from "../../../assets/teams/Leslie_Haines.png";
import image7 from "../../../assets/teams/josh.png";
import image10 from "../../../assets/teams/Megan.png";
import image15 from "../../../assets/teams/Ruby.png";
import image4 from "../../../assets/teams/stan.png";
import image5 from "../../../assets/teams/Richelle.png";
import image16 from "../../../assets/teams/Tracey.png";

import image12 from "../../../assets/teams/Veronica.png";



import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import LogoWhite from "../../../../../public/app/icons/";
 import {
    ArrowSmallRightIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import React from 'react';


const teams =[
    {
        id:1,
        image:image1,
        name:"imad_el_masri",
    },
    {
        id:2,
        image:image2,
        name:"Theodoros",
    },
    {
        id:3,
        image:image3,
        name:"Aref_Al_Nehmani",
    },
    {
        id:4,
        image:image4,
        name:"stan",
    },
    {
        id:5,
        image:image5,
        name:"Richelle",
    },
    {
        id:6,
        image:image6,
        name:"Leslie_Haines",
    },
    {
        id:7,
        image:image7,
        name:"josh",
    },
    {
        id:8,
        image:image8,
        name:"Antoine",
    },
    {
        id:9,
        image:image9,
        name:"Danialaa",
    },
    {
        id:10,
        image:image10,
        name:"Megan",
    },
    {
        id:11,
        image:image11,
        name:"jay",
    },
    {
        id:12,
        image:image12,
        name:"Veronica",
    },
    {
        id:13,
        image:image13,
        name:"Debora",
    },
    {
        id:14,
        image:image14,
        name:"Florance",
    },
    {
        id:15,
        image:image15,
        name:"Ruby",
    },
    {
        id:16,
        image:image16,
        name:"Tracey",
    },
]

// const posts = [
//     {
//         id: 13,
//         title: "Gold Tiger's Green Journey",
//         href: "#",
//         description:
//             "Gold Tiger's Green Journey: Innovating with Harmony. As we firmly pledge to eco-friendliness, join us on the road to a better future. We at Gold Tiger Group are a force for positive change rather than just a logistics provider.",
//         imageUrl: greennews,
//         date: "October 24, 2023",
//         datetime: "2023-10-24",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
//     {
//         id: 12,
//         title: "Maintaining the safety of your drivers is a primary concern to our organisation",
//         href: "#",
//         description:
//             "Gold Tiger Logistics solutions continues to maintain and develop best practice standards in all aspects of driver safety and constantly strives to ensure safety standards are both met and exceeded. A major focus in long distance transport safety is the issue of drivers’ fatigue. Utilising the latest technology as part of our safety and compliance processes, Gold Tiger has collaborated with Navman, one of the world’s most innovative companies in automotive technology and risk reduction.",
//         imageUrl: Navmannews,
//         date: "September 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
//     {
//         id: 11,
//         title: "GTLS Enhances Road Safety and Efficiency with Advanced Weighbridge Integration",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions (GTLS) remains committed to the safety of all road users. As part of our ongoing safety innovation program, we take considerable pride in announcing a significant enhancement to our safety practices through the integration of two state-of-the-art weighbridge systems. ",
//         imageUrl: weighbridgenews,
//         date: "September 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
//     {
//         id: 10,
//         title: "Gold Tiger Logistics Solutions Continues advancement with three new volvo F16 prime movers",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions has, this week taken delivery of three new Volvo F16 (Euro 6) prime movers as part of its continuing commitment to constantly modernising and upgrading the fleet. Gold Tiger has used Volvo equipment since the company was formed in 2006 and the partnership has gone from strength to strength over the years.",
//         imageUrl: movers,
//         date: "June 2, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
//     {
//         id: 9,
//         title: "Gold Tiger Logistics Solutions: Unveiling exciting developments and expanding operations",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions and their group of companies are making strides towards expanding their operations with several exciting developments underway.",
//         imageUrl: newSite,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
//     {
//         id: 8,
//         title: "Gold Tiger Logistics Solution Implements Gearbox Workshop Software for Streamlined Maintenance",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solution, a leading logistics and transportation company, has recently implemented Gearbox workshop software to manage their maintenance operations. The software, which was",
//         imageUrl: worker,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 7,
//         title: "Gold Tiger Logistics Solutions Adopts State-of-the-Art Software to Enhance Staff Safety and Compliance",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions, a leading logistics and transportation company, has announced the adoption of a new cloud-based software platform to enhance staff safety and",
//         imageUrl: safety,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 6,
//         title: "Gold Tiger Logistics Solutions completes Fibre internet upgrade across all sites",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions has announced the completion of its internet upgrade, bringing fibre internet to all of its sites. The upgrade is expected to",
//         imageUrl: earth,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 5,
//         title: "GTLS Expansion",
//         href: "#",
//         description:
//             "As part of the GTLS expansion a greenfield site has been purchased within the Ingleburn Industrial Estate. This is stage 1 in a major investment",
//         imageUrl: goldt,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 4,
//         title: "Driver PDA’s",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solution, a prominent logistics company, is making waves with its purchase of product – Zebra TX57 PDA’s. The company’s purchase has revolutionized",
//         imageUrl: device,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 3,
//         title: "Vehicle Tracking",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions, a company in the transportation and logistics industry, has recently adopted three cutting-edge technologies to improve its operations. Firstly, the VT102",
//         imageUrl: track,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 2,
//         title: "TC8300 Touch Computer implementation",
//         href: "#",
//         description:
//             "Gold Tiger Logistics Solutions, an Australian logistics company, revolutionised their business three years ago by implementing a cutting-edge product scanning system.",
//         imageUrl: tcapp,
//         date: "April 19, 2023",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 1,
//         title: "Gold Tiger in $100m business expansion",
//         href: "#",
//         description:
//             "Purpose-built transport hubs in Sydney and Brisbane are part of a $100-million business expansion now underway at Gold Tiger Logistic",
//         imageUrl: trucks,
//         date: "October 13, 2022",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },{
//         id: 0,
//         title: "Fleet boosted by 25 Volvo Euro 6 prime movers",
//         href: "#",
//         description:
//             "Gold Tiger Logistic Solutions has added 25 new prime movers and trailers to its transport fleet, taking the total to",
//         imageUrl: postpic,
//         date: "October 31, 2022",
//         datetime: "2020-03-16",
//         category: { title: "", href: "#" },
//         author: {
//             name: "Michael Foster",
//             role: "Co-Founder / CTO",
//             href: "#",
//             imageUrl:
//                 "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//         },
//     },
    
    
    
    
    
    
    
    
    
    
    
    
    


//     // More posts...
// ];


function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block"}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "" }}
        onClick={onClick}
      >
        <ArrowSmallRightIcon/>
      </div>
    );
  }

export default function News() {

    
    
    const sliderRef = useRef(null);

    
    const slideNextWithDelay = (delay) => {
        setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.slickNext();
          }
        }, delay);
      };


      useEffect(() => {
        const interval = setInterval(() => {
          sliderRef.current.slickNext();
        }, 5000);
    
        return () => {
          clearInterval(interval);
        };
      }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
        nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
      };
    const maxScrollWidth = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carousel = useRef(null);

    const movePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevState) => prevState - 1);
        }
    };

    const moveNext = () => {
        if (
            carousel.current !== null &&
            carousel.current.offsetWidth * currentIndex <=
                maxScrollWidth.current
        ) {
            setCurrentIndex((prevState) => prevState + 1);
        }
    };

    const isDisabled = (direction) => {
        if (direction === "prev") {
            return currentIndex <= 0;
        }

        if (direction === "next" && carousel.current !== null) {
            return (
                carousel.current.offsetWidth * currentIndex >=
                maxScrollWidth.current
            );
        }

        return false;
    };

    useEffect(() => {
        if (carousel !== null && carousel.current !== null) {
            carousel.current.scrollLeft =
                carousel.current.offsetWidth * currentIndex;
        }
    }, [currentIndex]);

    useEffect(() => {
        maxScrollWidth.current = carousel.current
            ? carousel.current.scrollWidth - carousel.current.offsetWidth
            : 0;
    }, []);


    const baseURL = "http://127.0.0.1:8000/posts";
    const [postss, setPost] = useState([]);
    useEffect(() => {
        axios.get(baseURL).then((response) => {
          setPost(response.data);
        });
      }, []);

    console.log(postss);
    return (
        <div>
            
            <div className="bg-dark">
                
                <div className="py-2 sm:py-32 px-1 sm:pb-1">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className=" max-w-2xl ">
                            <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                                Meet Our Team
                            </h2>
                            <p className="mt-2 text-lg leading-8 text-gray-300">
                                Know more about our Team.
                            </p>
                        </div>
                        {/* <div className="text-xl text-white">
                         {
                            postss.map((post) => (
                                <div key={post.id} className="px-5 ">
                                    <Link  href={route("news", { id: post.id })} className="">
                                        <div className="h-full">
                                        <div className="relative w-full www">
                                            <img
                                                src={'./app/icons/'+post.image}
                                                alt={post.title}
                                                className="aspect-[16/9] rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[5/2] w-full "
                                            />
                                            <div className="absolute rounded-2xl inset-0 bg-gradient-to-b from-transparent to-goldt opacity-40"></div>
                                        </div>
                                        <article
                                            key={post.id}
                                            className="flex flex-col items-start justify-between border border-yellow-200 border-opacity-20 rounded-2xl h-72"
                                        >
                                            <div className="max-w-xl mx-4 mb-6  mt-12">
                                                <div className="mt-5 flex items-center gap-x-4 text-xs">
                                                    <time
                                                        dateTime={post.datetime}
                                                        className="text-goldl font-bold"
                                                    >
                                                        {post.date}
                                                    </time>
                                                </div>
                                                <div className="group relative">
                                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold">
                                                        <span className="absolute inset-0" />
                                                        {post.title}
                                                    </h3>
                                                    <p className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3">
                                                        {post.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                        </div>
                                    </Link>
                                </div>
                            ))
                         }

                        </div> */}

                        
                        

                        

                        <Slider ref={sliderRef} {...settings}>
                        {/* <div className="grid grid-cols-3 gap-4"> */}
                        {teams.map((post) => (
                                <div key={post.id} className="px-5  ">
                                        <img
                                                src={post.image}
                                                alt={post.name}
                                                className=" rounded-2xl p-10 object-containh-96 w-full "
                                            />
                                  
                                        {/* <div className="h-full ">
                                        <div className="relative w-full www">
                                            
                                            <div className="absolute rounded-2xl inset-0 bg-gradient-to-b from-transparent to-goldt opacity-40"></div>
                                        </div>
                                        <article
                                            key={post.id}
                                            className="flex flex-col items-start justify-between border border-yellow-200 border-opacity-20 rounded-2xl h-72"
                                        >
                                            <div className="max-w-xl mx-4 mb-6  mt-12">
                                                <div className="mt-5 flex items-center gap-x-4 text-xs">
                                                    <time
                                                        dateTime={post.datetime}
                                                        className="text-goldl font-bold"
                                                    >
                                                        {post.date}
                                                    </time>
                                                </div>
                                                <div className="group relative">
                                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold">
                                                        <span className="absolute inset-0" />
                                                        {post.title}
                                                    </h3>
                                                    <p className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3">
                                                        {post.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                        </div> */}
                                </div>
                            ))}

                        {/* </div> */}
                            
                        </Slider>
                        <div className=" h-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
