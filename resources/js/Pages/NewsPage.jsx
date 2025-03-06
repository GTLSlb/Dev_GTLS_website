import { Link } from "@inertiajs/inertia-react";
import { Head } from "@inertiajs/react";
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
import jost5news from "../assets/news/Jost5.webp";
import BPWnews from "../assets/news/BPW.webp";
import Conferencnews from "../assets/news/Conference.jpeg";
import gearboxnews from "../assets/news/gearboxnews.jpeg";
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
import jaixtraining from "../assets/news/jaixtraining.jpeg";
import fireWardinImage from "@/assets/news/FireWarden.jpeg";
import fireWardinCoverImage from "@/assets/news/FireWardingCover.jpg";
import fireWardinBlogImage from "@/assets/news/FireWardenBlog.jpg";
import fireWardin2Image from "@/assets/news/FireWarden2.jpeg";
import fireWardin3Image from "@/assets/news/FireWarden3.jpeg";
import safetyImage from "@/assets/news/Safety-1.jpeg";
import safetyImage2 from "@/assets/news/Safety-2.jpeg";
import safetyImage3 from "@/assets/news/Safety-3.jpeg";
import safetyCoverImage from "@/assets/news/SafetyCover.webp";
import bTripleImage from "@/assets/news/b-triple.webp";
import nationalRoadImage from "@/assets/news/National-Road.webp";
import nationaCoverImage from "@/assets/news/NationalRoadCover.jpg";
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
import Navbars from "./Component/Navbars";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ReactPlayer from "react-player";
import cycloneImage from "@/assets/news/Cyclone.webp";
import cycloneUpdateImage from "@/assets/news/CycloneUpdate.webp";

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
    const { id } = usePage().props;

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

    const contentJson = [
        {
            id: 0,

            title: "FLEET BOOSTED BY 25 VOLVO EURO 6 PRIME MOVERS",
            content1:
                "Gold Tiger Logistic Solutions has added 25 new prime movers and trailers to its transport fleet, taking the total to more than 80 prime movers, 150 trailers and 35 delivery trucks based out of its Sydney headquarters.",

            content2:
                "The 600HP, Swedish-built prime movers will considerably increase Gold Tiger’s interstate line haul capacity, particularly on the Sydney–Brisbane and Sydney–Melbourne routes, as well as longer national hauls. The emissions profile of Volvo’s Euro 6 truck engine is a big improvement on the Euro 5, meeting tougher European standards rather than current Australian standards. Among other features, a Euro 6 engine has only one-fifth the nitrogen oxide emissions and half the particulate emissions of a Euro 5 engine. It also has greater fuel efficiency. The Euro 6 truck purchase is part of Gold Tiger’s commitment to running a modern transport fleet that reduces its impact on the environment. It is also part of a major business expansion underway at Gold Tiger (see next story). Gold Tiger’s all-Volvo prime mover fleet is backed by Volvo’s Gold maintenance program, which includes a regular maintenance schedule to the highest manufacturer standards, 24-hour breakdown repair around Australia, and replacement vehicles if trucks need to be off the road for more than 24 hours. This is backed up by weekly checks and servicing by qualified mechanics in our own on-site workshops.",

            imgUrl: postpic,
        },
        {
            id: 1,
            title: "GOLD TIGER IN $100M BUSINESS EXPANSION",
            content1:
                "Purpose-built transport hubs in Sydney and Brisbane are part of a $100-million business expansion now underway at Gold Tiger Logistic Solutions.",

            content2:
                "In Sydney, Gold Tiger has purchased land in the west at Kemps Creek, just off the M7 Motorway and next door to Badgerys Creek, where Sydney’s second airport is now under construction. Gold Tiger will build a 35,000sqm transport and warehousing facility as its new national headquarters. It is expected to open early in 2024. The new hub will have the latest warehousing and logistics technology, lots of space for quick truck turnarounds, ample storage space and a full on-site mechanics’ workshop for day-to-day truck servicing. The new building will also be 100% powered by its own solar energy system. Gold Tiger’s current fully owned transport and warehousing headquarters in Ingleburn, about 25 kilometres from the new site, will continue to operate, meaning the new facility will provide a huge boost to Gold Tiger’s capabilities and capacities.\n \n In Brisbane, Gold Tiger has purchased  land at Crestmead, south of Brisbane in the City of Logan, with easy access to the Logan Motorway. The company will build a 15,000sqm transport and warehousing hub, which will replace a smaller rented facility in Richlands.The Brisbane hub will be a similar but scaled down version of the Sydney hub, including a solar energy system to meet all its electrical needs. The Brisbane hub is planned to open by the end of 2023.",

            imgUrl: trucks,
        },
        {
            id: 2,
            title: "TC8300 Touch Computer implementation",
            content1:
                "Gold Tiger Logistics Solutions, an Australian logistics company, revolutionised their business three years ago by implementing a cutting-edge product scanning system.",

            content2:
                "With the product scanning system, Gold Tiger Logistics Solutions is able to track the movement of goods throughout the supply chain, from the moment they enter their facilities until they reach their final destination. The system provides real-time updates on the location and condition of each product, allowing the company to make timely decisions and adjustments to their processes. Since implementing the product scanning system, Gold Tiger Logistics Solutions has experienced significant growth in their business. The company has expanded their customer base and increased growth, thanks to the reliable and efficient services they are able to provide. “Product scanning has truly transformed the way we do business,” says Craig Dunscombe, CEO of Gold Tiger Logistics Solutions. “We are now able to provide our customers with unparalleled visibility into their supply chain, and this has been a game-changer for us.” Gold Tiger Logistics Solutions’ success story is a testament to the transformative power of technology in the logistics industry. As businesses continue to face increasing pressure to deliver goods faster and more efficiently, product scanning systems will undoubtedly become a crucial tool in their arsenal.",

            imgUrl: tcapp,
        },
        {
            id: 3,
            title: "VEHICLE TRACKING",
            content1:
                "Gold Tiger Logistics Solutions, a company in the transportation and logistics industry, has recently adopted three cutting-edge technologies to improve its operations.",

            content2:
                "Firstly, the VT102 AI-enabled fleet management solution provides real-time data on vehicle performance, driver behaviour, and safety-related incidents. This enables Gold Tiger Logistics Solutions to make informed decisions on vehicle deployment and maintenance, improve operational efficiency, and ensure compliance with safety regulations. Secondly, the MT201 in-cabin device is a ruggedized tablet that helps drivers maintain compliance, particularly in areas such as fatigue, speed, and maintenance. The tablet provides easy access to a wide range of applications, including Sentinel, a true EWD Electronic Work Diary, IAP, pre-trip checklists, customisable forms, document management, mass management, real-time fatigue alerts, messaging, job dispatch, and turn-by-turn navigation. Lastly, the Qtanium 200 4G tracking device is a self-contained, weatherproof tracking device that features a rechargeable battery pack, making it ideal for managing assets that are normally tethered to 12 or 24-volt systems but may sit disconnected for periods. It provides real-time tracking and reporting of the fleet’s location and status, and can detect motion, harsh usage, and impact, making it an ideal solution for tracking trailers. By adopting these technologies, Gold Tiger Logistics Solutions can optimize routes, reduce downtime, improve safety, and enhance its logistics and transportation services.",

            imgUrl: track,
        },
        {
            id: 4,
            title: "DRIVER PDA’S",
            content1:
                "Gold Tiger Logistics Solution, a prominent logistics company, is making waves with its purchase of product – Zebra TX57 PDA’s.",

            content2:
                "The company’s purchase has revolutionized the way their deliveries are tracked. TX57 is a state-of-the-art technology that enables customers to sign on glass proof of delivery (POD) electronically, eliminating the need for paper-based delivery receipts. This feature allows for seamless tracking and verification of deliveries, reducing the likelihood of delivery disputes. According to Gold Tiger Logistics Solution’s CEO, the TX57 product has been well-received by customers and is quickly gaining popularity in the logistics industry. The company streamlined delivery processes and improves overall customer satisfaction. “We understand the importance of providing our customers with the best possible experience, which is why we introduced TX57,” said the CEO. “Our innovative product is just one example of how we’re constantly looking for ways to improve our services and exceed customer expectations.” Gold Tiger Logistics Solution’s commitment to innovation and customer satisfaction has earned them a reputation as a leader in the logistics industry. With the introduction of TX57, the company continues to set the standard for excellence in delivery servi",

            imgUrl: device,
        },
        {
            id: 5,
            title: "GTLS EXPANSION",
            content1:
                "As part of the GTLS expansion a greenfield site has been purchased within the Ingleburn Industrial Estate. This is stage 1 in a major investment and development program for the company.",

            content2:
                "This will be ultimately be transformed into a state-of-the-art Transport and Warehouse facility as well as a modern service centre to maintain the Gold Tiger Fleet. With the increasing demand for high speed and efficient handling of freight supported by the latest in IT and communications systems this facility will be an essential part of Gold Tiger’s growth and development into the next decade.",

            imgUrl: goldt,
        },
        {
            id: 6,
            title: "GOLD TIGER LOGISTICS SOLUTIONS COMPLETES FIBRE INTERNET UPGRADE ACROSS ALL SITES",
            content1:
                "Gold Tiger Logistics Solutions has announced the completion of its internet upgrade, bringing fibre internet to all of its sites.",

            content2:
                "The upgrade is expected to boost connectivity and speed, potentially improving the company’s operations and customer service. The company has invested in upgrading its internet infrastructure to fibre technology, providing faster and more reliable connectivity to its sites. The upgrade is expected to enhance the company’s communication and data transfer capabilities, which could lead to increased productivity and efficiency. “We are thrilled to have completed this important upgrade to our internet infrastructure,” said a company spokesperson. “With fibre internet, we can ensure that our sites are connected at lightning-fast speeds, allowing us to deliver top-notch services to our customers.” The company has not disclosed the total cost of the upgrade, but it is expected to be a significant investment in the company’s infrastructure. Gold Tiger Logistics Solutions is a logistics company that specializes in transportation, warehousing, and distribution services. The company operates in multiple locations across the country and serves a variety of industries.",

            imgUrl: earth,
        },
        {
            id: 7,
            title: "GOLD TIGER LOGISTICS SOLUTIONS ADOPTS STATE-OF-THE-ART SOFTWARE TO ENHANCE STAFF SAFETY AND COMPLIANCE",
            content1:
                "Gold Tiger Logistics Solutions, a leading logistics and transportation company, has announced the adoption of a new cloud-based software platform to enhance staff safety and compliance.",

            content2:
                "The platform, developed by SkyTrust, will help the company manage safety and compliance issues, such as incident management, risk assessments, safety audits, and compliance reporting. According to Craig Dunscombe, a spokesperson for Gold Tiger Logistics Solutions, the adoption of the new software is part of the company’s commitment to ensuring the safety of its employees and customers. “As a logistics company, safety is our top priority,” he said. “We are always looking for ways to improve our safety performance and reduce the risk of incidents and accidents.” The SkyTrust software platform offers a range of safety and compliance management solutions, including tools for identifying potential hazards, assessing risks, and implementing effective control measures. It also provides features for managing safety incidents, such as near-misses and accidents, by facilitating the reporting, investigation, and analysis of incidents. Additionally, the platform offers compliance management tools to help companies comply with industry regulations and standards. “We chose the SkyTrust platform because it is the most comprehensive and user-friendly solution on the market,” Dunscombe added. “It will help us streamline our safety and compliance processes, improve our reporting capabilities, and ultimately enhance the safety of our staff and customers.” The adoption of the SkyTrust software platform is part of Gold Tiger Logistics Solutions’ ongoing efforts to enhance its safety performance and maintain its reputation as a leading logistics provider. With the new platform in place, the company is well-positioned to continue its growth and expansion while ensuring the highest levels of safety and compliance. About Gold Tiger Logistics Solutions Gold Tiger Logistics Solutions is a leading Australian logistics and transportation company that provides a wide range of services, including freight forwarding, and warehousing. With a focus on safety, efficiency, and customer service, the company has established itself as a trusted partner for businesses of all sizes.",

            imgUrl: safety,
        },
        {
            id: 8,
            title: "GOLD TIGER LOGISTICS SOLUTION IMPLEMENTS GEARBOX WORKSHOP SOFTWARE FOR STREAMLINED MAINTENANCE",
            content1:
                "Gold Tiger Logistics Solutions and their group of companies are making strides towards expanding their operations with several exciting developments underway.",

            content2:
                "The software, which was implemented 12 months ago, is already proving to be a valuable tool for the company’s maintenance team. According to Craig Dunscombe, a spokesman for Gold Tiger Logistics Solution, the decision to implement Gearbox was driven by a need to streamline their maintenance operations and improve efficiency. “We were looking for a software solution that could help us manage our maintenance operations more effectively, and Gearbox was the clear choice,” said Mr. Dunscombe. Gearbox workshop software provides a comprehensive solution for automotive repair businesses, with features such as appointment scheduling, inventory management, and transport management. Gold Tiger Logistics Solution will be using the software primarily for maintenance operations, including scheduling preventative maintenance and tracking repairs. The software has already had a significant impact on the company’s maintenance operations, with Mr. Dunscombe reporting that they have seen improvements in efficiency and communication. “With Gearbox, we’re able to track our maintenance operations more effectively, and we’re also able to communicate more easily with our maintenance team and Operations,” he said. Gold Tiger Logistics Solution is committed to investing in technology solutions that help them stay ahead of the curve in the logistics industry. The implementation of Gearbox workshop software is just one example of their commitment to innovation and excellence. With the success of the Gearbox implementation, Gold Tiger Logistics Solution is now exploring other technology solutions that can help them improve their operations and better serve their customers.",

            imgUrl: worker,
        },
        {
            id: 9,
            title: "GOLD TIGER LOGISTICS SOLUTIONS: UNVEILING EXCITING DEVELOPMENTS AND EXPANDING OPERATIONS",
            content1:
                "Gold Tiger Logistics Solution, a leading logistics and transportation company, has recently implemented Gearbox workshop software to manage their maintenance operations.",

            content2:
                "Firstly, the company has submitted a Development Application (DA) for their new Ingleburn site.This formal request for approval is a crucial step towards the realization of this project. Gold Tiger Logistics Solutions aims to build a state-of-the-art workshop at the site, which will be able to accommodate general and major repairs if they ever arise. Similarly, the company has also submitted a DA for their new Brisbane site, indicating their commitment to expanding their reach and providing efficient services to their clients. Gold Tiger Logistics Solutions is also actively encouraging overseas heavy vehicle mechanics to be sponsored. The company is committed to investing in and attracting top talent from around the world, which will help to bolster the quality of their services. In addition to these developments, Gold Tiger Logistics Solutions has also expanded its overseas support team. The company has hired professionals in Customer Support, Accounts, and IT (programmers and developers) to ensure that they can provide world-class services to their clients. According to Craig Dunscombe, the company’s spokesman, Gold Tiger Logistics Solutions has invested over 1 million dollars in development costs over the past 12 months. This significant investment underscores the company’s commitment to growth and development. Gold Tiger Logistics Solutions is a leading logistics company that has established a strong reputation for providing reliable and efficient services to their clients. With these exciting developments underway, the company is well-positioned to continue to provide top-quality services to their clients while expanding their reach and operations.",
            imgUrl: newSite,
        },
        {
            id: 10,
            title: "GOLD TIGER LOGISTICS SOLUTIONS CONTINUES ADVANCEMENT WITH THREE NEW VOLVO F16 PRIME MOVERS",
            content1:
                "Gold Tiger Logistics Solutions has, this week taken delivery of three new Volvo F16 (Euro 6) prime movers as part of its continuing commitment to constantly modernising and upgrading the fleet. Gold Tiger has used Volvo equipment since the company was formed in 2006 and the partnership has gone from strength to strength over the years.",

            content2:
                "The Volvo F16 incorporates the latest in Volvo technology with the latest D16 engine with up to 650 hp for Euro 6. The D16 engines are more efficient than ever – maximising the fuel efficiency of the vehicle while minimising emissions. The new Volvo vehicles incorporate Volvo’s Dynamic Steering System which enables the vehicle to maintain directional control and total stability even in the event of a high wind event – a perennial problem in the past with long distance trucks and causing abrupt and unexpected lane changes on interstate highways. The Dynamic Steering System also helps avoid skidding with its active steering/suspension management control function. Gold Tiger Logistics Solutions maintains a Gold Level Service Contract with Volvo Australia. This means that thanks to the vehicle’s built-in connectivity technology, Volvo can plan workshop visits according to driven mileage and the wear and tear of key components. Potential issues can be avoided before they occur. We will not be sitting on our laurels, however. This is all part of the Gold Tiger program to continue carrying the company forward by utilising the most modern and efficient technology available and thus continuing to be at the cutting edge of service provision to our customers.",
            imgUrl: movers,
        },
        {
            id: 11,
            title: "GTLS Enhances Road Safety and Efficiency with Advanced Weighbridge Integration",
            content1:
                "Gold Tiger Logistics Solutions (GTLS) remains committed to the safety of all road users. As part of our ongoing safety innovation program, we take considerable pride in announcing a significant enhancement to our safety practices through the integration of two state-of-the-art weighbridge systems. The latest of these cutting-edge weighbridges, recently installed in the Sydney depot, complements the similar unit introduced last year in the Melbourne depot. Together, they enhance our dedication to setting the benchmark at no less than the industry accepted world’s best practice. With the introduction of this second weighbridge a remarkable 80% of all interstate linehaul movements are now undergoing thorough checks before departing from our depots and GTLS is therefore proactively taking measures to prevent overloaded vehicles from venturing onto Aussie roads.",

            content2:
                "This not only lightens the burden on our road infrastructure but also guarantees that all our vehicles operate within the legally prescribed weight limits.As a major component within our ongoing commitment, we have introduced these advanced weighbridge systems not only augmenting our capabilities but also revolutionizing the weighing process by automating it, thus eliminating human errors. It is the responsibility of Gold Tiger Logistics Solutions to ensure that our weighing procedures are robust enough to shield consumers from inaccuracies in product weight, thereby preserving their trust in our services.  Moreover, these systems also serve as invaluable tools for our internal documentation requirements. Both weighbridge systems now play pivotal roles in streamlining the management of incoming/ outgoing vehicles, significantly boosting overall operational efficiency. With the implementation of two advanced weighbridge systems, we eliminate the need for time-consuming reloads, ensuring that no time or effort is wasted, while passing on cost savings and maintaining DIFOT efficiency for consignments. An added benefit of these new weighbridges is their time-saving feature. They empower drivers to verify the vehicle's weight before leaving the depot, allowing them to adjust accordingly. This remarkable advancement expedites operations substantially and creates a higher degree of confidence from our drivers, assuring them that the vehicle they are operating complies fully with safety standards and is perfectly suited for its intended purpose. With the dual strength of these weighbridges, GTLS is better equipped than ever to uphold the highest standards of safety, compliance, and efficiency in the logistics industry.",
            imgUrl: weighbridge,
        },
        {
            id: 12,
            title: "Maintaining the safety of your drivers is a primary concern to our organisation.",
            content1:
                "Gold Tiger Logistics solutions continues to maintain and develop best practice standards in all aspects of driver safety and constantly strives to ensure safety standards are both met and exceeded. A major focus in long distance transport safety is the issue of drivers’ fatigue. Utilising the latest technology as part of our safety and compliance processes, Gold Tiger has collaborated with Navman, one of the world’s most innovative companies in automotive technology and risk reduction. Reducing risk begins by acknowledging what constitutes good and bad driving behaviour. While producing valuable data and developing key performance indicators the utilisation of this 21st Century technology assists in mitigating driving risk. The introduction of Driver Scorecards ,Smart Dashcams and Digital Inspections are just some of the processes that have been developed from this line of research. At Gold Tiger we are developing a culture of safety to extend the life of your fleet as well. We are monitoring and assessing the signs of Risk-mitigating Driving Behaviour that includes the following: ",
            list: [
                {
                    id: 0,
                    title: "Signs of fatigue and pulling over to rest before continuing the journey",
                },
                {
                    id: 1,
                    title: "Adhering to speed limits, stop signs, and traffic signals.",
                },
                {
                    id: 2,
                    title: "Conducting pre- and post-trip vehicle inspections.",
                },
                {
                    id: 3,
                    title: "Using an app with an automated reply to tell people the driver will respond to their incoming text messages only when it is safe to do so.",
                },
                {
                    id: 4,
                    title: "Eating at established mealtimes while parked rather than trying to dine on the go.",
                },
                {
                    id: 5,
                    title: "Getting behind the wheel while fatigued or impaired.",
                },
                {
                    id: 6,
                    title: "Using a phone while driving.",
                },
                {
                    id: 7,
                    title: "Driving while angry or upset to the point of distraction.",
                },
                {
                    id: 8,
                    title: "Taking sudden and unpredictable actions such as lane changes and harsh braking.",
                },
            ],
            content2:
                "The accurate assessment of this data enables Gold Tiger to record and benchmark against driver data, based on their performance and view incidents in real-time with Safety Analytics that will positively impact future safety and compliance regulations implementation.",
            imgUrl: Navman,
        },
        {
            id: 13,
            title: "Gold Tiger's Green Journey",
            list: [
                {
                    id: 0,
                    title: "Gold Tiger's Green Journey: Innovating with Harmony",
                    content:
                        "As we firmly pledge to eco-friendliness, join us on the road to a better future. We at Gold Tiger Group are a force for positive change rather than just a logistics provider.",
                },
                {
                    id: 1,
                    title: "Setting Our Sights on Net-Zero Emissions",
                    content:
                        "By 2030, we want to achieve net-zero emissions throughout the whole GTLS supply chain. We support establishing goals based on convincing evidence, plausible predictions of future levels of success, and knowledge of emerging technologies. Of course, the goal is to make this vision a reality.",
                },
                {
                    id: 2,
                    title: "The Volvo FH Electric: Setting the Standard for Sustainability",
                    content:
                        "One of our key initiatives is the integration of the Volvo FH Electric, a truck with the capability of meeting our ambitious sustainability goals. This remarkable vehicle boasts a colossal power of up to 490 kW/666 hp, driven by a unique traction control system. It can carry up to 44 tonnes GCW and cover distances of up to 300 km - all while leaving a significantly smaller carbon footprint.",
                },
                {
                    id: 3,
                    title: "Direct Experience with Excellence",
                    content:
                        "We actually live up to our words rather than just talking the talk. Attending a live demonstration displaying the excellent performance of the Volvo Electric Truck was an honour for Gold Tiger Group. This experience strengthened our dedication to environmentally friendly logistics.",
                },
                {
                    id: 4,
                    title: "A Forward-Looking Step",
                    content:
                        "More than just a commercial choice, adding Volvo electric trucks to our fleet is a move towards a more sustainable future. Our association with Volvo extends beyond the Primemover itself. Our efforts are supported by cutting-edge assistance thanks to the Volvo Gold repair Contract, which includes battery monitoring, secure uptime, and predictive repair planning.",
                },
                {
                    id: 5,
                    title: "Creating the Future Together with Volvo",
                    content:
                        "In the near future, Gold Tiger Group plans to deploy a fleet of Volvo electric trucks. As part of our partnership with Volvo, we are also researching ways to maximise the truck's range so that we can lead the way in environmentally friendly logistics.",
                },
            ],
            content2:
                "This not only lightens the burden on our road infrastructure\nbut also guarantees that all our vehicles operate within the legally prescribed weight limits..",
            imgUrl: greennews,
        },
        {
            id: 14,
            title: "Acknowledging Our Journey: On-Site Fleet Fuelling",

            content1:
                "Acknowledging Our Journey: On-Site Fleet Fuelling\n\nIn our continuous pursuit for excellence and innovation, we are proud to announce that we have enhanced operational efficiency with onsite fuel tanks. It is considered a significant stride forward for GTLS for its remarkable advantages.",
            content2:
                "Advantages of onsite Fleet Refueling\n\nIt provides more personalized and customizable fuelling schedules and options and can be much easier to handle. Also, it increases driver productivity and affects his total ability to reach his goals per day, freeing more time for productive tasks and possibly even more deliveries.\n\nOne of the most significant advantages of fleet fuelling is the ability to fuel trucks overnight and taking advantage of this downtime. Fleet fuelling can reduce the difference between your drivers' schedules and create a more efficient delivery schedule for the fleet.\n\nSustainability and Security: The move to onsite fuel tanks aligns with our commitment to sustainability. By streamlining our fuelling processes, we contribute to a greener and more environmentally responsible future.\n\nIt is more secure to have onsite tanks, as mentioned before, having a dedicated fuelling tank eliminates some of the problems with going to a retail fuelling station, which brings its own challenges. It represents a game-changing development for GTLS, which acknowledges that we are creating strong foundations, tailoring our services to our clients need individual needs. Such initiatives have proven the effectiveness and commitment to delivering top-notch services while prioritizing operational efficiency",
            imgUrl: onSiteFueling,
        },
        {
            id: 15,
            title: "Employees safety and Health practices at GTLS",

            content1:
                "At Gold Tiger Logistics Solutions, O.H&E one of our priority is making sure our team stays safe and healthy. We do this by constantly checking for any possible dangers related to equipment, whether it's at our own sites or where we're serving our customers. We give our team the knowledge and tools they need to handle safety procedures, equipment, and emergencies confidently. We make sure everything from our vehicles to our gear is in optimal working condition through regular check-ups and thorough training on how to use them safely. We even pay attention to small details like the right boots, gloves, or clothing we wear.",
            content2:
                "To prevent injuries, we teach proper techniques and promote ergonomic practices, like using forklifts and pallet jacks the GTLS WAY to lower risks. We also stress the importance of safe driving, like sticking to speed limits, buckling up, and staying focused on the road. In case of emergencies, everyone knows exactly what to do thanks to clear communication about evacuation plans, fire drills, and first aid procedures. At Gold Tiger Group, we're all about keeping our team healthy and happy and goes home safety. We encourage everyone to speak up about any hazards or safety concerns they notice. We're always reviewing and updating our safety procedures to make sure we're following the best practices in the industry. By making safety a priority, we're creating an environment where our team can thrive without worrying about their well-being.",
            imgUrl: EmployeesSafety,
            videoUrl: gtlsway,
        },
        {
            id: 16,
            title: "Safety Week at GTLS: Join Us in Sharing the Road Safely!",

            content1:
                "At Gold Tiger, ensuring road safety is not just a commitment but a core value we hold dearly. It's crucial for us to safeguard not only our employees and clients but also the wider community. To achieve this goal, we consistently invest in training programs for our drivers. These programs cover a wide range of topics, including defensive driving techniques, safe loading and unloading procedures. Additionally, we place a high priority on regular vehicle maintenance to ensure that all our trucks are in top-notch condition. By actively addressing both positive and negative driving behaviours, we're better equipped than ever to uphold the highest standards of safety, compliance, and efficiency in the logistics industry.",
            content2:
                "As part of our safety commitment, we conduct thorough checks on all movements before they leave our depots. This proactive approach helps us prevent overloaded vehicles from hitting the roads, reducing the risk to al road users.We continuously toolbox the importance of road safety to our team, stressing the significance of adhering to speed limits and driving according to road conditions, weather, and traffic patterns. Beyond our internal efforts, we actively engage with local communities to raise awareness about road safety issues. By taking a proactive stance in incident prevention and advocating for safer roads, we aim to make a positive impact that extends beyond our business operations.",
            imgUrl: weeklySafety,
            videoUrl: RoadSafety,
        },
        {
            id: 17,
            title: " Elevating Safety and Efficiency: The Gearbox Training Program at Gold Tiger Logistics Solutions",

            content1: `At Gold Tiger Logistics Solutions (GTLS), safety and compliance are absolutely crucial. They're at the heart of our commitment to running efficiently and developing our team. A key part of this commitment is our "Gearbox" with the user software training program. It's tailored to enhance the technical skills of our maintenance crew.

                The Gearbox training covered everything from how vehicles operate to preventive maintenance and safety protocols. It gives our team detailed insights into vehicle conditions, maintenance schedules, service procedures, tyre care, and timely maintenance alerts. Beyond the technical side, the training also delves into managerial aspects such as pre-start inspections, keeping maintenance records, managing workflows, and conducting compliance checks. This ensures we not only meet but exceed NHVR requirements, giving us the confidence to make on-time deliveries that meet our customers' growing demands.`,
            content2: `Moreover, our commitment to ongoing training extends across our workshop teams and management personnel. We equip them with essential tools and procedures such as dashboard metrics utilising a traffic light system, efficient vehicle record management, streamlined job card processing, optimised work scheduling, and meticulous parts inventory management. This accessibility is facilitated through a user-friendly live dashboard accessible via mobile devices or PCs, crucial in navigating today's fast-paced logistics environment.

                Compliance remains a top priority at GTLS. While many of our vehicles benefit from Volvo's Platinum Maintenance package, our dedication to safety extends beyond routine maintenance. We conduct proactive random inspections based not only on timeframes but also on KM projections, leveraging our partnership with Navman for GPS tracking. This proactive approach ensures that we consistently uphold the highest standards and regulations, safeguarding the safety of our drivers, fleet, and all road users.
                
                At Gold Tiger Logistics Solutions, we are committed to setting new benchmarks in safety, efficiency, and customer satisfaction. Through our robust training programs, proactive maintenance strategies, and unwavering commitment to compliance, we continue to lead the way in delivering excellence across Australia's logistics landscape.
                
                Stay tuned as we share more insights and updates on how GTLS is transforming logistics with innovation and dedication.`,
            imgUrl: Efficiency,
        },
        {
            id: 18,
            title: "Training Session Recap: Mastering the Jost 5th Wheel",

            content1: `Today, our team at Gold Tiger Logistics Solutions (GTLS) participated in a comprehensive training session with Jost, focusing on the inner workings of the Jost 5th wheel.

                While we’ll be holding a separate session for our drivers, today was all about our WHSP team.
                
                In-Depth Review for our WHSP Specialists
                
                While we plan to conduct a separate training session for our drivers, today's focus was on equipping our specialists with detailed knowledge about the Jost 5th wheel.

                The session covered:`,
            list: [
                {
                    id: 0,
                    title: "Tolerances and Senses:",
                    content:
                        "Understanding the precise tolerances and sensory checks required for optimal performance.",
                },
                {
                    id: 1,
                    title: "Replacement Guidelines:",
                    content:
                        "Knowing when it's time to replace the 5th wheel to maintain safety and efficiency.",
                },
                {
                    id: 2,
                    title: "Torque Tension Requirements:",
                    content:
                        "Learning the exact torque tension needed for proper installation and maintenance.",
                },
            ],
            content2: `Refresher and Introduction

            Our WHSP team, comprising long-term members and six new specialists, benefited from this refresher session. It was an excellent opportunity for seasoned professionals to refresh their knowledge and for new team members to get up to speed. The session was highly interactive, allowing everyone to ask questions and gain insights from the Jost expert.
            
            Empowering Our Team
            
            The training aimed to empower our WHSP specialists, both veterans and newcomers, with the knowledge and confidence to ensure the safety and reliability of our fleet. By understanding the Jost 5th wheel in-depth, our team can better support our drivers and maintain the high standards of safety and efficiency that GTLS is known for.
            
            We extend our gratitude to the Jost team for their expertise and support in making this training session a success.
            
            Stay tuned for more updates as we continue to enhance our team's skills and knowledge.`,

            imgUrl: JostCover,
        },
        {
            id: 19,
            title: "GTLS Unleashes the Power of BPW: A Recap of Our Wheel Hubs and Bearings Training!",

            content1: `Power-Up with BPW Wheel Hubs Training!

            Today, our workshop team participated in an engaging hands-on training session led by BPW Hub experts!
            
            We had the privilege of learning from leading industry professionals who imparted their invaluable knowledge and techniques.
            
            Wondering why GTLS relies on BPW Wheel hubs?
            
            Here’s the inside scoop! 👇
            
            What Are BPW Wheel Hubs?

            BPW Wheel hubs are essential components for heavy vehicles, housing the wheel bearings that ensure smooth rotation around the axle. Engineered to handle substantial loads and tough driving conditions, BPW hubs come with an impressive 1 million KM warranty, highlighting their industry-leading reliability. At GTLS, our commitment goes beyond driver safety to enhance overall road safety. By opting for BPW hubs, we deliver superior performance, bolstering our service and solidifying our reputation as a preferred supplier for our clients with punctual, reliable deliveries.
            
            `,
            listTitle: "Features of BPW Hubs:",
            list: [
                {
                    id: 0,
                    title: "Integrated Braking Systems",
                    content:
                        "Enhances safety and control by ensuring balanced braking.",
                },
                {
                    id: 1,
                    title: " Advanced Lubrication Systems",
                    content:
                        "Reduces maintenance needs and extends hub lifespan.",
                },
                {
                    id: 2,
                    title: "Exceptional Durability:",
                    content:
                        "Engineered to withstand heavy loads and the harsh conditions of Australian roads.",
                },
            ],
            list2Title: "Today’s Highlights",
            list2: [
                {
                    id: 0,
                    title: "Integrated Braking Systems",
                    content:
                        "Enhances safety and control by ensuring balanced braking.",
                },
                {
                    id: 1,
                    title: " Advanced Lubrication Systems",
                    content:
                        "Reduces maintenance needs and extends hub lifespan.",
                },
                {
                    id: 2,
                    title: "Exceptional Durability:",
                    content:
                        "Engineered to withstand heavy loads and the harsh conditions of Australian roads.",
                },
            ],
            content2: `With GTLS vehicles receiving B-level service regularly, our use of BPW bearings and hubs ensures we exceed industry standards and uphold our commitment to reducing heavy vehicle impact on Australian roads.

            A massive shoutout to the GTLS team and BPW experts for making this training both informative and engaging!
            
            Let’s keep the momentum going as we continue to lead and innovate in the transport industry.
            
            Together, we’re steering towards a brighter future!
            
            #BPWTraining #InnovationInMotion #TeamExcellence #FutureReady`,

            imgUrl: BBWImage,
        },
        {
            id: 20,
            title: "GTLS Shines at the 2024 Road Freight NSW Conference & Awards Day!",
            content1: `Mr. Imad El Masri, director of GTLS, made a notable contribution at the 2024 Road Freight NSW Conference & Awards day. This event was a significant gathering for networking and discussing pivotal transformations reshaping the road freight industry in NSW.

            Key highlights included:
            `,
            list: [
                {
                    id: 0,
                    title: "Government Initiatives:",
                    content:
                        "Mr. John Graham, Minister for Roads, and Ms. Jenny Aitchison, Minister for Transport and Regional Roads, emphasised making Sydney freight-friendly and improving regional roads.",
                },
                {
                    id: 1,
                    title: "Industry Issues",
                    content: [
                        "Various speakers addressed crucial issues such as compliance, Chain of Responsibility (CoR), and alternative energy sources.",
                        "Key topics included road safety, load restraint, speed management, and fatigue management.",
                    ],
                },
                {
                    id: 2,
                    title: "Environmental Innovations:",
                    content: [
                        "Mr. Aaron Smith discussed the shift to hydrogen/diesel dual fuel.",
                        "BP representatives outlined the benefits of biodiesel.",
                    ],
                },
                {
                    id: 3,
                    title: "Driver Health & Workplace Relations:",
                    content:
                        "Discussions centred around the latest changes to industrial relations laws and amendments to the Workplace Relations Act.",
                },
                {
                    id: 4,
                    title: "Interactive Learning:",
                    content:
                        "The conference featured a driving simulator, providing attendees with hands-on experience and highlighting the latest in driver training technology.",
                },
            ],
            content2: `The conference provided a comprehensive exploration of the industry’s most pressing challenges and promising innovations, including PBLIS amendments, new compliance measures, and advancements in automation and security.

            The event underscored the importance of collaboration and innovation in driving the road freight industry forward.
            
            Thanks to the organisers for a successful conference!
            
            #GTLS #RoadFreight #NSW #IndustryInnovation #Compliance #Sustainability #DriverHealth #WorkplaceRelations`,
            imgUrl: Conferencnews,
            imgSliders: [
                Conferencnews,
                Conferencnews2,
                Conferencnews3,
                Conferencnews4,
                Conferencnews5,
                Conferencnews6,
                Conferencnews7,
                Conferencnews8,
                Conferencnews9,
                Conferencnews10,
                Conferencnews11,
            ],
        },
        {
            id: 21,
            title: "GTLS: A Strategic Vision",
            content1: `At Gold Tiger Logistics Solutions (GTLS), we’re committed to more than just ticking boxes; we focus on building a strong, supportive team and sustaining robust processes for the long term. Which is why today we revisited the Gearbox training from 6 weeks ago, conducting an internal audit to ensure we stay at the forefront of maintenance excellence and continue to uphold our high DIFOT standards. This commitment is crucial to maintaining our position as a preferred supplier within the FMCG sector.`,

            content2: `By continuously auditing our internal processes and fostering a culture of continuous improvement, with a key focus on safety, we continue to seek ways to enhance our operations. This approach not only allows us to deliver cost savings but also reduces CO2 emissions.`,
            imgUrl: gearboxnews,
        },
        {
            id: 22,
            title: "Jaix Logistics Software Recap Training and information updates",
            content1:
                "This week the Jaix Logistics Support and Implementation Specialist was embedded at our Sydney head Office for some valuable recap training which involved all departments within Gold Tiger Logistics Solutions including Operations (Transport and Warehousing departments), Administration, Customer Service, IT and Sales. Jaix Logistics Software is a complete supply chain solution. Gold Tiger Logistics Solutions utilise Jaix for our supply needs including 3PL Warehouse Management, Transport Management from customer portal, pick up allocations, linehaul and timeslot delivery requirements. Our Jaix partner this week provided further recap training to the team which included:",
            list: [
                {
                    id: 0,
                    title: "Freight management (Despatch, fleet and pick up Allocation, Bookings management, Linehaul Allocation, manifesting and delivery timeslots)",
                },
                {
                    id: 1,
                    title: "Warehousing (3PL management)",
                },
                {
                    id: 2,
                    title: "Administration and Customer Service including (Tracking of consignments and other valuable information)",
                },
                {
                    id: 3,
                    title: "Sales (rating and zone options, quoting and reporting modules)",
                },
            ],
            content2:
                "A big thank you to our Support and Implementation Specialist at Jaix and we will see you again soon for more valuable recap training. The Gold Tiger Logistics team has gained some valuable insights and is an extension to our current knowledge base and Freight and Warehousing Management expertise within.",
            imgUrl: jaixtraining,
        },
        {
            id: 23,
            title: "Fire Warden, Fire Extinguisher & Fire Blanket Training.",
            content1: `We welcomed an expert trainer in the field of fire safety in the workplace to Gold Tiger Logistics Solutions. The training provided has given our Chief Fire Warden and his fellow Fire Wardens the skills and knowledge to manage fire emergencies and other threats in the workplace.
           
            The training included:
            `,
            list: [
                {
                    id: 0,
                    title: "A presentation from the trainer to our Chief Warden & Fire Wardens.",
                },
                {
                    id: 1,
                    title: "Evacuation procedures",
                },
                {
                    id: 2,
                    title: "Fire extinguisher use",
                },
                {
                    id: 3,
                    title: "Live fire situations",
                },
                {
                    id: 4,
                    title: "Simulated live fire practical training including the use of extinguisher & fire blankets",
                },
                {
                    id: 5,
                    title: "Building structures / warning and detection systems",
                },
                {
                    id: 6,
                    title: "Warden structures, their roles and responsibilities",
                },
                {
                    id: 7,
                    title: "Alarm, conditions, evacuation procedures, searching & reporting",
                },
                {
                    id: 8,
                    title: "Bomb threat procedures",
                },
                {
                    id: 9,
                    title: "Documented evacuation drill & reporting requirements",
                },
            ],
            content2: `Thank you to our Expert trainer for attending Gold Tiger Logistics Solutions facility and providing important skills and knowledge to the designated Fire Wardens within GTLS.

            `,
            imgUrl: fireWardinCoverImage,
            imgSliders: [fireWardinImage, fireWardin2Image, fireWardin3Image],
        },
        {
            id: 24,
            title: "Building a Safety-Conscious Workforce with Fire & Safety Australia",
            content1: `Building a Safety-Conscious Workforce with Fire & Safety Australia
                At Gold Tiger Logistics Company, safety is at the heart of our operations. Recently, our team participated in an essential firefighting training session, facilitated by Fire and Safety Australia, as part of our ongoing commitment to safety and compliance.
                
                The training covered the following areas:`,
            list: [
                {
                    id: 0,
                    title: "Fire Prevention Strategies: Understanding the common causes of workplace fires and how to implement preventative measures.",
                },
                {
                    id: 1,
                    title: "Emergency Response: How to assess and react quickly to various types of fires, ensuring the safety of all personnel.",
                },
                {
                    id: 2,
                    title: "Use of Firefighting Equipment: Hands-on practice with fire extinguishers, fire hoses, and other essential firefighting tools.",
                },
                {
                    id: 3,
                    title: "Evacuation Procedures: Ensuring that all staff know how to evacuate safely and efficiently in case of a fire.",
                },
            ],
            content2: `By equipping our employees with practical firefighting skills, we not only meet our compliance obligations but also foster a culture of safety within Gold Tiger Logistics. Our workforce is now more confident in managing fire risks and more prepared to protect each other and our assets in an emergency.

                Staying Compliant and Safe
                
                Compliance with safety regulations is essential for Gold Tiger’s continued success. Firefighting training is just one part of our broader safety strategy that ensures we adhere to national workplace safety standards while prioritizing the well-being of our employees.
                
                This training further solidifies our commitment to safety and excellence in logistics, keeping our operations running smoothly while safeguarding our most valuable assets—our people.`,
            imgUrl: safetyCoverImage,
            imgSliders: [safetyImage, safetyImage2, safetyImage3],
        },
        {
            id: 25,
            title: "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight Transport",
            content1: `We’re thrilled to announce our latest service upgrade – the addition of B-triple configurations to our fleet! Known for their increased capacity and efficiency, B-triples are among the most powerful solutions for long-haul freight. These trucks consist of three trailers, each securely coupled to maximize load volume while maintaining stability on the road.

                Key Benefits of Our B-Triple Solution`,
            list: [
                {
                    id: 0,
                    title: "Higher Load Capacity:",
                    content:
                        "With an extra trailer, B-triples allow us to transport more goods per trip, which is ideal for customers with large-volume shipments or high-frequency needs.",
                },
                {
                    id: 1,
                    title: "Separation of Fragile Goods:",
                    content:
                        "Our Trailers are fitted with adjustable mezzanine floors to cater for delicate or fragile goods that cannot be double stacked in transit thus preventing damage to your products while in transit.",
                },
                {
                    id: 2,
                    title: "Enhanced Fuel Efficiency:",
                    content:
                        "By moving more freight in fewer trips, B-triples provide a more fuel-efficient solution that reduces environmental impact.",
                },
                {
                    id: 3,
                    title: "Extended Reach:",
                    content:
                        "Our B-triple solution will operate on specific approved routes across major states, enabling us to deliver goods faster over longer distances.",
                },
                {
                    id: 4,
                    title: "Reliability and Safety:",
                    content:
                        "Safety is our priority. Our B-triple trucks are equipped with state-of-the-art monitoring systems, and our drivers undergo specialized training to handle these configurations with care and precision.",
                },
            ],
            content2: `As we roll out this service, we’re committed to continuing our high standards in freight logistics. The B-triple expansion reflects our dedication to adapting and growing to meet the evolving needs of our customers. Enquire today by calling 1800 04 03 06 to learn more about how our B-triple solution can benefit your business!

            `,
            imgUrl: bTripleImage,
            youtubeUrl: "https://youtu.be/lqfwHrotJLs?si=fU6BWcJgR9CUmKkQ",
        },
        {
            id: 26,
            title: "Introducing Gold Tiger Logistics’ National Road Alerts Feature",
            content1: `At Gold Tiger Logistics Solutions, we recognise that real-time information is crucial in the fast-paced logistics industry. That’s why we’re thrilled to unveil our new Road Alerts Map service. A powerful tool designed to keep you informed, empowered, and ready to navigate potential disruptions.
                
               <b>Why the Road Alerts Service?</b> 
                This feature is more than an information hub; it’s a step toward smarter logistics and stronger customer partnerships. Here’s what it offers:`,
            list: [
                {
                    id: 0,
                    title: "Enhanced Transparency: Get real-time updates on road incidents and disruptions potentially affecting delivery schedules.",
                },
                {
                    id: 1,
                    title: "Improved Reliability: Plan and adjust proactively with up-to-date information.",
                },
                {
                    id: 2,
                    title: "Streamlined Communication: Stay informed seamlessly without needing to request updates.",
                },
            ],
            content2: ` <b>How It Works</b>
            Accessible via our website, the Road Alert service features an intuitive interface displaying consolidated information from various state authorities onto a single map:
             `,

            list3: [
                {
                    id: 0,
                    title: " Updates for four states in one view.",
                },
                {
                    id: 1,
                    title: " Frequent updates on major transport routes.",
                },
                {
                    id: 2,
                    title: "Events covering roadworks, accidents, weather events, hazards, major events, and congestion.",
                },
            ],
            content3: `This innovation reflects our commitment to being a trusted partner by delivering transparency, reliability, and exceptional service every kilometre of the way.

            <b>Explore the Road Ahead</b>
            We invite you to experience the new Road Alert feature and see how Gold Tiger Logistics Solutions is enhancing logistics and driving better customer experiences. Together, let’s navigate the road ahead with confidence, efficiency, and reliability.
           
            <b>Contact us today to discuss more about our warehouse and freight services! </b>`,
            imgUrl: nationaCoverImage,
            imgSliders: [nationalRoadImage],
        },
        {
            id: 27,
            title: "Cyclone Alfred Update Wednesday 5th March 2025 – Freight Disruptions & Safety Advisory",
            content1: `Gold Tiger Logistics Solutions is closely monitoring Tropical Cyclone Alfred, which is expected to impact <b>Queensland and Northern New South Wales</b> over the coming days. As safety remains our top priority, we want to keep you informed about potential freight disruptions and what to expect.
            
            <b>Weather Outlook:</b>`,
            list: [
                {
                    id: 0,
                    title: `<b>Cyclone Movement</b> – Cyclone Alfred (Category 2) is moving west towards the Queensland coast, with <b>sustained winds of 95 km/h</b> and gusts up to <b>120 km/h.</b>`,
                },
                {
                    id: 1,
                    title: `<b>Damaging Winds</b> Damaging Winds – Strong winds up to <b>120 km/h</b> are expected along the <b>southeast QLD and northeastern NSW</b> coastal regions, from <b>Tewantin to Grafton on Wednesday</b>, and may extend further north to <b>Sandy Cape</b> by early Thursday.`,
                },
                {
                    id: 2,
                    title: `<b>Heavy Rain & Flooding</b> – Heavy rainfall is forecast for <b>southeast QLD and northeastern NSW</b> from Wednesday, with the potential for <b>life-threatening flash flooding</b> as the cyclone nears the coast late Thursday or early Friday.`,
                },
            ],
            content2: ` <b>What this means to you and the impact on Freight Services:</b>
             `,

            list3: [
                {
                    id: 0,
                    title: `<b>Brisbane Depot Closure</b> – To ensure the safety of our QLD team, <b>our Brisbane depot will close at noon on Thursday, 6th March 2025.</b> This will allow our staff and drivers to return home safely and prepare for the storm. The depot will remain <b>closed on Friday, 7th March,</b> with reopening updates to follow once conditions allow.`,
                },
                {
                    id: 1,
                    title: `<b>Delivery Delays Expected</b> – Significant freight disruptions are anticipated due to road closures and severe weather. <b>No freight will be dispatched to our QLD depot on Thursday or Friday.</b> We will reassess the situation and provide updates once operations resume.`,
                },
                {
                    id: 2,
                    title: `<b>Safety First</b> – We are actively monitoring weather conditions and adjusting operations to prioritise the <b>safety of our drivers, freight, and the communities we serve.</b>`,
                },
                {
                    id: 3,
                    title: `<b>Protecting Freight</b>Protecting Freight – All vehicles will be securely stored within our <b>Brisbane warehouse</b>, and <b>customer goods will be raised and placed within vehicles</b> inside the warehouse to minimise the risk of water damage from potential flooding.`,
                },
                {
                    id: 4,
                    title: `<b>Ongoing Updates</b> – We will continue to provide updates as more information becomes available.`,
                },
            ],
            content3: `To all Customers, communities, businesses, and transport workers affected; Please stay safe, take every precaution and follow official safety advisories.

            We appreciate your patience and understanding during this time. If you have any urgent inquiries regarding your freight, please contact our team on <b>1800 040 306</b>`,
            imgUrl: cycloneImage,
            imgSliders: [cycloneImage],
        },
        {
            id: 28,
            title: "Cyclone Alfred – Ongoing Monitoring – Thursday, 6th March 2025",
            content1: `Dear Customers,
            As per our previous communication, we continue to closely monitor <b>Cyclone Alfred</b> and its impact on freight operations. While there are no major updates at this time, we want to assure you that <b>safety remains our top priority</b> as we assess conditions.
            
            <b>Current Status:</b>`,
            list: [
                {
                    id: 0,
                    title: `<b>Brisbane Depot Remains Closed</b> – Our depot will stay closed until conditions improve. We will provide further updates on reopening as soon as it is safe to do so.`,
                },
                {
                    id: 1,
                    title: `<b>Freight Disruptions Ongoing</b> – Deliveries to and from affected areas remain impacted due to road closures and severe weather conditions.`,
                },
                {
                    id: 2,
                    title: `<b>Safety First</b> – Our team is actively monitoring the situation and will adjust operations as needed to ensure the safety of our staff, drivers, and customers' freight.`,
                },
                {
                    id: 3,
                    title: `<b>Protecting Freight</b> – All protection mechanisms are in place with vehicles securely stored within our <b>Brisbane warehouse</b>, and <b>customer goods raised and placed within vehicles</b> inside the warehouse to minimise the risk of water damage.`,
                },
                {
                    id: 4,
                    title: `<b>Consignment Status</b> – Customers with freight still held within our network destined to impacted areas have been <b>directly advised of their consignment status</b>.`,
                },
            ],
            content2: `We appreciate your patience and understanding. Please stay safe, and we will keep you informed of any further developments.

            If you have any urgent enquiries regarding your freight, please contact our team on <a href="tel:1800 040 306" class="font-extrabold">1800 040 306</a> or <a href="mailto:customerservice@gtls.com.au" class="font-extrabold">customerservice@gtls.com.au.</a> 
            
            Continue to monitor our <a href="/news" class="underline " >website</a>  for major developments.
             `,
            
            imgUrl: cycloneUpdateImage,
            imgSliders: [cycloneUpdateImage],
        },
    ];

    const posts = [
        {
            id: 28,
            title: "Cyclone Alfred – Ongoing Monitoring",
            href: "#",
            description: `We continue to closely monitor Cyclone Alfred and its impact on freight operations. While there are no major updates at this time, we want to assure you that safety remains our top priority as we assess conditions.`,
            imageUrl: cycloneUpdateImage,
            date: "March 6, 2025",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 27,
            title: "Cyclone Alfred Update",
            href: "#",
            description: `Gold Tiger Logistics Solutions is closely monitoring Tropical Cyclone Alfred, which is expected to impact Queensland and Northern New South Wales over the coming days. As safety remains our top priority, we want to keep you informed about potential freight disruptions and what to expect`,
            imageUrl: cycloneImage,
            date: "March 5, 2025",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 26,
            title: "Introducing Gold Tiger Logistics’ National Road Alerts Feature",
            href: "#",
            description: `At Gold Tiger Logistics Solutions, we recognise that real-time information is crucial in the fast-paced logistics industry. That’s why we’re thrilled to unveil our new Road Alerts Map service. A powerful tool designed to keep you informed, empowered, and ready to navigate potential disruptions. `,
            imageUrl: nationalRoadImage,
            date: "Decemver 4, 2024",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 25,
            title: "Introducing Gold Tiger’s New B-Triple Solution: Expanding Capacity and Efficiency in Freight Transport",
            href: "#",
            description: `We’re thrilled to announce our latest service upgrade – the addition of B-triple configurations to our fleet! Known for their increased capacity and efficiency, B-triples are among the most powerful solutions for long-haul freight. These trucks consist of three trailers, `,
            imageUrl: bTripleImage,
            date: "November 19, 2024",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 24,
            title: "Building a Safety-Conscious Workforce with Fire & Safety Australia",
            href: "#",
            description: `At Gold Tiger Logistics Company, safety is at the heart of our operations. Recently, our team participated in an essential firefighting training session, facilitated by Fire and Safety Australia, as part of our ongoing commitment to safety and compliance.`,
            imageUrl: safetyImage,
            date: "October 23, 2024",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 23,
            title: "Fire Warden, Fire Extinguisher & Fire Blanket Training.",
            href: "#",
            description: `We welcomed an expert trainer in the field of fire safety in the workplace to Gold Tiger Logistics Solutions. The training provided has given our Chief Fire Warden and his fellow Fire Wardens the skills and knowledge to manage fire emergencies and other threats in the workplace.`,
            imageUrl: fireWardinBlogImage,
            date: "September 20, 2024",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 22,
            title: "Jaix Logistics Software Recap Training and information updates",
            href: "#",
            description: `This week the Jaix Logistics Support and Implementation Specialist was embedded at our Sydney head Office for some valuable recap training which involved all departments within Gold Tiger Logistics Solutions including Operations (Transport and Warehousing departments), Administration, Customer Service, IT and Sales.`,
            imageUrl: jaixtraining,
            date: "September 3, 2024",
            datetime: "2024-9-3",
            category: { title: "", href: "#" },
        },
        {
            id: 21,
            title: "GTLS: A Strategic Vision",
            href: "#",
            description: `At Gold Tiger Logistics Solutions (GTLS), we’re committed to more than just ticking boxes; we focus on building a strong, supportive team and sustaining robust processes for the long term.`,
            imageUrl: gearboxnews,
            date: "August 26, 2024",
            datetime: "2024-8-26",
            category: { title: "", href: "#" },
        },
        {
            id: 20,
            title: "GTLS Shines at the 2024 Road Freight NSW Conference & Awards Day!",
            href: "#",
            description: `Mr. Imad El Masri, director of GTLS, made a notable contribution at the 2024 Road Freight NSW Conference & Awards day. This event was a significant gathering for networking and discussing pivotal transformations reshaping the road freight industry in NSW.`,
            imageUrl: Conferencnews,
            date: "July 30, 2024",
            datetime: "2024-5-11",
            category: { title: "", href: "#" },
        },
        {
            id: 19,
            title: "GTLS Unleashes the Power of BPW: A Recap of Our Wheel Hubs and Bearings Training!",
            href: "#",
            description: `We had the privilege of learning from leading industry professionals who imparted their invaluable knowledge and techniques.
    
            Wondering why GTLS relies on BPW Wheel hubs?
            
            Here’s the inside scoop! 👇`,
            imageUrl: BPWnews,
            date: "July 23, 2024",
            datetime: "2024-5-11",
            category: { title: "", href: "#" },
        },
        {
            id: 18,
            title: "Training Session Recap: Mastering the Jost 5th Wheel",
            href: "#",
            description: `Gold Tiger Logistics Solutions (GTLS) participated in a comprehensive training session with Jost, focusing on the inner workings of the Jost 5th wheel.`,
            imageUrl: jost5news,
            date: "July 24, 2024",
            datetime: "2024-5-11",
            category: { title: "", href: "#" },
        },
        {
            id: 17,
            title: "Elevating Safety and Efficiency: The Gearbox Training Program at Gold Tiger Logistics Solutions.",
            href: "#",
            description: `At Gold Tiger Logistics Solutions (GTLS), safety and compliance are absolutely crucial. They're at the heart of our commitment to running efficiently and developing our team. A key part of this commitment is our "Gearbox" with the user software training program. It's tailored to enhance the technical skills of our maintenance crew.`,
            imageUrl: Efficiency,
            date: "June 18, 2024",
            datetime: "2024-5-11",
            category: { title: "", href: "#" },
        },
        {
            id: 16,
            title: "Safety Week at GTLS: Join Us in Sharing the Road Safely!",
            href: "#",
            description:
                "At Gold Tiger, ensuring road safety is not just a commitment but a core value we hold dearly. It's crucial for us to safeguard not only our employees and clients but also the wider community.",
            imageUrl: weeklySafety,
            date: "May 11, 2024",
            datetime: "2024-5-11",
            category: { title: "", href: "#" },
        },
        {
            id: 15,
            title: "Employees safety and Health practices at GTLS",
            href: "#",
            description:
                "At Gold Tiger Logistics Solutions, O.H&E one of our priority is making sure our team stays safe and healthy. We do this by constantly checking for any possible dangers related to equipment, whether it's at our own sites or where we're serving our customers.",
            imageUrl: EmployeesSafety,
            date: "April 27, 2024",
            datetime: "2024-4-27",
            category: { title: "", href: "#" },
        },
        {
            id: 14,
            title: "Acknowledging Our Journey On-Site Fleet Fueling",
            href: "#",
            description:
                "In our continuous pursuit for excellence and innovation, we are proud to announce that we have enhanced operational efficiency with onsite fuel tanks. It is considered a significant stride forward for GTLS for its remarkable advantages. ",
            imageUrl: onSiteFueling,
            date: "March 12, 2024",
            datetime: "2024-3-12",
            category: { title: "", href: "#" },
        },
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
        },
    ];

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
                {/* <HeroSection/> */}
                {id == 12 ||
                id == 15 ||
                id == 17 ||
                id == 18 ||
                id == 19 ||
                id == 22 ||
                id == 23 ||
                id == 26 ? (
                    <div aria-hidden="true" className="relative">
                        <img
                            src={contentJson[id].imgUrl}
                            alt="news"
                            className="h-[40rem] w-full object-cover  "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                    </div>
                ) : id == 20 || id == 21 || id == 24 || id == 25 ? (
                    <div aria-hidden="true" className="relative">
                        <img
                            src={contentJson[id].imgUrl}
                            alt="news"
                            className="h-[40rem] w-full object-cover object-top "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                    </div>
                ) : (
                    <div aria-hidden="true" className="relative">
                        <img
                            src={contentJson[id].imgUrl}
                            alt="news"
                            className="h-96 w-full object-cover  "
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark" />
                    </div>
                )}

                <div className="bg-dark pb-10 px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl text-base leading-7 text-gray-700">
                        <a
                            href="/news"
                            className="relative inline-flex items-center justify-center text-black "
                        >
                            <ArrowLongLeftIcon className="h-5 text-goldt " />
                            <span className="p-1 text-white">Back to main</span>
                        </a>
                        <div key={contentJson[id].id}>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-goldt sm:text-4xl">
                                {contentJson[id].title}
                            </h1>
                            <p className="text-gray-500 font-bold">
                                {posts.map((post) => (
                                    <>
                                        {post.id == id ? (
                                            <span className="">
                                                {post.date}
                                            </span>
                                        ) : null}
                                    </>
                                ))}
                            </p>
                            <p
                                className="mt-6 text-lg leading-8 text-gray-200 "
                                style={{ whiteSpace: "pre-line" }}
                                dangerouslySetInnerHTML={{
                                    __html: contentJson[id].content1,
                                }}
                            ></p>
                            {contentJson[id].listTitle ? (
                                <div className="text-smooth">
                                    {contentJson[id].listTitle}
                                </div>
                            ) : null}
                            {contentJson[id].list ? (
                                <ol className="p-5 pt-2">
                                    {contentJson[id].list?.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex gap-x-3 "
                                        >
                                            <div className=" h-2 w-2 mt-2 flex-none rounded-full bg-goldt" />
                                            <div>
                                                <span
                                                    className="text-smooth"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.title,
                                                    }}
                                                ></span>
                                                {item.content ? (
                                                    Array.isArray(
                                                        item.content
                                                    ) ? (
                                                        <ul className="text-gray-200 list-disc list-inside">
                                                            {item.content.map(
                                                                (i) => (
                                                                    <li
                                                                        key={
                                                                            i.id
                                                                        }
                                                                    >
                                                                        {i}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <div className="text-gray-200">
                                                            {item.content}
                                                        </div>
                                                    )
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : null}
                            {contentJson[id].list2Title ? (
                                <div className="text-smooth">
                                    {contentJson[id].list2Title}
                                </div>
                            ) : null}
                            {contentJson[id].list2 ? (
                                <ol className="p-5">
                                    {contentJson[id].list2?.map((item) => (
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
                                                    <div className="text-gray-200">
                                                        {item.content}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : null}
                            <div className="mt-3 text-lg  text-gray-200 ">
                                <p
                                    style={{ whiteSpace: "pre-line" }}
                                    className="w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: contentJson[id].content2,
                                    }}
                                ></p>
                            </div>
                            {contentJson[id].list3 ? (
                                <ol className="p-5">
                                    {contentJson[id].list3?.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex gap-x-3 "
                                        >
                                            <div className=" h-2 w-2 mt-2 flex-none rounded-full bg-goldt" />
                                            <div>
                                                <span
                                                    className="text-smooth"
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.title,
                                                    }}
                                                ></span>
                                                {item.content ? (
                                                    <div
                                                        className="text-gray-200"
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.content,
                                                        }}
                                                    ></div>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            ) : null}
                            <div className="mt-3 text-lg  text-gray-200 ">
                                <p
                                    style={{ whiteSpace: "pre-line" }}
                                    className="w-full"
                                    dangerouslySetInnerHTML={{
                                        __html: contentJson[id].content3,
                                    }}
                                ></p>
                            </div>
                            <figure className="mt-16">
                                {contentJson[id].videoUrl ? (
                                    <video
                                        loop
                                        autoPlay
                                        controls
                                        style={{ width: "100%" }}
                                        src={contentJson[id].videoUrl}
                                        type="video/mp4"
                                    >
                                        Your browser does not support the video
                                        tag.
                                    </video>
                                ) : contentJson[id].imgSliders &&
                                  Array.isArray(contentJson[id].imgSliders) ? (
                                    <Swiper
                                        navigation={true}
                                        modules={[Navigation]}
                                        className="mySwiper"
                                    >
                                        {contentJson[id].imgSliders.map(
                                            (item, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        className="aspect-video w-full h-[550px] px-20 rounded-xl object-contain"
                                                        src={item}
                                                        alt={
                                                            contentJson[id]
                                                                .title
                                                        }
                                                    />
                                                </SwiperSlide>
                                            )
                                        )}
                                    </Swiper>
                                ) : contentJson[id].youtubeUrl ? (
                                    <>
                                        <ReactPlayer
                                            controls={true}
                                            url={contentJson[id].youtubeUrl}
                                            width="100%"
                                            autoPlay={true}
                                            height={500}
                                        />
                                    </>
                                ) : (
                                    <img
                                        className="aspect-video rounded-xl bg-gray-50 object-cover"
                                        src={contentJson[id].imgUrl}
                                        alt={contentJson[id].title}
                                    />
                                )}
                            </figure>
                            <div className="mt-10">
                                <p className="mt-2 mb-5 text-xl font-bold tracking-tight text-white sm:text-xl">
                                    Share to your friends
                                </p>
                                <FacebookShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <FacebookIcon className="rounded-md h-10 w-auto mr-3" />
                                </FacebookShareButton>
                                <TwitterShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <TwitterIcon className="rounded-md h-10 w-auto mr-3" />
                                </TwitterShareButton>
                                <LinkedinShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
                                >
                                    <LinkedinIcon className="rounded-md h-10 w-auto mr-3" />
                                </LinkedinShareButton>
                                <WhatsappShareButton
                                    url={pageUrl}
                                    title={contentJson[id].title}
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
                            {posts
                                .filter((post) => post.id != id)
                                .map((post) => (
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
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        className=" aspect-[16/9] rounded-2xl bg-gray-100 object-cover object-top  w-full "
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
                                                                {post.date}
                                                            </time>
                                                        </div>
                                                        <div className="group relative">
                                                            <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-600 font-bold">
                                                                <span className="absolute inset-0" />
                                                                {post.title}
                                                            </h3>
                                                            <p className="mt-5 text-sm leading-6 text-gray-400 line-clamp-3">
                                                                {
                                                                    post.description
                                                                }
                                                            </p>
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
                <Footer />
            </div>
        </>
    );
}
