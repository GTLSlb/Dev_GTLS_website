import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";
import Video from "./Component/landingPage/video";
import News from "./Component/landingPage/News";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "@/Components/Navbars";

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
        axios
            .get(
                "http://localhost:1337/api/blogs?pagination%5BwithCount%5D=false&populate=cover",
                {
                    headers: {
                        Authorization: `Bearer 00c4e4f2e6367047b34383b974bba431b6b00352daaefda9f8d27b41cdfad2b3d8c2d43f1e005662e8939947dde5a7d47262bd3217b5d2946b2189ce6f102a420125bb983fed5c39ba87e14e63adafde9b40138bcdbbc7c76f94885b3bd6e975d4dcde2cbe1f820f8f3e0614da1ba6c40d943c7207f717c3a6e79c244bb403d1`,
                    },
                }
            )
            .then((response) => {
                // console.log('fetching data:',response.data);
                setPosts(response.data.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
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
