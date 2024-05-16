import React, { useState } from "react";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/20/solid";
import cert1 from "../../../assets/certification/cert1.webp";
import cert2 from "../../../assets/certification/cert2.webp";
import cert3 from "../../../assets/certification/cert3.webp";
const posts = [
    {
        id: 1,
        title: "Gold Tiger LS PTY LTD",
        href: "#",
        description:
            "Has been assessed and certified as meeting the requirements of HACCP Certification, based upon Codex Alimentarius General Principles of Foof Hygiene CXC 1-1969 (2020) , for the following activities: Recieval, Storage & Distribution of Spices, Almond Milk, Popcorn and Glutan Free Products.",
        imageUrl: cert1,
        date: "Feb 02, 2024",
        datetime: "2020-03-16",
    },
    {
        id: 2,
        title: "Certificate of Registration Gold Tiger LS PTY LTD",
        href: "#",
        description:
            "Is registered as meeting the requirements of the SQF Food Safety Code: Storage and Distribution Edition 9, Certified HACCP Based Food Safety Plans. Scope of Registration: Food Sector Categories 26. Storage and Distribution. With Certificate number : 55111",
        imageUrl: cert2,
        date: "Feb 20, 2024",
        datetime: "2020-03-16",
    },
    {
        id: 3,
        title: "Gold Tiger Maintenance PTY LTD",
        href: "#",
        description: "This is to certify that Gold Tiger Maintenance PTY LTD is licensed under the Motor Dealers and Repairers Act 2013.",
        imageUrl: cert3,
        date: "Dec 18, 2023",
        datetime: "2023-12-18",
    },
    // More posts...
];

export default function Certifiactesw() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (index) => {
        setSelectedImage(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleOverlayClick = (event) => {
        if (event.target.classList.contains("modal-overlay")) {
            handleCloseModal();
        }
    };

    const renderModal = () => {
        if (selectedImage !== null) {
            return (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center modal-overlay "
                    onClick={handleOverlayClick}
                >
                    <button
                        className="absolute top-0 right-0 m-4 text-white hover:text-gray-300 focus:outline-none"
                        onClick={handleCloseModal}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <img
                        src={selectedImage}
                        alt={`Image ${selectedImage + 1}`}
                        className="max-w-full max-h-full"
                    />
                </div>
            );
        }
    };
    return (
        <div className="relative h-full xl:h-screen">
            <div className="flex flex-col gap-5 container mx-auto px-14 xl:px-32 py-10 pb-32">
                <p className="text-4xl font-bold tracking-tight text-goldd">
                    Certificates
                </p>
                <p className="text-lg  text-gray-200 ">
                    Learn how to grow your business with our expert advice
                </p>
            </div>
           
            <div className="xl:absolute w-full bg-gradient-to-br xl:h-32 from-goldd via-goldl to-goldd  bg-opacity-10">
                <div className="container mx-auto xl:px-32 items-center justify-center flex max-xl:flex-col gap-32 max-xl:py-14">
                    {posts.map((post) => (
                        <div className="relative transition-transform xl:-translate-y-1/4 hover:scale-110">
                            <img
                                src={post.imageUrl}
                                alt="certification"
                                className="rounded-xl h-96 w-80"
                            />
                            <div className="absolute bg-white bottom-0 rounded-br-xl rounded-bl-xl  shadow-inner ">
                                <div className=" p-6">
                                    <div className=" flex items-center gap-x-4 text-xs">
                                        <time
                                            dateTime={post.datetime}
                                            className="text-gray-500"
                                        >
                                            {post.date}
                                        </time>
                                    </div>
                                    <div className="group relative ">
                                        <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </h3>
                                        <p className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleImageClick(post.imageUrl)}
                                aria-label="zoom"
                                className="h-14 w-14 absolute bottom-28 right-0 mr-5 items-center gap-x-1.5 rounded-full bg-black py-1.5 px-1.5 text-sm font-semibold text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <MagnifyingGlassPlusIcon
                                    className=" h-6 w-6 mx-auto"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div>{renderModal()}</div>
        </div>
    );
}
