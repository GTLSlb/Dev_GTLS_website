import React from "react";
import PropTypes from "prop-types";

export default function Footer(props) {
    const getfooter = props.getfooter;
    const strapiApi = window.Laravel.strapiAppUrl;

    return (
        <footer
            className="bg-dark pb-5 "
            aria-labelledby="footer-heading"
            id="footer"
        >
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="bg-goldd h-2 " />
            <div className="border-b border-t my-5 border-goldd ">
                <div className="mx-auto max-w-7xl px-6 pb-4 pt-4 lg:px-8 ">
                    <div className=" gap-8  items-center flex flex-col md:flex-row md:justify-between">
                        <a href="/">
                            <img
                                className="h-20"
                                src={strapiApi + getfooter?.Icon?.url}
                                alt={getfooter?.Icon?.alternativeText}
                            />
                        </a>
                        <div className="  gap-8 col-span-2 mt-0 h-full flex ">
                            <div className=" flex flex-col items-center md:flex-row gap-x-24">
                                <div className="flex space-x-6 ">
                                    {getfooter?.socials?.map((item) => (
                                        <div
                                            className="border border-goldt rounded-full p-1"
                                            key={item.id}
                                        >
                                            <a
                                                href={item.url}
                                                target="blank"
                                                className="text-goldl hover:text-goldt "
                                            >
                                                <span className="sr-only">
                                                    {item.name}
                                                </span>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.svg,
                                                    }}
                                                    className="ChangeSVGSize p-1"
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 max-md:mt-10 items-center sm:grid-cols-2 md:grid-cols-3 gap-5">
                                    {getfooter?.links?.map((feature) => (
                                        <div
                                            key={feature.Name}
                                            className="md:mt-0"
                                        >
                                            <div
                                                dangerouslySetInnerHTML={{
                                                    __html: feature.Link,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-goldd h-6">
                <div className="mx-auto max-w-7xl h-full px-6  lg:px-8 ">
                    <div className="mt-8 text-xs h-full flex items-center font-bold leading-5 text-dark md:order-1 md:mt-0">
                        <div
                            className=""
                            dangerouslySetInnerHTML={{
                                __html: getfooter?.Copyright,
                            }}
                        ></div>
                        {/* &copy; 2024 Gold Tiger Group of Companies. */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

Footer.propTypes = {
    getfooter: PropTypes.object,
};