import React from "react";
import Truck from "@/assets/pictures/truck.png";
function TrainNotification({ getTrainNotification }) {
    return (
        <div>
            {typeof getTrainNotification === "object" &&
                Object.keys(getTrainNotification).length > 0 && (
                    <div className="py-2 bg-dark overflow-hidden">
                        <div className="animate-moveRight w-auto ">
                            <div className="text-white font-bold whitespace-nowrap flex gap-2">
                                {getTrainNotification.elements.map(
                                    (element) => {
                                        if (
                                            element.name === "Icon" &&
                                            element.image
                                        ) {
                                            return (
                                                <img
                                                    key={element.id}
                                                    className="h-7 inline-block pr-5"
                                                    src={
                                                        `/app/webimages/` +
                                                        element.image
                                                    }
                                                    alt={
                                                        element.image_alt ||
                                                        "icon"
                                                    }
                                                />
                                            );
                                        }
                                        return null;
                                    }
                                )}
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            getTrainNotification.elements.find(
                                                (element) =>
                                                    element.name === "Content"
                                            )?.content || "",
                                    }}
                                ></div>

                                {getTrainNotification.elements.map(
                                    (element) => {
                                        if (
                                            element.name === "Link" &&
                                            element.url
                                        ) {
                                            return (
                                                <a
                                                    key={element.id}
                                                    href={element.url}
                                                    className="text-sm leading-6 text-goldl hover:text-white"
                                                >
                                                    {(
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html:
                                                                    getTrainNotification.elements.find(
                                                                        (
                                                                            element
                                                                        ) =>
                                                                            element.name ===
                                                                            "Link"
                                                                    )
                                                                        ?.content ||
                                                                    "",
                                                            }}
                                                        ></div>
                                                    ) || "Read more"}
                                                </a>
                                            );
                                        }
                                        return null;
                                    }
                                )}
                            </div>
                        </div>

                        <style>
                            {`
                                        @keyframes moveRight{
                                            0%{
                                                transform: translateX(100%)
                                            }
                                            100%{
                                                transform: translateX(-100%)
                                            }
                                        }

                                        .animate-moveRight{
                                            animation: moveRight 20s linear infinite;
                                        }
                                        @media all and (max-width: 800px) {
                                            @keyframes moveRight{
                                                0%{
                                                    transform: translateX(100%)
                                                }
                                                100%{
                                                    transform: translateX(-150%)
                                                }
                                            }
                                            .animate-moveRight{
                                                animation: moveRight 10s linear infinite;
                                            }
                                        }
                                        @media all and (max-width: 500px) {
                                            @keyframes moveRight{
                                                0%{
                                                    transform: translateX(100%)
                                                }
                                                100%{
                                                    transform: translateX(-250%)
                                                }
                                            }
                                            .animate-moveRight{
                                                animation: moveRight 13s linear infinite;
                                            }
                                        }
                                        @media all and (max-width: 350px) {
                                            @keyframes moveRight{
                                                0%{
                                                    transform: translateX(100%)
                                                }
                                                100%{
                                                    transform: translateX(-400%)
                                                }
                                            }
                                            .animate-moveRight{
                                                animation: moveRight 10s linear infinite;
                                            }
                                        }

                                    `}
                        </style>
                    </div>
                )}
        </div>
    );
}

export default TrainNotification;
