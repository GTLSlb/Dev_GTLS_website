function TrainNotification({ getTrainNotification }) {
    const strapiUrl = window.Laravel.strapiAppUrl;
    return (
        <div>
            {typeof getTrainNotification === "object" &&
                Object.keys(getTrainNotification).length > 0 && (
                    <div className="py-2 bg-dark overflow-hidden">
                        <div className="animate-moveRight w-auto ">
                            <p className="text-white font-bold whitespace-nowrap flex gap-2">
                                <img
                                    key={getTrainNotification.documentId}
                                    className="h-7 inline-block pr-5"
                                    src={
                                        strapiUrl +
                                        getTrainNotification.Icon.url
                                    }
                                    alt={
                                        getTrainNotification.Icon
                                            .alternativeText
                                    }
                                />
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: getTrainNotification.Body,
                                    }}
                                ></div>
                            </p>
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
