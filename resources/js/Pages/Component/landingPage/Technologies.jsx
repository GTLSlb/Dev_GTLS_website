import React from "react";
import PropTypes from "prop-types";
export default function Technologies(props) {
    const gettechnologies = props.gettechnologies;
    const strapiApi = window.Laravel.strapiAppUrl;
    return (
        <div
            className="overflow-hidden relative bg-dark py-10"
            id="technologies"
        >
            <div className="mx-auto max-w-2xl py-24 px-4 sm:py-32 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col justify-center  md:flex-row items-center gap-y-16  ">
                    <div className="h-auto w-12/12   md:w-1/2 md:pr-16">
                        <a href="/technologies" target="_blank">
                            <img
                                src={strapiApi + gettechnologies.Images[0].url}
                                alt={gettechnologies.Images[0].alternativeText}
                                className="h-auto sm:h-auto w-full"
                            />
                        </a>
                    </div>

                    <div className="w-full md:w-1/2  border-l-4 border-goldt pl-5 lg:pl-16">
                        <div className=" pb-2">
                            <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                                {gettechnologies?.Title}
                            </p>
                        </div>
                        <dl className="mt-5 " key={gettechnologies.id}>
                            <dd
                                className=" text-base text-gray-300"
                                dangerouslySetInnerHTML={{
                                    __html: gettechnologies.Description,
                                }}
                            ></dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="absolute top-0  right-[-20rem]">
                <img
                    src={strapiApi + gettechnologies?.Images[1].url}
                    alt="volvo"
                    className="h-[60rem] opacity-20"
                />
            </div>
        </div>
    );
}

Technologies.propTypes = {
    gettechnologies: PropTypes.object,
};