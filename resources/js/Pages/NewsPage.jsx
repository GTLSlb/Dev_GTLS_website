import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
import goldTigerLogo from "../assets/pictures/goldTigerLogo.webp";
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
import weighbridge from "../assets/news/weighbridge.webp";
import Navman from "../assets/news/Navman.webp";
import weighbridgenews from "../assets/news/weighbridgenews.webp";
import Navmannews from "../assets/news/Navmannews.webp";
import { useParams } from "react-router-dom";
import React from "react";
import { usePage } from "@inertiajs/react";
import { InstagramIcon } from "react-social-icons";
import jobs from "../assets/pictures/jobs.webp";
import { Dialog } from "@headlessui/react";
import {
    Bars3Icon,
    XMarkIcon,
    ArrowLongLeftIcon,
} from "@heroicons/react/24/outline";
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
import SecondaryFooter from "./Component/landingPage/SecondaryFooter";
import Navbars from "./Component/Navbars";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/contact_us", ref: "contact" },
];

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

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
                    axios.get('/posts'),
                    axios.get('/footer')
                ]);
    
                setPosts(postsResponse.data);
                setfooter(footerResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
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

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const { id } = usePage().props;

    const handleFileUpload = (file) => {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
    };

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

    const posts = [
        {
            id: 13,
            title: "Gold Tiger's Green Journey",
            href: "#",
            description:
                "Gold Tiger's Green Journey: Innovating with Harmony. As we firmly pledge to eco-friendliness, join us on the road to a better future. We at Gold Tiger Group are a force for positive change rather than just a logistics provider.",
            imageUrl: greennews,
            date: "October 24, 2023",
            datetime: "2023-10-24",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 12,
            title: "Maintaining the safety of your drivers is a primary concern to our organisation",
            href: "#",
            description:
                "Gold Tiger Logistics solutions continues to maintain and develop best practice standards in all aspects of driver safety and constantly strives to ensure safety standards are both met and exceeded. A major focus in long distance transport safety is the issue of drivers’ fatigue. Utilising the latest technology as part of our safety and compliance processes, Gold Tiger has collaborated with Navman, one of the world’s most innovative companies in automotive technology and risk reduction.",
            imageUrl: Navmannews,
            date: "September 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 11,
            title: "GTLS Enhances Road Safety and Efficiency with Advanced Weighbridge Integration",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions (GTLS) remains committed to the safety of all road users. As part of our ongoing safety innovation program, we take considerable pride in announcing a significant enhancement to our safety practices through the integration of two state-of-the-art weighbridge systems. ",
            imageUrl: weighbridgenews,
            date: "September 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 10,
            title: "Gold Tiger Logistics Solutions Continues advancement with three new volvo F16 prime movers",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions has, this week taken delivery of three new Volvo F16 (Euro 6) prime movers as part of its continuing commitment to constantly modernising and upgrading the fleet. Gold Tiger has used Volvo equipment since the company was formed in 2006 and the partnership has gone from strength to strength over the years.",
            imageUrl: movers,
            date: "June 2, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 9,
            title: "Gold Tiger Logistics Solutions: Unveiling exciting developments and expanding operations",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions and their group of companies are making strides towards expanding their operations with several exciting developments underway.",
            imageUrl: newSite,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 8,
            title: "Gold Tiger Logistics Solution Implements Gearbox Workshop Software for Streamlined Maintenance",
            href: "#",
            description:
                "Gold Tiger Logistics Solution, a leading logistics and transportation company, has recently implemented Gearbox workshop software to manage their maintenance operations. The software, which was",
            imageUrl: worker,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 7,
            title: "Gold Tiger Logistics Solutions Adopts State-of-the-Art Software to Enhance Staff Safety and Compliance",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, a leading logistics and transportation company, has announced the adoption of a new cloud-based software platform to enhance staff safety and",
            imageUrl: safety,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 6,
            title: "Gold Tiger Logistics Solutions completes Fibre internet upgrade across all sites",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions has announced the completion of its internet upgrade, bringing fibre internet to all of its sites. The upgrade is expected to",
            imageUrl: earth,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 5,
            title: "GTLS Expansion",
            href: "#",
            description:
                "As part of the GTLS expansion a greenfield site has been purchased within the Ingleburn Industrial Estate. This is stage 1 in a major investment",
            imageUrl: goldt,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 4,
            title: "Driver PDA’s",
            href: "#",
            description:
                "Gold Tiger Logistics Solution, a prominent logistics company, is making waves with its purchase of product – Zebra TX57 PDA’s. The company’s purchase has revolutionized",
            imageUrl: device,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 3,
            title: "Vehicle Tracking",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, a company in the transportation and logistics industry, has recently adopted three cutting-edge technologies to improve its operations. Firstly, the VT102",
            imageUrl: track,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 2,
            title: "TC8300 Touch Computer implementation",
            href: "#",
            description:
                "Gold Tiger Logistics Solutions, an Australian logistics company, revolutionised their business three years ago by implementing a cutting-edge product scanning system.",
            imageUrl: tcapp,
            date: "April 19, 2023",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 1,
            title: "Gold Tiger in $100m business expansion",
            href: "#",
            description:
                "Purpose-built transport hubs in Sydney and Brisbane are part of a $100-million business expansion now underway at Gold Tiger Logistic",
            imageUrl: trucks,
            date: "October 13, 2022",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },
        {
            id: 0,
            title: "Fleet boosted by 25 Volvo Euro 6 prime movers",
            href: "#",
            description:
                "Gold Tiger Logistic Solutions has added 25 new prime movers and trailers to its transport fleet, taking the total to",
            imageUrl: postpic,
            date: "October 31, 2022",
            datetime: "2020-03-16",
            category: { title: "", href: "#" },
            author: {
                name: "Michael Foster",
                role: "Co-Founder / CTO",
                href: "#",
                imageUrl:
                    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
        },

        // More posts...
    ];

    const filteredData = posts.filter((item) => item.id != id);

    const pageUrl = window.location.href;


    
    const {post} =usePage().props;

    return (
        <>
            <Head title="News" />
            <div className="relative isolate bg-dark">
                <Navbars />
                {/* <HeroSection/> */}
                {id == 12 ? (
                    <div aria-hidden="true" className="relative">
                        <img
                            src={"/app/webimages/"+post.image}
                            alt="news"
                            className="h-[40rem] w-full object-cover  "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                    </div>
                ) : (
                    <div aria-hidden="true" className="relative">
                        <img
                            src={"/app/webimages/"+post.image}
                            alt="news"
                            className="h-96 w-full object-cover  "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                    </div>
                )}

                <div className="bg-dark pb-10 px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                        {/* <p className="text-base font-semibold leading-7 text-indigo-600">
                            Introducing
                        </p> */}
                        {/* {contentJson.map((post) => ( */}
                        <a
                            href="/news"
                            className="relative inline-flex items-center justify-center text-black "
                        >
                            <ArrowLongLeftIcon className="h-5 text-goldt " />
                            <span className="p-1 text-white">Back to main</span>
                        </a>
                        <div key={post.id}>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {post.title}
                            </h1>
                            <time
                                dateTime={post.date}
                                className="text-gray-500 font-bold"
                            >
                                {post.date.split('T')[0]}
                            </time>
                            <dd
                                className="mt-6 text-lg leading-8 text-gray-200 text-justify"
                                dangerouslySetInnerHTML={{
                                    __html: post.desc,
                                }}
                            ></dd>
                           
                            {/* {contentJson[id].list ? (
                                <ol className="p-5">
                                    {contentJson[id].list?.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex gap-x-3 "
                                        >
                                            <div className=" h-2 w-2 mt-2 flex-none rounded-full bg-goldt" />
                                            <div>
                                                <span className="text-smooth">
                                                    {item.title}
                                                </span>
                                                {item.content ? (
                                                    <div className="text-gray-200">{item.content}</div>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : null} */}

                            {/* <div className="mt-10 text-lg  text-gray-200 text-justify">
                                <p
                                    style={{ whiteSpace: "pre-line" }}
                                    className="w-full"
                                >
                                    {contentJson[id].content2}
                                </p>
                            </div> */}
                            <figure className="mt-16">
                                <img
                                    className="aspect-video rounded-xl bg-gray-50 object-cover"
                                    src={"/app/webimages/"+post.image}
                                    alt={post.title}
                                />
                            </figure>
                            <div className="mt-10">
                                <p className="mt-2 mb-5 text-xl font-bold tracking-tight text-white sm:text-xl">
                                    Share to your friends
                                </p>
                                <FacebookShareButton
                                    url={pageUrl}
                                    title={post.title}
                                >
                                    <FacebookIcon className="rounded-md h-10 w-auto mr-3" />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={pageUrl}
                                    title={post.title}
                                >
                                    <TwitterIcon className="rounded-md h-10 w-auto mr-3" />
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    url={pageUrl}
                                    title={post.title}
                                >
                                    <LinkedinIcon className="rounded-md h-10 w-auto mr-3" />
                                </LinkedinShareButton>
                                <WhatsappShareButton
                                    url={pageUrl}
                                    title={post.title}
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
                                        href={route("news", { id: post.slug})}
                                        className=""
                                    >
                                        <div className="h-full">
                                            <div className="relative w-full www">
                                                <img
                                                    src={"/app/webimages/"+post.image}
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
                                                            {post?.date?.split('T')[0]}
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
                <Footer getfooter={getfooter}/>
            </div>
        </>
    );
}