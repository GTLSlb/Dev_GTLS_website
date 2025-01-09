import { getFromStrapi } from "@/CommonFunctions";
import SEOComponent from "@/Components/SEO/SEOComponent";
import MainLayout from "@/Layouts/MainLayout";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
} from "react-share";
import { BounceLoader } from "react-spinners";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../css/NewsPageSlider.css";

export default function NewsPage(props) {
    const { slug } = usePage().props;
    const [postslug, setPostSlug] = useState();
    const [loading, setLoading] = useState(true); // Add this state to manage loading state

    useEffect(() => {
        const fetchData = async () => {
            const status =
                new URLSearchParams(window.location.search).get("status") ||
                "test";

            const endpoint = `/api/blogs?pagination%5BwithCount%5D=false&populate=*&filters[Slug][$eq]=${slug}&status=${status}`;
            console.log(endpoint);

            const result = await getFromStrapi(endpoint);

            if (result.success) {
                console.log(result.data[0]);
                setPostSlug(result.data[0]);
                setLoading(false);
            } else {
                console.log("Fetch failed:", result.error);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

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

    const strapiApiUrl = window.Laravel.strapiAppUrl;

    function isValidVideoFormat(value) {
        // List of supported video formats
        const supportedFormats = [
            ".MPEG",
            ".MP4",
            ".Quicktime",
            ".WMV",
            ".AVI",
            ".FLV",
        ];

        // Check if the provided value is in the list (case insensitive)
        return supportedFormats.some(
            (format) => format.toLowerCase() === value.toLowerCase()
        );
    }
    return (
        <>
            <div className="relative isolate bg-dark">
                {loading ? (
                    <div className="bg-dark flex justify-center items-center h-screen">
                        {" "}
                        <BounceLoader color="#e2b540" />
                    </div>
                ) : (
                    <>
                        <MainLayout loading={loading}>
                            {postslug.seo && (
                                <SEOComponent seoData={postslug?.seo} />
                            )}
                            <div aria-hidden="true" className="relative">
                                <img
                                    src={strapiApiUrl + postslug.CoverImage.url}
                                    alt={postslug.CoverImage.alternativeText}
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
                                        <h1
                                            className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl"
                                            dangerouslySetInnerHTML={{
                                                __html: postslug.Title,
                                            }}
                                        />
                                        <time
                                            dateTime={postslug.publishedAt}
                                            className="text-gray-500 font-bold"
                                        >
                                            {
                                                postslug.DatePublished.split(
                                                    "T"
                                                )[0]
                                            }
                                        </time>
                                        <dd
                                            className="mt-5"
                                            dangerouslySetInnerHTML={{
                                                __html: postslug.Body,
                                            }}
                                        ></dd>
                                        <div className="mt-16 relative">
                                            {postslug.NewsMedia && (
                                                <Swiper
                                                    navigation={true}
                                                    modules={[Navigation]}
                                                    className="mySwiper"
                                                >
                                                    {postslug.NewsMedia.map(
                                                        (item, index) => (
                                                            <SwiperSlide
                                                                key={index}
                                                                className="flex justify-center items-center w-full"
                                                            >
                                                                {" "}
                                                                {isValidVideoFormat(
                                                                    item.ext
                                                                ) ? (
                                                                    <video
                                                                        loop
                                                                        autoPlay
                                                                        controls
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                        className="aspect-video w-full h-[550px] px-20 rounded-xl object-contain"
                                                                        src={
                                                                            strapiApiUrl +
                                                                            item.url
                                                                        }
                                                                        type="video/mp4"
                                                                    >
                                                                        Your
                                                                        browser
                                                                        does not
                                                                        support
                                                                        the
                                                                        video
                                                                        tag.
                                                                    </video>
                                                                ) : (
                                                                    <img
                                                                        className="aspect-video w-full h-[550px] px-20 rounded-xl object-contain"
                                                                        src={
                                                                            strapiApiUrl +
                                                                            item.url
                                                                        }
                                                                        alt={
                                                                            item.alternativeText
                                                                        }
                                                                    />
                                                                )}
                                                            </SwiperSlide>
                                                        )
                                                    )}
                                                </Swiper>
                                            )}
                                        </div>
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
                        </MainLayout>
                    </>
                )}
            </div>
        </>
    );
}
