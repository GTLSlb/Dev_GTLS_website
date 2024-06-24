import { Link } from "@inertiajs/react";
import newscircle from "../../../assets/pictures/newscircle.webp";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import LogoWhite from "../../../../../public/app/icons/";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import React from "react";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
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
        <div
            className={className}
            style={{ ...style, display: "block", background: "" }}
            onClick={onClick}
        >
            <ArrowSmallRightIcon />
        </div>
    );
}
}

export default function News(props) {
    const getPageDesc = props.getPageDesc;
    const getPosts = props.getPosts;

    const sliderRef = useRef(null);


    const slideNextWithDelay = (delay) => {
        setTimeout(() => {
            if (sliderRef.current) {
                sliderRef.current.slickNext();
            }
            if (sliderRef.current) {
                sliderRef.current.slickNext();
            }
        }, delay);
    };
    };

    useEffect(() => {
    useEffect(() => {
        const interval = setInterval(() => {
            sliderRef.current.slickNext();
            sliderRef.current.slickNext();
        }, 5000);


        return () => {
            clearInterval(interval);
            clearInterval(interval);
        };
    }, []);
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
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

    return (
        <div className="pb-20">
            <div className=" h-20" id="news"></div>
            <div className="bg-dark">
                <div className="absolute ">
                    <img src={newscircle} alt="circle" />
                </div>
                <div className="py-24 sm:py-32 px-1 sm:pb-1">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className=" max-w-2xl ">
                            <h2 className="text-4xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {getPageDesc?.name}
                            </h2>
                            <div className="mt-3 text-smooth" dangerouslySetInnerHTML={{ __html: getPageDesc?.description }}></div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-5">
                        {getPosts?.map((post) => (
                                <div key={post.id} className="">
                                    <Link href={route("news", { id: post.slug})} className="">
                                        <div className="h-full ">
                                        <div className="relative w-full www">
                                            <img
                                                src={"/app/webimages/"+post?.cover_image}
                                                alt={post?.title}
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
                                                        dateTime={post.created_at}
                                                        className="text-goldl font-bold"
                                                    >
                                                        {/* {post.date} */}
                                                        {post?.date?.split('T')[0]}
                                                    </time>
                                                </div>
                                                <div className="group relative">
                                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold line-clamp-2">
                                                        <span className="absolute inset-0" />
                                                        {post?.title}
                                                    </h3>
                                                    <dd
                                                        className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3"
                                                        dangerouslySetInnerHTML={{
                                                            __html: post?.desc,
                                                        }}
                                                    ></dd>
                                                </div>
                                            </div>
                                        </article>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                    

                        </div>

                        <Slider ref={sliderRef} {...settings}></Slider>

                        <Slider ref={sliderRef} {...settings}></Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}
