import React from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import Gtrs from "../../../assets/videos/GTRS-Demo.mp4";

export default function ResponsiveStyledPlayer(props) {
    const getGtrs = props.getGtrs;
    const strapiApi = window.Laravel.strapiAppUrl;
    const Player = ({ className }) => (
        <ReactPlayer
            url={strapiApi + getGtrs.Video.url}
            className={className}
            width="100%"
            height="100%"
            controls={true}
        />
    );
    const AbsolutelyPositionedPlayer = styled(Player)`
        position: absolute;
        top: 0;
        left: 0;
    `;

    const RelativePositionWrapper = styled.div`
        position: relative;
        padding-top: 56.25%;
    `;

    return (
        <div className=" mx-auto max-w-2xl  px-4 py-32 sm:px-6 lg:max-w-7xl ">
            <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
                <span className="">{getGtrs.Title}</span>
            </p>
            <div
                className="text-gray-100 mt-2 font-bold"
                dangerouslySetInnerHTML={{ __html: getGtrs?.description }}
            ></div>
            <RelativePositionWrapper className="mt-10">
                <AbsolutelyPositionedPlayer />
            </RelativePositionWrapper>
        </div>
    );
}

// const ResponsiveStyledPlayer = () => (

// );

// export default ResponsiveStyledPlayer;
