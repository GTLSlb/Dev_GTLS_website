import truckPng from "@/assets/pictures/truck.png";
function TrainNotification() {
    return (
        <div className="py-2 bg-dark overflow-hidden">
            <div className="animate-moveRight w-auto">
                <div className="flex gap-2 items-center text-white font-bold whitespace-nowrap">
                    <img
                        className="h-7 inline-block pr-5"
                        src={truckPng}
                        alt={"Banner Truck"}
                    />
                    <a href="/news/29/severe-weather-in-queensland-and-northern-nsw">
                        Ongoing Monitoring – Severe Weather in Queensland and
                        Northern NSW
                    </a>
                </div>
            </div>

            <style>
                {`
                                @keyframes moveRight {
                                    0% {
                                        transform: translateX(100%);
                                    }
                                    100% {
                                        transform: translateX(-100%);
                                    }
                                }

                                .animate-moveRight {
                                    animation: moveRight 20s linear infinite;
                                }

                                @media all and (max-width: 800px) {
                                    @keyframes moveRight {
                                        0% {
                                            transform: translateX(100%);
                                        }
                                        100% {
                                            transform: translateX(-150%);
                                        }
                                    }
                                    .animate-moveRight {
                                        animation: moveRight 10s linear infinite;
                                    }
                                }

                                @media all and (max-width: 500px) {
                                    @keyframes moveRight {
                                        0% {
                                            transform: translateX(100%);
                                        }
                                        100% {
                                            transform: translateX(-250%);
                                        }
                                    }
                                    .animate-moveRight {
                                        animation: moveRight 13s linear infinite;
                                    }
                                }

                                @media all and (max-width: 350px) {
                                    @keyframes moveRight {
                                        0% {
                                            transform: translateX(100%);
                                        }
                                        100% {
                                            transform: translateX(-400%);
                                        }
                                    }
                                    .animate-moveRight {
                                        animation: moveRight 10s linear infinite;
                                    }
                                }
                            `}
            </style>
        </div>
    );
}

export default TrainNotification;
