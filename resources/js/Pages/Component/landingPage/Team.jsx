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
import image4 from "../../../assets/teams/Stan.png";
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
    // {
    //     id:7,
    //     image:image7,
    //     name:"josh",
    // },
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
    // {
    //     id:14,
    //     image:image14,
    //     name:"Florance",
    // },
    // {
    //     id:15,
    //     image:image15,
    //     name:"Ruby",
    // },
    {
        id:16,
        image:image16,
        name:"Tracey",
    },
]


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

export default function News(props) {

    const getTeam = props.getTeam;
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


    const baseURL = "/posts";
    const [postss, setPost] = useState([]);
    useEffect(() => {
        axios.get(baseURL).then((response) => {
          setPost(response.data);
        });
      }, []);

    return (
        <div>
            
            <div className="bg-dark">
                
                <div className="py-2 sm:py-32 px-1 sm:pb-1">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className=" max-w-2xl ">
                            <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {getTeam?.name}
                                {/* Meet Our Team */}
                            </h2>
                            <div className="mt-2 text-lg leading-8 text-gray-300">
                                <div  dangerouslySetInnerHTML={{ __html: getTeam?.description }}></div>
                                {/* Know more about our Team. */}
                            </div>
                        </div>
                        

                        <Slider ref={sliderRef} {...settings}>
                        {/* <div className="grid grid-cols-3 gap-4"> */}
                        {getTeam?.elements.map((person) => (
                                <div key={person.id} className="px-5  ">
                                        <img
                                                src={"/app/webimages/"+person.image}
                                                alt={person.name}
                                                className=" rounded-2xl p-10 object-containh-96 w-full "
                                            />
                                </div>
                            ))}
                        </Slider>
                        <div className=" h-20"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
