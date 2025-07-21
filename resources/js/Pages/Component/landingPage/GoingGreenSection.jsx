import "../../../../css/gradient.css";
import Calc from "../../Component/landingPage/Calc";
import React from "react";
import PropTypes from "prop-types";

export default function GoingGreenSection(props) {
    const getGreen = props.getGreen;
    const strapiApi = window.Laravel.strapiAppUrl;
    return (
        <div>
            <div className=" text-smooth lg:py-32">
                <div className="bg-gg bg-cover">
                    <div className="lg:mx-auto lg:max-w-7xl  px-6 lg:px-8  flex flex-col lg:flex-row gap-x-10 gap-y-10 py-2 items-center">
                        <div className="wfull lg:w-1/2">
                            <img
                                src={strapiApi + getGreen.Image.url}
                                alt={getGreen.Image.alternativeText}
                                className=""
                            />
                        </div>

                        <div className="lg:w-1/2">
                            <h2 className="gradient-text py-5 text-4xl font-bold">
                                {getGreen.Title}
                            </h2>

                            <div className="mt-2 text-smooth">
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: getGreen.Description,
                                    }}
                                ></div>
                            </div>

                            <Calc />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

GoingGreenSection.propTypes = {
    getGreen: PropTypes.object,
};