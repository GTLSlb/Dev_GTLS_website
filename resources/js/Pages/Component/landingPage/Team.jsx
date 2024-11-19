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
    const getTeam = props.getTeam;
    const sliderRef = useRef(null);

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

    const strapiAppUrl = window.Laravel.strapiAppUrl;

    return (
        <div>
            <div className="bg-dark">
                <div className="py-2 sm:py-32 px-1 sm:pb-1">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className=" max-w-2xl ">
                            <h2 className="">
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: getTeam?.Title,
                                    }}
                                ></span>
                            </h2>
                            <div className="mt-2">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: getTeam?.Description,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <Slider ref={sliderRef} {...settings}>
                            {getTeam?.team_members.map((person) => (
                                <div key={person.id} className="px-5  ">
                                    <img
                                        src={
                                            strapiAppUrl + person.TeamImage.url
                                        }
                                        alt={person.MemberName}
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
