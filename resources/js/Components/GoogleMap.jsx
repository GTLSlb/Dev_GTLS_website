import React, { useEffect, useState } from "react";
import {
    GoogleMap,
    LoadScript,
    Polyline,
    Marker,
} from "@react-google-maps/api";

import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";

import Crash from "../assets/pictures/Crash.png";
import SpecialEvent from "../assets/pictures/SpecialEvents.png";
import { Checkbox } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import {
    HelpCenterOutlined,
    HelpCenterRounded,
    List,
    LocationOn,
} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import "../../css/scroll.css";
const center = {
    lat: -25.2744,
    lng: 133.7751,
};

const australiaBounds = {
    north: -5.0,
    south: -55.0,
    east: 165.0,
    west: 105.0,
};

function LastUpdated({ lastUpdatedAt }) {
    const [lastUpdatedText, setLastUpdatedText] = useState("");
    // Convert to the ISO format required for UTC

    useEffect(() => {
        const updateLastUpdatedText = () => {
            // Parse the last updated date as UTC
            const isoDateString = lastUpdatedAt.replace(" ", "T") + "Z"; // "2024-08-29T09:59:25Z"

            // Current UTC date and time
            const currentUtcDate = new Date();
            const utcString = currentUtcDate.toUTCString();

            // Convert the UTC string to a Date object
            const utcDateFromString = new Date(utcString);

            // Specific UTC date to compare (ensure it's in a format that JavaScript can parse correctly)
            const specificUtcDate = new Date(isoDateString); // Use 'T' and 'Z' to indicate UTC

            // Calculate the difference in milliseconds
            const differenceInMilliseconds = Math.abs(
                utcDateFromString - specificUtcDate
            );

            // Convert milliseconds to minutes
            const differenceInMinutes = Math.floor(
                differenceInMilliseconds / (1000 * 60)
            );

            setLastUpdatedText(formatLastUpdated(differenceInMinutes));
        };

        updateLastUpdatedText();

        // Update the time difference every minute
        const intervalId = setInterval(updateLastUpdatedText, 60000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [lastUpdatedAt]);

    return lastUpdatedText ? <div>{lastUpdatedText}</div> : null;
}

// Utility function to format the time difference (example implementation)
function formatLastUpdated(minutesDifference) {
    if (minutesDifference < 1) {
        return "Updated just now";
    } else if (minutesDifference === 1) {
        return "Updated 1 minute ago";
    } else {
        return `Updated ${minutesDifference} minutes ago`;
    }
}

function GoogleMapComp() {
    const [originalData, setOriginalData] = useState([]);
    const [markerPositions, setMarkerPositions] = useState([]);
    const [lastUpdatedAt, setLastUpdatedAt] = useState();

    const getPositions = () => {
        axios.get("/get-positions").then((response) => {
            setOriginalData(response.data);
            setMarkerPositions(response.data);
        });
        axios.get("/lastUpdatedPositions").then((response) => {
            console.log(response.data);
            setLastUpdatedAt(response.data);
        });
    };

    useEffect(() => {
        // Fetch positions initially
        getPositions();

        // Set up an interval to fetch positions every 30 minutesd
        const intervalId = setInterval(() => {
            getPositions();
        }, 3600000); // 60 minutes in milliseconds

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // const [sidebarVisible, setSidebarVisible] = useState(false);
    const [markerDetails, setMarkerDetails] = useState(null);

    // Function to handle marker click and show sidebar
    const handleMarkerClick = (position) => {
        setMarkerDetails({
            image: getIcon(position.event_type).url,
            type: position.event_type,
            subsurb: position.suburb,
            roadName: position.road_name,
            startDate: position.start_date,
            endDate: position.end_date,
            lastUpdated: position.last_updated,
            advice: position.advice,
            information: position.information,
            reportedBy: position.api_source,
            otherAdvice: position.otherAdvice,
        });
    };

    const getIcon = (eventType) => {
        switch (eventType) {
            case "Roadworks":
                return {
                    url: Roadworks, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Roadwork":
                return {
                    url: Roadworks, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "ROADWORKS":
                return {
                    url: Roadworks, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "24HR ROADWORKS":
                return {
                    url: Roadworks, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Alpine":
                return {
                    url: Alpine, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Flooding":
                return {
                    url: Flooding, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Congestion":
                return {
                    url: Congestion, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Hazard":
                return {
                    url: Hazard, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Regional LGA Incident":
                return {
                    url: RegionalLGA, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Incident":
                return {
                    url: Incident, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "COLLISION":
                return {
                    url: Incident, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Special event":
                return {
                    url: Major, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            case "Major Event":
                return {
                    url: Major, // Use the local image as the URL
                    scaledSize: new window.google.maps.Size(20, 20), // scaled size
                    origin: new window.google.maps.Point(0, 0), // origin
                    anchor: new window.google.maps.Point(16, 16), // anchor
                };
            default:
                return "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";
        }
    };

    const [eventFilter, setEventFilter] = useState({
        Roadworks: true,
        Incident: true,
        Flooding: false,
        Hazard: false,
        "Major Event": false,
        Alpine: false,
        "Regional LGA Incident": false,
        Congestion: true,
    });

    const [stateFilter, setStateFilter] = useState({
        NSW: true,
        QLD: true,
        SA: true,
        VIC: true,
    });

    useEffect(() => {
        const data = originalData.filter((position) => {
            const eventType = position.event_type; // Assuming each position has an `eventType` field
            const eventState = position.api_source; // Assuming each position has an `api_source` field representing the state

            // Check if the state is enabled in the stateFilter
            const isStateSelected = stateFilter[eventState];
            // const positionId = position.event_id == "663859";

            return (
                // positionId &&
                isStateSelected && // Only proceed if the state is selected
                ((eventFilter.Roadworks &&
                    (eventType === "ROADWORKS" ||
                        eventType === "24HR ROADWORKS" ||
                        eventType === "Roadwork" ||
                        eventType === "Roadworks")) ||
                    (eventFilter.Alpine && eventType === "Alpine") ||
                    (eventFilter.Flooding && eventType === "Flooding") ||
                    (eventFilter.Congestion && eventType === "Congestion") ||
                    (eventFilter.Hazard && eventType === "Hazard") ||
                    (eventFilter["Regional LGA Incident"] &&
                        eventType === "Regional LGA Incident") ||
                    (eventFilter["Major Event"] &&
                        (eventType === "Major Event" ||
                            eventType === "Special event")) ||
                    (eventFilter.Incident &&
                        (eventType === "INCIDENT" ||
                            eventType === "COLLISION" ||
                            eventType === "Incident" ||
                            eventType === "Crash")))
            );
        });
        setMarkerPositions(data);
    }, [eventFilter, stateFilter, originalData]);

    function formatDateTime(dateString) {
        const date = new Date(dateString);

        const day = date.getDate(); // Get the day of the month
        const month = date.toLocaleString("default", { month: "long" }); // Get the month name
        const year = date.getFullYear(); // Get the full year

        let hours = date.getHours(); // Get the hours
        const minutes = date.getMinutes(); // Get the minutes
        const ampm = hours >= 12 ? "pm" : "am"; // Determine AM or PM

        hours = hours % 12; // Convert to 12-hour format
        hours = hours ? hours : 12; // The hour '0' should be '12'

        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero to minutes if needed

        return `${day} ${month} ${year} ${hours}:${formattedMinutes}${ampm}`;
    }

    function handleClose() {
        setMarkerDetails(null);
    }

    return (
        <div className=" md:py-[8rem] mx-auto max-w-7xl h-full rounded-lg">
            <div className="text-goldt text-4xl font-semibold">
                National Road events
            </div>
            <p className="text-sm text-white">
                {lastUpdatedAt && <LastUpdated lastUpdatedAt={lastUpdatedAt} />}
            </p>
            {/* <div className="text-smooth">Weather & Flood Notification</div> */}
            <div className="hidden h-full">
                {/* Filter for mobile */}
                <Accordion
                    className="block md:hidden"
                    sx={{
                        backgroundColor: "#2a3034",
                        height: "4rem",
                        position: "absolute",
                        zIndex: 10,
                        width: "100%",
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <ExpandMoreIcon sx={{ color: "#e0c981" }} />
                        }
                        sx={{ backgroundColor: "#2a3034" }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: "#e0c981", fontWeight: "bold" }}
                        >
                            Weather & Flood Map
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            backgroundColor: "#2a3034",
                            paddingTop: "2rem",
                            position: "absolute",
                            // top: "-4rem",
                            width: "100%",
                            zIndex: 10,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#e0c981",
                                marginBottom: "1rem",
                                marginLeft: "2rem",
                                marginTop: "1rem",
                                fontWeight: "bold",
                            }}
                        >
                            Event Type
                        </Typography>
                        <div className="flex gap-3 flex-col select-none">
                            <div
                                onClick={(e) =>
                                    setEventFilter((prev) => ({
                                        ...prev,
                                        Roadworks: !prev["Roadworks"],
                                    }))
                                }
                                className="ml-12 mr-8  flex flex-row rounded-lg space-x-5 items-center cursor-pointer "
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        setEventFilter((prev) => ({
                                            ...prev,
                                            Roadworks: e.target.checked,
                                        }))
                                    }
                                    checked={eventFilter["Roadworks"]}
                                    sx={{
                                        color: "#e2b540",
                                        "&.Mui-checked": {
                                            color: "#ebcb7a",
                                        },
                                    }}
                                    defaultChecked
                                />
                                <img
                                    src={Roadworks}
                                    width={28}
                                    height={21}
                                    alt=""
                                />
                                <Typography
                                    variant="body1"
                                    sx={{ color: "white" }}
                                >
                                    Roadworks
                                </Typography>
                            </div>

                            <div
                                onClick={(e) =>
                                    setEventFilter((prev) => ({
                                        ...prev,
                                        "Special event": !prev["Special event"],
                                    }))
                                }
                                className="ml-12 mr-8  flex flex-row rounded-lg space-x-5 items-center cursor-pointer "
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        setEventFilter((prev) => ({
                                            ...prev,
                                            "Special event": e.target.checked,
                                        }))
                                    }
                                    checked={eventFilter["Special event"]}
                                    sx={{
                                        color: "#e2b540",
                                        "&.Mui-checked": {
                                            color: "#ebcb7a",
                                        },
                                    }}
                                    defaultChecked
                                />
                                <img
                                    src={SpecialEvent}
                                    width={28}
                                    height={21}
                                    alt=""
                                />
                                <Typography
                                    variant="body1"
                                    sx={{ color: "white" }}
                                >
                                    Special Event
                                </Typography>
                            </div>

                            <div
                                onClick={(e) =>
                                    setEventFilter((prev) => ({
                                        ...prev,
                                        Crash: !prev["Crash"],
                                    }))
                                }
                                className="ml-12 mr-8  flex flex-row rounded-lg space-x-5 items-center cursor-pointer "
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        setEventFilter((prev) => ({
                                            ...prev,
                                            Crash: e.target.checked,
                                        }))
                                    }
                                    checked={eventFilter["Crash"]}
                                    sx={{
                                        color: "#e2b540",
                                        "&.Mui-checked": {
                                            color: "#ebcb7a",
                                        },
                                    }}
                                    defaultChecked
                                />
                                <img
                                    src={Crash}
                                    width={28}
                                    height={21}
                                    alt=""
                                />
                                <Typography
                                    variant="body1"
                                    sx={{ color: "white" }}
                                >
                                    Crash
                                </Typography>
                            </div>

                            <div
                                onClick={(e) =>
                                    setEventFilter((prev) => ({
                                        ...prev,
                                        Hazard: !prev["Hazard"],
                                    }))
                                }
                                className="ml-12 mr-8  flex flex-row rounded-lg space-x-5 items-center cursor-pointer "
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        setEventFilter((prev) => ({
                                            ...prev,
                                            Hazard: e.target.checked,
                                        }))
                                    }
                                    checked={eventFilter["Hazard"]}
                                    sx={{
                                        color: "#e2b540",
                                        "&.Mui-checked": {
                                            color: "#ebcb7a",
                                        },
                                    }}
                                    defaultChecked
                                />
                                <img
                                    src={Hazard}
                                    width={28}
                                    height={21}
                                    alt=""
                                />
                                <Typography
                                    variant="body1"
                                    sx={{ color: "white" }}
                                >
                                    Hazard
                                </Typography>
                            </div>

                            <div
                                onClick={(e) =>
                                    setEventFilter((prev) => ({
                                        ...prev,
                                        Flooding: !prev["Flooding"],
                                    }))
                                }
                                className="ml-12 mr-8  flex flex-row rounded-lg space-x-5 items-center cursor-pointer "
                            >
                                <Checkbox
                                    onChange={(e) =>
                                        setEventFilter((prev) => ({
                                            ...prev,
                                            Flooding: e.target.checked,
                                        }))
                                    }
                                    checked={eventFilter["Flooding"]}
                                    sx={{
                                        color: "#e2b540",
                                        "&.Mui-checked": {
                                            color: "#ebcb7a",
                                        },
                                    }}
                                    defaultChecked
                                />
                                <img
                                    src={Flooding}
                                    width={28}
                                    height={21}
                                    alt=""
                                />
                                <Typography
                                    variant="body1"
                                    sx={{ color: "white" }}
                                >
                                    Flooding
                                </Typography>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
            <div className="flex flex-col h-[800px] mt-10">
                <div className="flex-grow flex flex-row-reverse">
                    {/* Google Map */}
                    <div className="flex-grow rounded-3xl">
                        <LoadScript googleMapsApiKey="AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go">
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "100%",
                                    borderTopRightRadius: "1rem",
                                    borderBottomRightRadius: "1rem",
                                }}
                                center={center}
                                zoom={5}
                                options={{
                                    restriction: {
                                        latLngBounds: australiaBounds,
                                        strictBounds: true,
                                    },
                                }}
                            >
                                {markerPositions.map((position, index) => (
                                    <Marker
                                        key={index}
                                        position={position}
                                        icon={getIcon(position.event_type)}
                                        onClick={() =>
                                            handleMarkerClick(position)
                                        }
                                    />
                                ))}
                            </GoogleMap>
                        </LoadScript>
                    </div>

                    {/* Sidebar */}
                    <div className="h-full w-80 bg-[#2A3034] rounded-l-2xl p-4 pr-2 overflow-y-auto">
                        {markerDetails ? (
                            <>
                                <div className="flex justify-between">
                                    <div className="flex gap-5 items-center">
                                        <img
                                            src={markerDetails.image}
                                            alt=""
                                            width={30}
                                            height={30}
                                        />
                                        <div>
                                            <p className="font-bold text-lg text-white">
                                                {markerDetails.type}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={handleClose}>
                                        <CloseIcon sx={{ color: "#e0c981" }} />
                                    </button>
                                </div>
                                <div className="mt-8 flex gap-7 items-start">
                                    <LocationOn sx={{ color: "#e0c981" }} />
                                    <div className="flex flex-col text-white">
                                        <p className="font-semibold">
                                            {markerDetails.subsurb}
                                        </p>
                                        <p className=" font-thin">
                                            {markerDetails.roadName}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-7 items-start">
                                    <AccessTimeIcon sx={{ color: "#e0c981" }} />

                                    <div className="flex flex-col text-white">
                                        <p className="font-thin">
                                            Started At{" "}
                                            {formatDateTime(
                                                markerDetails.startDate
                                            )}
                                        </p>
                                        {markerDetails.endDate ? (
                                            <p className="font-thin">
                                                Ends At{" "}
                                                {formatDateTime(
                                                    markerDetails.endDate
                                                )}
                                            </p>
                                        ) : (
                                            <p className="font-thin">
                                                Last checked at{" "}
                                                {formatDateTime(
                                                    markerDetails.lastUpdated
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {markerDetails.advice && (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <List sx={{ color: "#e0c981" }} />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                Advice
                                            </p>
                                            <p className=" font-thin">
                                                {markerDetails.advice}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {markerDetails.information ? (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <HelpCenterRounded
                                            sx={{ color: "#e0c981" }}
                                        />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                Information
                                            </p>
                                            <p
                                                className="font-thin max-w-60 max-h-[300px] overflow-hidden pr-2 containerscroll"
                                                style={{
                                                    wordBreak: "break-word",
                                                    hyphens: "auto",
                                                }}
                                            >
                                                {markerDetails.information}
                                            </p>
                                        </div>
                                    </div>
                                ) : markerDetails.otherAdvice ? (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <HelpCenterRounded
                                            sx={{ color: "#e0c981" }}
                                        />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                Information
                                            </p>

                                            <p
                                                className="font-thin max-w-60 max-h-[300px] overflow-auto pr-2 containerscroll"
                                                style={{
                                                    wordBreak: "break-word",
                                                    hyphens: "auto",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: markerDetails.otherAdvice,
                                                }}
                                            ></p>
                                        </div>
                                    </div>
                                ) : null}
                                {console.log(markerDetails)}
                            </>
                        ) : (
                            <>
                                <p className="text-3xl text-goldt">Filter</p>
                                {/*  States Filter */}
                                <p className="text-2xl text-white mt-5">
                                    States
                                </p>
                                <div className="grid grid-cols-2">
                                    {/* QLD State Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer pb-3 "
                                        onClick={(e) =>
                                            setStateFilter((prev) => ({
                                                ...prev,
                                                QLD: !prev.QLD,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setStateFilter((prev) => ({
                                                    ...prev,
                                                    QLD: e.target.checked,
                                                }))
                                            }
                                            checked={stateFilter["QLD"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <p className="text-white ">QLD</p>
                                    </div>
                                    {/* NSW State Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer pb-3 "
                                        onClick={(e) =>
                                            setStateFilter((prev) => ({
                                                ...prev,
                                                NSW: !prev.NSW,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setStateFilter((prev) => ({
                                                    ...prev,
                                                    NSW: e.target.checked,
                                                }))
                                            }
                                            checked={stateFilter["NSW"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <p className="text-white ">NSW</p>
                                    </div>
                                    {/* SA State Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer pb-3 "
                                        onClick={(e) =>
                                            setStateFilter((prev) => ({
                                                ...prev,
                                                SA: !prev.SA,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setStateFilter((prev) => ({
                                                    ...prev,
                                                    SA: e.target.checked,
                                                }))
                                            }
                                            checked={stateFilter["SA"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <p className="text-white ">SA</p>
                                    </div>
                                    {/* VIC State Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer pb-3 "
                                        onClick={(e) =>
                                            setStateFilter((prev) => ({
                                                ...prev,
                                                VIC: !prev.VIC,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setStateFilter((prev) => ({
                                                    ...prev,
                                                    VIC: e.target.checked,
                                                }))
                                            }
                                            checked={stateFilter["VIC"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <p className="text-white ">VIC</p>
                                    </div>
                                </div>
                                {/*  Event Filter */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-2xl  text-white mt-5">
                                        Event Type
                                    </p>

                                    {/* Roadworks Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer   "
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Roadworks: !prev.Roadworks,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Roadworks: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Roadworks"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />

                                        <img
                                            src={Roadworks}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white  ">
                                            Roadworks
                                        </p>
                                    </div>
                                    {/* Incident Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer   "
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Incident: !prev.Incident,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Incident: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Incident"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />

                                        <img
                                            src={Incident}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white  ">Incident</p>
                                    </div>
                                    {/* Flooding Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center   cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Flooding: !prev.Flooding,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Flooding: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Flooding"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={Flooding}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">Flooding</p>
                                    </div>
                                    {/* Hazard Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer   "
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Hazard: !prev.Hazard,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Hazard: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Hazard"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={Hazard}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">Hazard</p>
                                    </div>
                                    {/* Major Event Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                ["Major Event"]:
                                                    !prev["Major Event"],
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    ["Major Event"]:
                                                        e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Major Event"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={Major}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">
                                            Major Event
                                        </p>
                                    </div>

                                    {/* Alpine Filter */}
                                    <div
                                        className="  mr-8 hidden flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Alpine: !prev.Alpine,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Alpine: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Alpine"]}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={Alpine}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">Alpine</p>
                                    </div>
                                    {/* Regional LGA Incident Filter */}
                                    <div
                                        className="  mr-2  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                ["Regional LGA Incident"]:
                                                    !prev[
                                                        "Regional LGA Incident"
                                                    ],
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    ["Regional LGA Incident"]:
                                                        e.target.checked,
                                                }))
                                            }
                                            checked={
                                                eventFilter[
                                                    "Regional LGA Incident"
                                                ]
                                            }
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={RegionalLGA}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">
                                            Regional LGA Incident
                                        </p>
                                    </div>
                                    {/* Congestion LGA Incident Filter */}
                                    <div
                                        className="  mr-2  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Congestion: !prev.Congestion,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Congestion:
                                                        e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter.Congestion}
                                            sx={{
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: 28,
                                                },
                                                color: "#e2b540",
                                                "&.Mui-checked": {
                                                    color: "#ebcb7a",
                                                },
                                            }}
                                            defaultChecked
                                        />
                                        <img
                                            src={Congestion}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">
                                            Congestion
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoogleMapComp;
