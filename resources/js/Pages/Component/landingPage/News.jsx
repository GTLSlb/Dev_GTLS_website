import { Link } from "@inertiajs/react";
import trucks from "../../../assets/news/trucks.webp";
import postpic from "../../../assets/news/postpic.webp";
import newscircle from "../../../assets/pictures/newscircle.webp";
import device from "../../../assets/news/device.webp";
import earth from "../../../assets/news/earth.webp";
import safety from "../../../assets/news/safety.webp";
import track from "../../../assets/news/track.webp";
import worker from "../../../assets/news/worker.webp";
import newSite from "../../../assets/news/newSite.webp";
import goldt from "../../../assets/news/goldt.webp";
import tcapp from "../../../assets/news/tcapp.webp";
import movers from "../../../assets/news/3movers.webp";
import weighbridge from "../../../assets/news/weighbridge.webp";
import Navman from "../../../assets/news/Navman.webp";
import weighbridgenews from "../../../assets/news/weighbridgenews.webp";
import Navmannews from "../../../assets/news/Navmannews.webp";
import greennews from "../../../assets/news/greennews.webp";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import LogoWhite from "../../../../../public/app/icons/";
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

export default function News(props) {
    const getPageDesc = props.getPageDesc;
    const getPosts = props.getPosts;

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
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    };
    const maxScrollWidth = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carousel = useRef(null);

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
                            <div
                                className="mt-3 text-smooth"
                                dangerouslySetInnerHTML={{
                                    __html: getPageDesc?.description,
                                }}
                            ></div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-4">
                            {getPosts?.map((post) => (
                                <div key={post.id} className="px-5  ">
                                    <Link
                                        href={route("newsPage", { slug: post.slug })}
                                        className=""
                                    >
                                        <div className="h-full ">
                                            <div className="relative w-full www">
                                                <img
                                                    src={
                                                        "http://localhost:1337" +
                                                        post.cover.formats
                                                            .medium.url
                                                    }
                                                    alt={
                                                        post.cover.formats
                                                            .medium.name
                                                    }
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
                                                            dateTime={
                                                                post.publishedAt
                                                            }
                                                            className="text-goldl font-bold"
                                                        >
                                                            {/* {post.date} */}
                                                            {
                                                                post?.publishedAt?.split(
                                                                    "T"
                                                                )[0]
                                                            }
                                                        </time>
                                                    </div>
                                                    <div className="group relative">
                                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold line-clamp-2">
                                                            <span className="absolute inset-0" />
                                                            {post?.title}
                                                        </h3>
                                                        {console.log()}
                                                        <dd
                                                            className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3"
                                                            dangerouslySetInnerHTML={{
                                                                __html: post
                                                                    .new_description[0]
                                                                    .children[0]
                                                                    .text,
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
                    </div>
                </div>
            </div>
        </div>
    );
}
