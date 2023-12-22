import React from "react";
import ReactPlayer from "react-player";
import styled from "styled-components";
import Gtrs from "../../../assets/videos/GTRS-Demo.mp4"

const Player = ({ className }) => (
    <ReactPlayer
        url={Gtrs}
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

const ResponsiveStyledPlayer = () => (
    <div className=" mx-auto max-w-2xl  px-4 mb-20 mt-20 py-32 sm:px-6 lg:max-w-7xl ">
        <p className=" text-4xl font-bold tracking-tight text-goldt sm:text-5xl">
            Gold<span className="text-white">Tiger Reporting System</span>
        </p>
        <RelativePositionWrapper className="mt-10">
            <AbsolutelyPositionedPlayer />
        </RelativePositionWrapper>
    </div>
    
);



export default ResponsiveStyledPlayer;
