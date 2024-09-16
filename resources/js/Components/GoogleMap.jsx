import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";
import Other from "@/assets/icons/Other.png";
import {
    Checkbox,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import {
    List,
    LocationOn,
    AccessTime as AccessTimeIcon,
    Close as CloseIcon,
    HelpCenterRounded,
} from "@mui/icons-material";
import "../../css/scroll.css";

const center = { lat: -25.2744, lng: 133.7751 };
const australiaBounds = { north: -5.0, south: -55.0, east: 165.0, west: 105.0 };

const eventTypeMapping = {
    Roadworks: ["ROADWORKS", "24HR ROADWORKS", "Roadwork", "Roadworks"],
    Alpine: ["Alpine"],
    Flooding: ["Flooding"],
    Congestion: ["Congestion"],
    Hazard: ["Hazard", "Vehicle fire", "Fire", "Vehicle rollover", "Landslip"],
    "Regional LGA Incident": ["Regional LGA Incident", "Emergency Incident"],
    "Major Event": ["Major Event", "Special event", "Demonstration"],
    Incident: [
        "INCIDENT",
        "COLLISION",
        "Incident",
        "Crash",
        "Emergency Incident",
    ],
    Other: ["Equipment damage", "Equipment fault"],
};

const iconMappings = {
    Roadworks,
    Alpine,
    Flooding,
    Congestion,
    Hazard,
    "Regional LGA Incident": RegionalLGA,
    "Major Event": Major,
    Incident,
    Other,
};

function LastUpdated({ lastUpdatedAt }) {
    const [lastUpdatedText, setLastUpdatedText] = useState("");

    useEffect(() => {
        const updateLastUpdatedText = () => {
            const isoDateString = lastUpdatedAt.replace(" ", "T") + "Z"; // Format date as ISO 8601
            const currentUtcDate = new Date();
            const specificUtcDate = new Date(isoDateString);
            const differenceInMilliseconds = Math.abs(
                currentUtcDate - specificUtcDate
            );
            const differenceInMinutes = Math.floor(
                differenceInMilliseconds / (1000 * 60)
            );
            setLastUpdatedText(formatLastUpdated(differenceInMinutes));
        };

        updateLastUpdatedText();
        const intervalId = setInterval(updateLastUpdatedText, 60000); // Update every minute
        return () => clearInterval(intervalId);
    }, [lastUpdatedAt]);

    return lastUpdatedText ? <div>{lastUpdatedText}</div> : null;
}

function formatLastUpdated(minutesDifference) {
    if (minutesDifference < 1) {
        return "Updated just now";
    } else if (minutesDifference === 1) {
        return "Updated 1 minute ago";
    } else {
        return `Updated ${minutesDifference} minutes ago`;
    }
}

const GoogleMapComp = () => {
    const [originalData, setOriginalData] = useState([]);
    const [markerPositions, setMarkerPositions] = useState([]);
    const [lastUpdatedAt, setLastUpdatedAt] = useState();
    const [eventFilter, setEventFilter] = useState({
        Roadworks: true,
        Incident: true,
        Flooding: false,
        Hazard: false,
        "Major Event": false,
        Alpine: false,
        "Regional LGA Incident": false,
        Congestion: true,
        Other: false,
    });
    const [stateFilter, setStateFilter] = useState({
        NSW: true,
        QLD: true,
        SA: true,
        VIC: true,
    });
    const [markerDetails, setMarkerDetails] = useState(null);
    const mapRef = useRef(null);
    const clustererRef = useRef(null);

    const getIcon = (eventType) => {
        const mainCategory = Object.keys(eventTypeMapping).find((category) =>
            eventTypeMapping[category].includes(eventType)
        );
        const iconUrl =
            iconMappings[mainCategory] ||
            "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";
        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(20, 20),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(16, 16),
        };
    };

    const fetchPositions = async () => {
        try {
            const [positionsResponse, lastUpdatedResponse] = await Promise.all([
                axios.get("/get-positions"),
                axios.get("/lastUpdatedPositions"),
            ]);
            setOriginalData(positionsResponse.data);
            setMarkerPositions(positionsResponse.data);
            setLastUpdatedAt(lastUpdatedResponse.data);
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchPositions();
        const intervalId = setInterval(fetchPositions, 3600000); // Fetch data every 60 minutes
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        console.log(originalData)
        if (originalData) {
            const filteredData = originalData?.filter((position) => {
                const isStateSelected = stateFilter[position.api_source];
                const isEventSelected = Object.entries(eventTypeMapping).some(
                    ([filterKey, typeArray]) =>
                        eventFilter[filterKey] &&
                        typeArray.includes(position.event_type)
                );
                return isStateSelected && isEventSelected;
            });
            setMarkerPositions(filteredData);
        }
    }, [eventFilter, stateFilter, originalData]);

    const handleMarkerClick = (position) => {
        setMarkerDetails({
            image: getIcon(position.event_type).url,
            id: position.event_id,
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

    const initializeClusterer = useCallback((map) => {
        mapRef.current = map;

        // Initialize MarkerClusterer with new keyword
        clustererRef.current = new MarkerClusterer({
            map,
            markers: [],
        });
    }, []);

    const renderMarkers = () => {
        if (!clustererRef.current) return;

        clustererRef.current.clearMarkers(); // Clear existing markers

        const markers = markerPositions
            .map((geometry) => {
                const {
                    geometry_type,
                    geometry_coordinates,
                    event_type,
                    event_id,
                } = geometry;
                if (geometry_type === "Point") {
                    return new window.google.maps.Marker({
                        position: {
                            lat: geometry_coordinates[1],
                            lng: geometry_coordinates[0],
                        },
                        icon: getIcon(event_type),
                    });
                }
                return null;
            })
            .filter((marker) => marker !== null); // Remove null markers

        clustererRef.current.addMarkers(markers); // Add markers to clusterer
    };

    useEffect(() => {
        if (mapRef.current) {
            renderMarkers();
        }
    }, [markerPositions, renderMarkers]);

    return (
        <div className="md:py-[8rem] mx-auto max-w-7xl h-full rounded-lg">
            <div className="text-goldt text-4xl font-semibold">
                National Road events
            </div>
            <p className="text-sm text-white">
                {lastUpdatedAt && <LastUpdated lastUpdatedAt={lastUpdatedAt} />}
            </p>
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
                                onLoad={initializeClusterer}
                            />
                        </LoadScript>
                    </div>
                    {/* Sidebar */}
                    <div className="h-full w-80 bg-[#2A3034] rounded-l-2xl p-4 pr-2 overflow-y-auto">
                        {markerDetails ? (
                            <>
                                {/* Details Section */}
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
                                    <button
                                        onClick={() => setMarkerDetails(null)}
                                    >
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
                                        {markerDetails.endDate && (
                                            <p className="font-thin">
                                                Ends At{" "}
                                                {formatDateTime(
                                                    markerDetails.endDate
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
                                {markerDetails.information ||
                                markerDetails.otherAdvice ? (
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
                                                    __html:
                                                        markerDetails.information ||
                                                        markerDetails.otherAdvice,
                                                }}
                                            ></p>
                                        </div>
                                    </div>
                                ) : null}
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
                                    {/* Other Filter */}
                                    <div
                                        className="  mr-8 flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={(e) =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                Other: !prev.Other,
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    Other: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Other"]}
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
                                            src={Other}
                                            width={28}
                                            height={21}
                                            alt=""
                                        />
                                        <p className="text-white ">Other</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoogleMapComp;
