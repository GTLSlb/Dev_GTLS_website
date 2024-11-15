import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";
import Video from "./Component/landingPage/video";
import News from "./Component/landingPage/News";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "@/Components/Navbars";
import { getFromStrapi } from "@/CommonFunctions";

const handleClick = () => {
    history.push("/", { scrollToElement: "news" });
};

export default function Newss(props) {
    const [getfooter, setfooter] = useState([]);
    const [getPageDesc, setPageDesc] = useState([]);
    const [getPosts, setPosts] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************

    // Page desc
    useEffect(() => {
        axios
            .get("/NewsPage")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setPageDesc(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Posts
    useEffect(() => {
        const fetchData = async () => {
            const result = await getFromStrapi(
                `/api/blogs?populate=cover`
            );
            if (result.success) {
                console.log("Data:", result);
                setPosts(result.data);
            } else {
                console.error("Fetch failed:", result.error);
            }
        };

        fetchData();
    }, []);

    // Footer
    useEffect(() => {
        axios
            .get("/footer")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setfooter(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
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

    return (
        <>
            <Head title="News Gold Tiger" />
            <div className="relative isolate bg-dark">
                {/* <Chatbot /> */}
                <Navbars />

                <div aria-hidden="true" className="relative">
                    <img
                        src={jobs}
                        alt="jobs"
                        className="h-2 w-full object-cover object-center "
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                </div>
                <News getPageDesc={getPageDesc} getPosts={getPosts} />

                <Footer getfooter={getfooter} />
            </div>
        </>
    );
}
