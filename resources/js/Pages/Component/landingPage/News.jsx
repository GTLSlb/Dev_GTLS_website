import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import newscircle from "../../../assets/pictures/newscircle.webp";
import "../../../../css/blog.css";
// import LogoWhite from "../../../../../public/app/icons/";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";
import NewsCard from "@/Components/News/NewsCard";

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
                                        new Date(b.DatePublished) -
                                        new Date(a.DatePublished)
                                )
                                .map((post) => (
                                    <NewsCard post={post} />
                                ))}
                        </div>

                        <Slider ref={sliderRef} {...settings}></Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}
