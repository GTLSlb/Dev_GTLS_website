import { Link } from "@inertiajs/react";
import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import newscircle from "../../../assets/pictures/newscircle.webp";
import "../../../../css/blog.css";
// import LogoWhite from "../../../../../public/app/icons/";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

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

SampleNextArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

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

SamplePrevArrow.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

export default function News(props) {
    const getPosts = props.getPosts;

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
    const currentIndex = 0
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

    const strapiApiUrl = window.Laravel.strapiAppUrl;

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
                            <div
                                className="mt-3"
                                dangerouslySetInnerHTML={{
                                    __html: getPosts?.Title,
                                }}
                            ></div>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: getPosts?.Description,
                                }}
                                className="mt-3 "
                            ></div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            {getPosts?.RelatedBlogs?.blogs
                                ?.slice()
                                ?.sort(
                                    (a, b) =>
                                        new Date(b.publishedAt) -
                                        new Date(a.publishedAt)
                                )
                                .map((post) => (
                                    <div
                                        key={post.documentId}
                                        className=""
                                    >
                                        <Link
                                        // eslint-disable-next-line
                                            href={route("newsPage", {
                                                slug: post.Slug,
                                            })}
                                            className=""
                                        >
                                            <div className="h-full ">
                                                <div className="relative w-full www">
                                                    <img
                                                        src={
                                                            strapiApiUrl +
                                                            post.CoverImage.url
                                                        }
                                                        alt={
                                                            post.CoverImage
                                                                .alternativeText
                                                        }
                                                        className=" aspect-[16/9] rounded-2xl bg-gray-100 object-cover object-center  w-full "
                                                    />

                                                    <div className="absolute rounded-2xl inset-0 bg-gradient-to-b from-transparent to-goldt opacity-40"></div>
                                                </div>
                                                <article
                                                    key={post.documentId}
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
                                                            <h3 className="mt-3 text-lg leading-6 text-white group-hover:text-gray-600 font-bold line-clamp-2">
                                                                <span className="absolute inset-0" />
                                                                {post?.Title}
                                                            </h3>

                                                            <div
                                                                className="mt-5 leading-6 text-gray-400 !text-sm line-clamp-3 blogDescription"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: post.Body,
                                                                }}
                                                                style={{
                                                                    fontSize:
                                                                        "14px",
                                                                }}
                                                            ></div>
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

News.propTypes = {
    getPosts: PropTypes.object,
};
