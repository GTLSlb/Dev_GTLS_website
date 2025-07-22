import React from "react";
import PropTypes from "prop-types";
export default function VideoHeader(props) {
    const getHeader = props.getHeader.Dynamic_zone.find(
        (zone) => zone.__component === "home-page.home-hero-section"
    );
    const getSocials = props.getHeader.Dynamic_zone.find(
        (zone) => zone.__component === "global.related-socials"
    ).socials;

    const strapiApi = window.Laravel.strapiAppUrl;

    return (
        <div>
            <div className="bg-dark relative ">
                <div className=" bg-red">
                    <div className="relative flex items-center justify-center h-screen overflow-hidden min-h-[600px]">
                        <video
                            src={`${strapiApi}${getHeader.BackgroundVideo.url}`}
                            preload="none"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute w-auto min-w-full min-h-full max-w-none"
                        ></video>

                        <div className="opacity-70 bg-black absolute w-full h-full"></div>
                        <div className=" lg:flex items-center lg:gap-x-10  ">
                            <div className=" lg:flex items-center lg:gap-x-10  ">
                                <table className="table-auto w-full">
                                    <tbody>
                                        <tr>
                                            <td className=" px-4 py-10 w-7/12 text-center">
                                                <div className="relative lg:flex-auto w-full  ">
                                                    <div className="text-center ">
                                                        <div className=" mt-10">
                                                            {getHeader ? (
                                                                <div className="max-md:text-xl leading-7">
                                                                    <span
                                                                        className=""
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: getHeader.Title,
                                                                        }}
                                                                    ></span>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        <div className="mt-4 mb-2 border-b border-opacity-30 border-goldt py-6">
                                                            {getHeader ? (
                                                                <div
                                                                    className=""
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: getHeader.SubTitle,
                                                                    }}
                                                                ></div>
                                                            ) : null}
                                                        </div>
                                                        <div className=" py-2">
                                                            {getHeader ? (
                                                                <div
                                                                    className=""
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: getHeader.Description,
                                                                    }}
                                                                ></div>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className=" space-x-6 mt-5 text-center item-center">
                                                        {getSocials.map(
                                                            (item) => (
                                                                <div
                                                                    className="border border-goldt rounded-full p-1 inline-block"
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <a
                                                                        href={
                                                                            item.url
                                                                        }
                                                                        target="blank"
                                                                        className="text-goldl hover:text-goldt hover:cursor-pointer"
                                                                    >
                                                                        <span className="sr-only">
                                                                            {
                                                                                item.name
                                                                            }
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
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

VideoHeader.propTypes = {
    getHeader: PropTypes.object,
};