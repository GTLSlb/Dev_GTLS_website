import { Head } from "@inertiajs/react";
import jobs from "../assets/pictures/jobs.webp";
import { useState, useEffect } from "react";
import Video from "./Component/landingPage/video";
import News from "./Component/landingPage/News";
import PrimaryServices from "./Component/landingPage/Primaryservices";
import Footer from "./Component/landingPage/Footer";
import ContactForm from "./Component/landingPage/ContactForm";
import Navbars from "@/Components/Navbars";

const navigation = [
    { name: "Services", href: "/#services", ref: "services" },
    { name: "About", href: "/#about", ref: "about" },
    { name: "News", href: "/#news", ref: "news" },
    { name: "Contact Us", href: "/contact_us", ref: "contact" },
];

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
        axios.get('/NewsPage')
          .then(response => {
              // console.log('fetching data:',response.data);
              setPageDesc(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);

    // Posts 
    useEffect(() => {
        axios.get('/posts')
          .then(response => {
              // console.log('fetching data:',response.data);
              setPosts(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);

    // Footer
    useEffect(() => {
        axios.get('/footer')
          .then(response => {
              // console.log('fetching data:',response.data);
              setfooter(response.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      }, []);
      // ********************************************************* 
      // ********************* End requests  ********************* 
      // ********************************************************* 
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePreview, setResumePreview] = useState(null);

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
                <News getPageDesc={getPageDesc} getPosts={getPosts}/>
            
                <Footer getfooter={getfooter}/>
            </div>
        </>
    );
}
