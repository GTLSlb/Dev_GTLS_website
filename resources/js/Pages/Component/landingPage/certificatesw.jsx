import React, { useState } from "react";
import { MagnifyingGlassPlusIcon } from "@heroicons/react/20/solid";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

export default function Certifiactesw(props) {
    const getcertificates = props.getcertificates;
    const strapiApi = window.Laravel.strapiAppUrl;
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

    function reformatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: "short", day: "2-digit", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    }

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
        <div className="relative h-full xl:h-screen flex-col justify-center items-center pb-16">
            <div className="flex flex-col gap-5 container mx-auto px-14 xl:px-32 py-10 pb-32">
                <p className="text-4xl font-bold tracking-tight text-goldd">
                    {getcertificates ? getcertificates.Title : null}
                </p>
                <div className="text-lg  text-gray-200 ">
                    <div
                        className=""
                        dangerouslySetInnerHTML={{
                            __html: getcertificates.Description,
                        }}
                    ></div>
                </div>
            </div>

            <div className="xl:absolute w-full bg-gradient-to-br xl:h-32 from-goldd via-goldl to-goldd  bg-opacity-10">
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    className="mySwiper relative container mx-auto xl:px-32 items-center justify-center flex max-xl:flex-col gap-32 max-xl:py-14"
                    breakpoints={{
                        764: {
                            slidesPerView: 1,
                            spaceBetween: 10,
                        },
                        850: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 50,
                        },
                    }}
                >
                    {getcertificates?.certificates?.map(
                        (certificate) =>
                            certificate?.Certificate?.url && (
                                <SwiperSlide
                                    className="absolute top-0 h-full xl:m-10  max-xl:py-10"
                                    key={certificate.id}
                                >
                                    <div className="transition-transform hover:scale-110 w-fit">
                                        <img
                                            src={
                                                strapiApi +
                                                certificate.Certificate?.url
                                            }
                                            alt={
                                                certificate.Certificate
                                                    ?.alternativeText
                                            }
                                            className="rounded-xl w-full max-xl:h-96 object-cover object-top"
                                        />
                                        <div className="relative max-xl:px-32 w-full">
                                            <div className="absolute left-0 bg-white w-full bottom-0 rounded-br-xl rounded-bl-xl shadow-inner ">
                                                <div className=" p-6">
                                                    <div className=" flex items-center gap-x-4 text-xs">
                                                        <div className="text-gray-500">
                                                            {reformatDate(
                                                                certificate?.Date
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="group relative ">
                                                        <h3 className="mt-2 text-xl font-bold leading-6 text-gray-600 group-hover:text-gray-600 line-clamp-1">
                                                            <span className="absolute inset-0" />
                                                            {certificate?.Title}
                                                        </h3>
                                                        <div className="mt-1 text-sm  text-gray-400 line-clamp-2">
                                                            <div
                                                                className=""
                                                                dangerouslySetInnerHTML={{
                                                                    __html: certificate?.Description,
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleImageClick(
                                                        strapiApi +
                                                            `/` +
                                                            certificate
                                                                .Certificate
                                                                ?.url
                                                    )
                                                }
                                                aria-label="zoom"
                                                className="h-14 w-14 absolute bottom-28 right-0 mr-5 items-center gap-x-1.5 rounded-full bg-black py-1.5 px-1.5 text-sm font-semibold text-white shadow-sm hover:bg-goldt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                <MagnifyingGlassPlusIcon
                                                    className=" h-6 w-6 mx-auto"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                    )}
                </Swiper>
            </div>
            <div>{renderModal()}</div>
        </div>
    );
}
