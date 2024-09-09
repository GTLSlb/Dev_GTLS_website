import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import goldTigerLogo from "../assets/pictures/goldTigerLogo.webp";
import gtlsway from "../assets/videos/GTLSWAY.mp4";
import RoadSafety from "../assets/videos/RoadSafety.mp4";
import trucks from "../assets/news/trucks.webp";
import postpic from "../assets/news/postpic.webp";
import tcapp from "../assets/news/tcapp.webp";
import device from "../assets/news/device.webp";
import earth from "../assets/news/earth.webp";
import safety from "..//assets/news/safety.webp";
import track from "../assets/news/track.webp";
import newSite from "../assets/news/newSite.webp";
import { useState, useRef, useEffect } from "react";
import worker from "../assets/news/worker.webp";
import goldt from "../assets/news/goldt.webp";
import movers from "../assets/news/3movers.webp";
import greennews from "../assets/news/greennews.webp";
import weeklySafety from "../assets/news/weeklySafety.webp";
import EmployeesSafety from "../assets/news/EmployeesSafety.png";
import weighbridge from "../assets/news/weighbridge.webp";
import Navman from "../assets/news/Navman.webp";
import weighbridgenews from "../assets/news/weighbridgenews.webp";
import Navmannews from "../assets/news/Navmannews.webp";
import onSiteFueling from "@/assets/news/onSiteFueling.webp";
import Efficiency from "../assets/news/Efficiency.webp";
import JostCover from "../assets/news/Jost5Cover.jpeg";
import BBWImage from "../assets/news/BPW.webp";
import Conferencnews from "../assets/news/Conference.jpeg";
import Conferencnews2 from "../assets/news/Conference2.jpeg";
import Conferencnews3 from "../assets/news/Conference3.jpeg";
import Conferencnews4 from "../assets/news/Conference4.jpeg";
import Conferencnews5 from "../assets/news/Conference5.jpeg";
import Conferencnews6 from "../assets/news/Conference6.jpeg";
import Conferencnews7 from "../assets/news/Conference7.jpeg";
import Conferencnews8 from "../assets/news/Conference8.jpeg";
import Conferencnews9 from "../assets/news/Conference9.jpg";
import Conferencnews10 from "../assets/news/Conference10.jpeg";
import Conferencnews11 from "../assets/news/Conference11.jpeg";

import React from "react";
import { usePage } from "@inertiajs/react";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinIcon,
    LinkedinShareButton,
    WhatsappShareButton,
    WhatsappIcon,
} from "react-share";
import Footer from "./Component/landingPage/Footer";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

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
            style={{ ...style, display: "block" }}
            onClick={onClick}
        >
            {/* <ArrowSmallRightIcon/> */}
        </div>
    );
}

export default function NewsPage(props) {
    const { postslug } = usePage().props;
    const [getfooter, setfooter] = useState([]);
    const [getPosts, setPosts] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    const [loading, setLoading] = useState(true);

    // Posts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsResponse, footerResponse] = await Promise.all([
                    axios.get("/posts"),
                    axios.get("/footer"),
                ]);
                setPosts(postsResponse.data);
                setfooter(footerResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Optionally, handle error state here
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************
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

    const [showNavbar, setShowNavbar] = useState(false);
    const { post } = usePage().props;

    console.log(postslug);
    useEffect(() => {
        let prevScrollPosition = window.pageYOffset;

        function handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            setShowNavbar(scrollTop > 0);
        }

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const pageUrl = window.location.href;

    function customEncodeTitle(title) {
        return title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }

    console.log(getPosts);

    return (
        <>
            <Head title="News" />
            <div className="relative isolate bg-dark">
                <Navbars />
                {/* <HeroSection/> */}
                <div aria-hidden="true" className="relative">
                    <img
                        src={"/app/webimages/" + postslug.image}
                        alt="news"
                        className="h-[40rem] w-full object-cover  "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>

                <div className="bg-dark pb-10 px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                        <a
                            href="/news"
                            className="relative inline-flex items-center justify-center text-black "
                        >
                            <ArrowLongLeftIcon className="h-5 text-goldt " />
                            <span className="p-1 text-white">Back to main</span>
                        </a>
                        <div key={postslug.id}>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {postslug.title}
                            </h1>
                            <time
                                dateTime={postslug.date}
                                className="text-gray-500 font-bold"
                            >
                                {postslug.date.split("T")[0]}
                            </time>
                            <dd
                                className="mt-6 text-lg leading-8 text-gray-200 text-justify"
                                dangerouslySetInnerHTML={{
                                    __html: postslug.desc,
                                }}
                            ></dd>
                            <figure className="mt-16">
                                {postslug.videoUrl ? (
                                    <video
                                        loop
                                        autoPlay
                                        controls
                                        style={{ width: "100%" }}
                                        src={
                                            "/app/webimages/" +
                                            postslug.videoUrl
                                        }
                                        type="video/mp4"
                                    >
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                ) : (
                                    <div className="h-full w-full">
                                        <img
                                            className="aspect-video rounded-xl bg-gray-50 w-full object-cover"
                                            src={
                                                "/app/webimages/" +
                                                postslug.image
                                            }
                                            alt={postslug.title}
                                        />
                                    </div>
                                )}
                            </figure>
                            <div className="mt-10">
                                <p className="mt-2 mb-5 text-xl font-bold tracking-tight text-white sm:text-xl">
                                    Share to your friends
                                </p>
                                <FacebookShareButton
                                    url={pageUrl}
                                    title={postslug.title}
                                >
                                    <FacebookIcon className="rounded-md h-10 w-auto mr-3" />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={pageUrl}
                                    title={postslug.title}
                                >
                                    <TwitterIcon className="rounded-md h-10 w-auto mr-3" />
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    url={pageUrl}
                                    title={postslug.title}
                                >
                                    <LinkedinIcon className="rounded-md h-10 w-auto mr-3" />
                                </LinkedinShareButton>
                                <WhatsappShareButton
                                    url={pageUrl}
                                    title={postslug.title}
                                >
                                    <WhatsappIcon className="rounded-md h-10 w-auto mr-3" />
                                </WhatsappShareButton>
                            </div>
                        </div>
                        {/* ))} */}
                    </div>
                </div>
                <div className="bg-dark py-24 px-1 sm:py-10 mb-5" id="news">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                More News
                            </h2>
                        </div>

                        <Slider {...settings}>
                            {getPosts.map((post) => (
                                <div key={post.id} className="px-5 ">
                                    <Link
                                        href={route("news", {
                                            id: post.id,
                                            title: customEncodeTitle(
                                                post.title
                                            ),
                                        })}
                                        className=""
                                    >
                                        <div className="h-full">
                                            <div className="relative w-full www">
                                                <img
                                                    src={
                                                        "/app/webimages/" +
                                                        post.cover_image
                                                    }
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
                                                            dateTime={
                                                                post.datetime
                                                            }
                                                            className="text-goldl font-bold"
                                                        >
                                                            {
                                                                post?.date?.split(
                                                                    "T"
                                                                )[0]
                                                            }
                                                        </time>
                                                    </div>
                                                    <div className="group relative">
                                                        <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold ">
                                                            <span className="absolute inset-0" />
                                                            {post?.title}
                                                        </h3>
                                                        <div
                                                            className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3 list-style-type: disc;"
                                                            dangerouslySetInnerHTML={{
                                                                __html: post?.desc,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <Footer getfooter={getfooter} />
            </div>
        </>
    );
}
