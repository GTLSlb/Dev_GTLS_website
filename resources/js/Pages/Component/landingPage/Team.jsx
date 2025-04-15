import image6 from "../../../assets/teams/Antoine.png";
import image3 from "../../../assets/teams/Aref_Al_Nehmani.png";
import image9 from "../../../assets/teams/Debora.png";
import image1 from "../../../assets/teams/imad_el_masri.png";
import image5 from "../../../assets/teams/Leslie_Haines.png";
import image7 from "../../../assets/teams/Megan.png";
import image4 from "../../../assets/teams/Richelle.png";
import image2 from "../../../assets/teams/Theodoros.png";
import image10 from "../../../assets/teams/Tracey.png";
import image8 from "../../../assets/teams/Veronica.png";
import image11 from "../../../assets/teams/mark-hennes.png";
import image12 from "../../../assets/teams/Fady-hadad.png";
import image13 from "../../../assets/teams/Chris-Joseph.png";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// import LogoWhite from "../../../../../public/app/icons/";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const teams = [
    {
        id: 1,
        image: image1,
        name: "imad_el_masri",
    },
    {
        id: 2,
        image: image2,
        name: "Theodoros",
    },
    {
        id: 13,
        image: image13,
        name: "Chris_Joseph",
    },
    {
        id: 3,
        image: image3,
        name: "Aref_Al_Nehmani",
    },
    {
        id: 12,
        image: image12,
        name: "Fady_Hadad",
    },
    {
        id: 4,
        image: image4,
        name: "Richelle",
    },
    {
        id: 6,
        image: image6,
        name: "Antoine",
    },
    // {
    //     id: 11,
    //     image: image11,
    //     name: "Mark_Hennes",
    // },
    {
        id: 5,
        image: image5,
        name: "Leslie_Haines",
    },
    {
        id: 7,
        image: image7,
        name: "Megan",
    },
    {
        id: 8,
        image: image8,
        name: "Veronica",
    },
    {
        id: 9,
        image: image9,
        name: "Debora",
    },
    {
        id: 10,
        image: image10,
        name: "Tracey",
    },
];

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
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
            <ArrowSmallRightIcon />
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
        prevArrow: <SamplePrevArrow />,
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
                        <Slider ref={sliderRef} {...settings}>
                            {/* <div className="grid grid-cols-3 gap-4"> */}
                            {teams.map((post) => (
                                <div key={post.id} className="px-5  ">
                                    <img
                                        src={post.image}
                                        alt={post.name}
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
