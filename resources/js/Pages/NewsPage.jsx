import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
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
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Navbars from "../Components/Navbars";
import { BounceLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import RichTextRenderer from "@/Components/ContentRenderer";
import { getFromStrapi } from "@/CommonFunctions";

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
    const { slug } = usePage().props;
    const [postslug, setPostSlug] = useState();
    const [getfooter, setfooter] = useState([]);
    const [getPosts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Add this state to manage loading state


    useEffect(() => {
        const fetchData = async () => {
            const result = await getFromStrapi(
                `/api/blogs?pagination%5BwithCount%5D=false&populate=*&filters[slug][$eq]=${slug}`
            );
            
            if (result.success) {
                setPostSlug(result.data[0]);
            } else {
                console.error("Fetch failed:", result.error);
            }
        };

        fetchData();
    }, []);
    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
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

    const pageUrl = window.location.href;

    function customEncodeTitle(title) {
        return title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    }

    return (
        <>
            <Head title="News" />
            <div className="relative isolate bg-dark">
                <Navbars />
                {loading ? (
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                ) : (
                    <>
                        <div aria-hidden="true" className="relative">
                            {console.log(postslug)}
                            <img
                                src={
                                    "http://localhost:1337" +
                                    postslug.cover.formats.medium.url
                                }
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
                                    <span className="p-1 text-white">
                                        Back to main
                                    </span>
                                </a>
                                <div key={postslug.documentId}>
                                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                        {postslug.title}
                                    </h1>
                                    <time
                                        dateTime={postslug.publish_date}
                                        className="text-gray-500 font-bold"
                                    >
                                        {postslug.publish_date.split("T")[0]}
                                    </time>
                                    {console.log(postslug.new_description)}
                                    <div className=" text-smooth">
                                        <RichTextRenderer
                                            content={postslug.new_description}
                                        />
                                    </div>
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
                                                Your browser does not support
                                                the video tag.
                                            </video>
                                        ) : (
                                            <Swiper
                                                navigation={true}
                                                modules={[Navigation]}
                                                className="mySwiper"
                                            >
                                                {postslug.images.map(
                                                    (item, index) => (
                                                        <SwiperSlide
                                                            key={index}
                                                        >
                                                            <img
                                                                className="aspect-video w-full h-[550px] px-20 rounded-xl object-contain"
                                                                src={
                                                                    "http://localhost:1337" +
                                                                    item.formats
                                                                        .medium
                                                                        .url
                                                                }
                                                                alt={
                                                                    item.formats
                                                                        .medium
                                                                        .name
                                                                }
                                                            />
                                                        </SwiperSlide>
                                                    )
                                                )}
                                            </Swiper>
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
                            </div>
                        </div>
                    </>
                )}

                <Footer getfooter={getfooter} />
            </div>
        </>
    );
}
