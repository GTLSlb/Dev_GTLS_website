import React, { useEffect, useState ,useRef } from "react";
import {
    GoogleMap,
    LoadScript,
    Polyline,
    Marker
} from "@react-google-maps/api";

import Roadworks from "@/assets/icons/RoadWork.png";
import Alpine from "@/assets/icons/Alpine.png";
import Flooding from "@/assets/icons/Flooding.png";
import Congestion from "@/assets/icons/Congestion.png";
import Hazard from "@/assets/icons/Hazard.png";
import RegionalLGA from "@/assets/icons/RegionalLGA.png";
import Incident from "@/assets/icons/Incident.png";
import Major from "@/assets/icons/Major.png";
import TrafficLayer from './TrafficLayer';
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

function GoogleMapComp() {
    const [originalData, setOriginalData] = useState([]);
    const [markerPositions, setMarkerPositions] = useState([]);
    const [routePolyline, setRoutePolyline] = useState(null);
    const [isRouteClear, setIsRouteClear] = useState(null);
    const [startLocation, setStartLocation] = useState("");
    const [endLocation, setEndLocation] = useState("");
    const [startLat, setStartLat] = useState("");
    const [startLng, setStartLng] = useState("");
    const [endLat, setEndLat] = useState("");
    const [endLng, setEndLng] = useState("");
    const [eventsOnRoute, setEventsOnRoute] = useState([]);
    const [startCoords, setStartCoords] = useState(null); 
    const [endCoords, setEndCoords] = useState(null);
    const [startAddress, setStartAddress] = useState(null); 
    const [endAddress, setEndAddress] = useState(null);
    const mapRef = useRef(null);

    const getPositions = () => {
        axios.get("/get-positions").then((response) => {
            setOriginalData(response.data);
            setMarkerPositions(response.data);
        });
    };

    useEffect(() => {
       
        getPositions();

       
        const intervalId = setInterval(() => {
            getPositions();
        }, 1800000); 

      
        return () => clearInterval(intervalId);
    }, []);

    const geocodeLocation = async (location) => {
        try {
            const response = await axios.get('/api/geocode', { params: { address: location } });

            if (response.data.status === "OK") {
                const locationData = response.data.results[0].geometry.location;
                console.log(locationData.lat);
                console.log(locationData.lng)
                return {
                    lat: locationData.lat,
                    lng: locationData.lng
                };
                
            } else {
                console.error('Geocoding error:', response.data.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching geocode data:', error);
            return null;
        }
    };


    const reverseGeocode = async (lat, lng) => {
        try {
           
            const response = await axios.get('/api/geocode', {
                params: { lat, lng }
            });
    
            if (response.data.status === "OK") {
                return response.data.results[0].formatted_address;
            } else {
                console.error("Geocoding error:", response.data.error || response.data.status);
                return null;
            }
        } catch (error) {
            console.error("Error fetching address data:", error);
            return null;
        }
    };
    
    const getRouteUsingRoutesAPI = async () => {
        
        const startLatNum = parseFloat(startLat);
        const startLngNum = parseFloat(startLng);
        const endLatNum = parseFloat(endLat);
        const endLngNum = parseFloat(endLng);
    
       
        if (isNaN(startLatNum) || isNaN(startLngNum) || isNaN(endLatNum) || isNaN(endLngNum)) {
            console.error('Invalid coordinates provided.');
            return;
        }
    
       
        const fetchedStartAddress = await reverseGeocode(startLatNum, startLngNum);
        const fetchedEndAddress = await reverseGeocode(endLatNum, endLngNum);
    
        if (!fetchedStartAddress || !fetchedEndAddress) {
            console.error('Failed to retrieve one or both locations.');
            return;
        }
    
      
        const startCoords = { lat: startLatNum, lng: startLngNum };
        const endCoords = { lat: endLatNum, lng: endLngNum };
    
        setStartCoords(startCoords);
        setEndCoords(endCoords);
        setStartAddress(fetchedStartAddress);
        setEndAddress(fetchedEndAddress);
    
        try {
            const response = await axios.post(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
                origin: {
                    location: {
                        latLng: {
                            latitude: startLatNum,
                            longitude: startLngNum,
                        }
                    }
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: endLatNum,
                            longitude: endLngNum,
                        }
                    }
                },
                travelMode: 'DRIVE',
                polylineQuality: 'HIGH_QUALITY'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': 'AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go',
                    'X-Goog-FieldMask': 'routes'
                }
            });
    
            if (response.data.routes && response.data.routes.length > 0) {
                const polylinePoints = response.data.routes[0].polyline.encodedPolyline;
                const decodedPath = window.google.maps.geometry.encoding.decodePath(polylinePoints);
                const route = decodedPath.map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
    
                setRoutePolyline(route);
                fitMapToBounds(route);
    
                // Filter events on the route
                const events = markerPositions.filter((marker) => {
                    return route.some((point) => {
                        const distance = getDistanceBetweenPoints(point, marker);
                        return distance <= 1000; 
                    });
                });
    
                setEventsOnRoute(events);
                setIsRouteClear(events.length === 0);
            } else {
                console.error('No valid routes found.');
            }
        } catch (error) {
            console.error('Error fetching routes data:', error);
        }
    };
    const fitMapToBounds = (route) => {
        if (mapRef.current && route.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            route.forEach(point => {
                bounds.extend(new window.google.maps.LatLng(point.lat, point.lng));
            });
            mapRef.current.fitBounds(bounds);
        }
    };
 
    const getDistanceBetweenPoints = (point1, point2) => {
        const rad = (x) => (x * Math.PI) / 180;
        const R = 6378137; 

        const dLat = rad(point2.lat - point1.lat);
        const dLong = rad(point2.lng - point1.lng);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(point1.lat)) * Math.cos(rad(point2.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; 
    };

    // Function to chunk the array
    const chunkArray = (array, chunkSize) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

   

    const [markerDetails, setMarkerDetails] = useState(null);


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

           
            const isStateSelected = stateFilter[eventState];
           
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
        console.log(data);
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
        <div className="md:py-[8rem] mx-auto max-w-7xl h-full rounded-lg">
            <div className="text-goldt text-4xl font-semibold">Live Traffic</div>
    
          
            <div className="flex mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Start Latitude"
                    value={startLat}
                    onChange={(e) => setStartLat(e.target.value)}
                    className="border p-2 mr-2 w-full"
                />
              
                <input
                    type="text"
                    placeholder="Start Longitude"
                    value={startLng}
                    onChange={(e) => setStartLng(e.target.value)}
                    className="border p-2 mr-2 w-full"
                />
                  <input
                    type="text"
                    placeholder="End Latitude"
                    value={endLat}
                    onChange={(e) => setEndLat(e.target.value)}
                    className="border p-2 mr-2 w-full"
                />
                <input
                    type="text"
                    placeholder="End Longitude"
                    value={endLng}
                    onChange={(e) => setEndLng(e.target.value)}
                    className="border p-2 mr-2 w-full"
                />
                <button onClick={getRouteUsingRoutesAPI} className="bg-blue-500 text-white p-2">
                    Check
                </button>
            </div>

            <div className="h-full w-80 bg-[#2A3034] rounded-l-2xl p-4 pr-2 overflow-y-auto">
    {markerDetails ? (
        <>
           
        </>
    ) : (
        <>
            
            <p className="text-3xl text-goldt mt-1">Events on Route</p>
                       {/* Display the route check result */}
                       {isRouteClear !== null && (
                <div className="mt-4">
                    {isRouteClear ? (
                        <p className="text-green-500">This road is empty of eventes.</p>
                    ) : (
                        <p className="text-red-500">This road is blocked.</p>
                    )}
                </div>
            )}
            {eventsOnRoute.length > 0 ? (
                <ul>
                    {eventsOnRoute.map((event, index) => (
                        <li key={index} className="mt-4">
                            <div className="flex gap-4 items-center">
                                <img src={getIcon(event.event_type).url} alt="" width={20} height={20} />
                                <div>
                                    <p className="text-white font-semibold">{event.event_type}</p>
                                    <p className="text-white text-sm">{event.road_name}, {event.suburb}</p>
                                    <p className="text-white text-xs">{formatDateTime(event.start_date)} - {event.end_date ? formatDateTime(event.end_date) : "Ongoing"}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-green-500">No events on this route.</p>
            )}
        </>
    )}
</div>

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
                        expandIcon={<ExpandMoreIcon sx={{ color: "#e0c981" }} />}
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
                                onClick={() =>
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
                                <img src={Roadworks} width={28} height={21} alt="" />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Roadworks
                                </Typography>
                            </div>
    
                            <div
                                onClick={() =>
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
                                <img src={SpecialEvent} width={28} height={21} alt="" />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Special Event
                                </Typography>
                            </div>
    
                            <div
                                onClick={() =>
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
                                <img src={Crash} width={28} height={21} alt="" />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Crash
                                </Typography>
                            </div>
    
                            <div
                                onClick={() =>
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
                                <img src={Hazard} width={28} height={21} alt="" />
                                <Typography variant="body1" sx={{ color: "white" }}>
                                    Hazard
                                </Typography>
                            </div>
    
                            <div
                                onClick={() =>
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
                                <img src={Flooding} width={28} height={21} alt="" />
                                <Typography variant="body1" sx={{ color: "white" }}>
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
                        <LoadScript googleMapsApiKey="AIzaSyCvQ-XLmR8QNAr25M30xEcqX-nD-yTQ0go"  libraries={['geometry', 'visualization']}>
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "100%",
                                    borderTopRightRadius: "1rem",
                                    borderBottomRightRadius: "1rem",
                                }}
                                center={center}
                                zoom={5}
                                onLoad={map => (mapRef.current = map)} 
                                options={{
                                    restriction: {
                                        latLngBounds: australiaBounds,
                                        strictBounds: true,
                                    },
                                }}
                                
                            >
                                <TrafficLayer /> 
                                {markerPositions.map((position, index) => (
                                    <Marker
                                        key={index}
                                        position={position}
                                        icon={getIcon(position.event_type)}
                                        onClick={() => handleMarkerClick(position)}
                                    />
                                ))}
                                {routePolyline && (
                                    <Polyline
                                        path={routePolyline}
                                        options={{
                                            strokeColor: isRouteClear ? "#008000" : "#FF0000",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 4,
                                        }}
                                    />
                                )}
                        {startCoords && startAddress && (
                                    <Marker
                                        position={startCoords}
                                        label={{
                                            text: startAddress,
                                            color: "black",
                                            fontWeight: "bold", 
                                            fontSize: "20px", 
                                        }}
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                        }}
                                    />
                                    
                                )}

                    {endCoords && endAddress && (
                                    <Marker
                                        position={endCoords}
                                        label={{
                                            text: endAddress,
                                            color: "black", 
                                            fontWeight: "bold", 
                                            fontSize: "20px", 
                                        }}
                                        icon={{
                                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                        }}
                                    />
                                      
                                )}

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
                                            {formatDateTime(markerDetails.startDate)}
                                        </p>
                                        {markerDetails.endDate ? (
                                            <p className="font-thin">
                                                Ends At{" "}
                                                {formatDateTime(markerDetails.endDate)}
                                            </p>
                                        ) : (
                                            <p className="font-thin">
                                                Last checked at{" "}
                                                {formatDateTime(markerDetails.lastUpdated)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {markerDetails.advice && (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <List sx={{ color: "#e0c981" }} />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">Advice</p>
                                            <p className=" font-thin">
                                                {markerDetails.advice}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {markerDetails.information ? (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <HelpCenterRounded sx={{ color: "#e0c981" }} />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                Information
                                            </p>
                                            <p className=" font-thin max-h-[300px] overflow-y-auto pr-2 containerscroll">
                                                {markerDetails.information}
                                            </p>
                                        </div>
                                    </div>
                                ) : markerDetails.otherAdvice ? (
                                    <div className="mt-8 flex gap-7 items-start">
                                        <HelpCenterRounded sx={{ color: "#e0c981" }} />
                                        <div className="flex flex-col text-white">
                                            <p className="font-semibold">
                                                Information
                                            </p>
    
                                            <p
                                                className="font-thin max-w-60 max-h-[300px] overflow-y-auto pr-2 containerscroll"
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
                                <p className="text-2xl text-white mt-5">States</p>
                                <div className="grid grid-cols-2">
                                    {/* QLD State Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer pb-3 "
                                        onClick={() =>
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
                                        onClick={() =>
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
                                        onClick={() =>
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
                                        onClick={() =>
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
                                        onClick={() =>
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
    
                                        <img src={Roadworks} width={28} height={21} alt="" />
                                        <p className="text-white  ">Roadworks</p>
                                    </div>
                                    {/* Incident Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center cursor-pointer   "
                                        onClick={() =>
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
    
                                        <img src={Incident} width={28} height={21} alt="" />
                                        <p className="text-white  ">Incident</p>
                                    </div>
                                    {/* Flooding Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center   cursor-pointer"
                                        onClick={() =>
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
                                        <img src={Flooding} width={28} height={21} alt="" />
                                        <p className="text-white ">Flooding</p>
                                    </div>
                                    {/* Hazard Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer   "
                                        onClick={() =>
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
                                        <img src={Hazard} width={28} height={21} alt="" />
                                        <p className="text-white ">Hazard</p>
                                    </div>
                                    {/* Major Event Filter */}
                                    <div
                                        className="  mr-8  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={() =>
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
                                                    ["Major Event"]: e.target.checked,
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
                                        <img src={Major} width={28} height={21} alt="" />
                                        <p className="text-white ">Major Event</p>
                                    </div>
    
                                    {/* Alpine Filter */}
                                    <div
                                        className="  mr-8 hidden flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={() =>
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
                                        <img src={Alpine} width={28} height={21} alt="" />
                                        <p className="text-white ">Alpine</p>
                                    </div>
                                    {/* Regional LGA Incident Filter */}
                                    <div
                                        className="  mr-2  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={() =>
                                            setEventFilter((prev) => ({
                                                ...prev,
                                                ["Regional LGA Incident"]:
                                                    !prev["Regional LGA Incident"],
                                            }))
                                        }
                                    >
                                        <Checkbox
                                            onChange={(e) =>
                                                setEventFilter((prev) => ({
                                                    ...prev,
                                                    ["Regional LGA Incident"]: e.target.checked,
                                                }))
                                            }
                                            checked={eventFilter["Regional LGA Incident"]}
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
                                        <img src={RegionalLGA} width={28} height={21} alt="" />
                                        <p className="text-white ">
                                            Regional LGA Incident
                                        </p>
                                    </div>
                                    {/* Congestion LGA Incident Filter */}
                                    <div
                                        className="  mr-2  flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer"
                                        onClick={() =>
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
                                                    Congestion: e.target.checked,
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
                                        <img src={Congestion} width={28} height={21} alt="" />
                                        <p className="text-white ">Congestion</p>
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

