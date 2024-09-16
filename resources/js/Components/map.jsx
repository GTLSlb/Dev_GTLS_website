import React, { useEffect, useState, useRef } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
// import { ArrowIcon } from "../assets/icons/ArrowIcon";
import Roadworks from "../assets/pictures/Roadworks.png";
import Crash from "../assets/pictures/Crash.png";
import Hazard from "../assets/pictures/Hazard.png";
import SpecialEvent from "../assets/pictures/SpecialEvents.png";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { Checkbox } from "@nextui-org/checkbox";
import Flooding from "../assets/pictures/Flooding.png";
import { Checkbox } from "@mui/material";
// import Checkbox from "./Checkbox";
// import { Checkbox } from "@nextui-org/react";
const Map = () => {
    // coordinates of the cities and states that we need to show their weather
    const coordinates = [
        { name: "Sydney", latitude: -33.8688, longitude: 151.2093 },
        { name: "Melbourne", latitude: -37.8136, longitude: 144.9631 },
        { name: "Brisbane", latitude: -27.4698, longitude: 153.0251 },
        { name: "Perth", latitude: -31.9505, longitude: 115.8605 },
        { name: "Adelaide", latitude: -34.9285, longitude: 138.6007 },
        { name: "Hobart", latitude: -42.8821, longitude: 147.3272 },
        { name: "Canberra", latitude: -35.2809, longitude: 149.13 },
        { name: "Darwin", latitude: -12.4634, longitude: 130.8456 },
        { name: "Griffith", latitude: -34.2884, longitude: 146.0587 },
        { name: "Broken Hill", latitude: -31.9539, longitude: 141.4539 },
        { name: "Mildura", latitude: -34.1854, longitude: 142.1625 },
        { name: "Dubbo", latitude: -32.2486, longitude: 148.602 },
        { name: "Toowoomba", latitude: -27.5598, longitude: 151.9501 },
        { name: "Warwick", latitude: -28.2238, longitude: 152.038 },
        { name: "Lismore", latitude: -28.8135, longitude: 153.2778 },
        { name: "Gold Coast", latitude: -28.0167, longitude: 153.4 },
        { name: "Gympie", latitude: -26.1892, longitude: 152.6667 },
        { name: "Maryborough", latitude: -25.5407, longitude: 152.7057 },
        { name: "Gladstone", latitude: -23.85, longitude: 151.25 },
        { name: "Rockhampton", latitude: -23.3777, longitude: 150.5127 },
        { name: "Mackay", latitude: -21.1429, longitude: 149.1856 },
        { name: "Townsville", latitude: -19.2576, longitude: 146.8233 },
        { name: "Cairns", latitude: -16.9204, longitude: 145.7709 },
        { name: "Cape Tribulation", latitude: -16.1082, longitude: 145.4428 },
        { name: "Wujal Wujal", latitude: -15.9441, longitude: 145.32 },
        { name: "Cooktown", latitude: -15.4639, longitude: 145.25 },
        { name: "Hope Vale", latitude: -15.2565, longitude: 145.18 },
        { name: "Mount Isa", latitude: -20.725, longitude: 139.49 },
        { name: "Bundaberg", latitude: -24.8662, longitude: 152.3486 },
        { name: "Hervey Bay", latitude: -25.2882, longitude: 152.8399 },
        { name: "Mackay", latitude: -21.1429, longitude: 149.1856 },
        { name: "Brisbane", latitude: -27.4698, longitude: 153.0251 },
        { name: "Gold Coast", latitude: -28.0167, longitude: 153.4 },
        { name: "Sunshine Coast", latitude: -26.65, longitude: 153.0667 },
        { name: "Cairns", latitude: -16.9204, longitude: 145.7709 },
        { name: "Townsville", latitude: -19.2576, longitude: 146.8233 },
        { name: "Rockhampton", latitude: -23.3777, longitude: 150.5127 },
        { name: "Mackay", latitude: -21.1429, longitude: 149.1856 },
        { name: "Toowoomba", latitude: -27.5606, longitude: 151.9558 },
        { name: "Logan City", latitude: -27.6392, longitude: 153.1094 },
        { name: "Redland City", latitude: -27.614, longitude: 153.3249 },
        { name: "Gladstone", latitude: -23.8437, longitude: 151.2578 },
        { name: "Maryborough", latitude: -25.5407, longitude: 152.7057 },
        { name: "Mount Isa", latitude: -20.725, longitude: 139.49 },
        { name: "Bundaberg", latitude: -24.8662, longitude: 152.3486 },
        { name: "Emerald", latitude: -23.526, longitude: 148.1637 },
        { name: "Charters Towers", latitude: -20.07, longitude: 146.27 },
        { name: "Port Douglas", latitude: -16.4833, longitude: 145.4667 },
        { name: "Ayr", latitude: -19.5804, longitude: 147.4114 },
        { name: "Ingham", latitude: -18.6524, longitude: 146.1667 },
        { name: "Longreach", latitude: -23.4443, longitude: 144.2526 },
        { name: "Roma", latitude: -26.5713, longitude: 148.7823 },
        { name: "Goondiwindi", latitude: -28.5526, longitude: 150.3229 },
        { name: "Bowen", latitude: -20.0058, longitude: 148.2478 },
        { name: "Innisfail", latitude: -17.5222, longitude: 146.0311 },
        { name: "Warwick", latitude: -28.2228, longitude: 152.0313 },
        { name: "Monto", latitude: -24.8654, longitude: 151.1249 },
        { name: "Eidsvold", latitude: -25.3667, longitude: 151.1222 },
        { name: "St George", latitude: -28.0364, longitude: 148.5941 },
        { name: "Clermont", latitude: -22.8172, longitude: 147.6383 },
        { name: "Kingaroy", latitude: -26.5381, longitude: 151.8406 },
        { name: "Tully", latitude: -17.9333, longitude: 145.9333 },
        { name: "Bowen", latitude: -20.0058, longitude: 148.2478 },
        { name: "Roma", latitude: -26.5713, longitude: 148.7823 },
        { name: "Oakey", latitude: -27.4147, longitude: 151.725 },
        { name: "Thargomindah", latitude: -27.9993, longitude: 143.8121 },
        { name: "Boulia", latitude: -22.9088, longitude: 139.9095 },
        { name: "Burketown", latitude: -17.7228, longitude: 139.534 },
        { name: "Charleville", latitude: -26.4, longitude: 146.25 },
        { name: "Innisfail", latitude: -17.5222, longitude: 146.0311 },
        { name: "Camooweal", latitude: -19.9167, longitude: 138.1167 },
        { name: "Hughenden", latitude: -20.8498, longitude: 144.2037 },
        { name: "Birdsville", latitude: -25.8986, longitude: 139.3531 },
        { name: "Kowanyama", latitude: -15.4849, longitude: 141.7513 },
        { name: "Longreach", latitude: -23.4443, longitude: 144.2526 },
    ];

    //////////////////////////////////////////
    // This use state contain api response//
    /////////////////////////////////////////

    const [data, setData] = useState([]);

    //////////////////////////////////////////////
    // This will save the weather data from API//
    //////////////////////////////////////////////

    const [weatherData, setWeatherData] = useState([]);

    // this to filter if the user want to see the weather status or not
    const [showWeather, setShowWeather] = useState(true);

    // This use state contain the filter values of event like crash roadworks etc ..
    const [eventFilter, setEventFilter] = useState({
        Roadworks: true,
        Crash: true,
        Flooding: true,
        Hazard: true,
        "Special event": true,
    });

    const [priorityFilter, setPriorityFilter] = useState({
        High: true,
        Medium: true,
        Low: true,
    });
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const weatherMarkerRef = useRef([]);

    useEffect(() => {
        fetch(
            "https://api.qldtraffic.qld.gov.au/v2/events?apikey=3e83add325cbb69ac4d8e5bf433d770b"
        )
            .then((response) => response.json())
            .then((data) => {
                setData(data.features);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // This request the weather status and add them into map with the icon for each status
    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!getFromLocalStorage("weatherData")) {
                const promises = coordinates.map((coord) => {
                    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coord.latitude}&longitude=${coord.longitude}&current=temperature_2m,is_day,rain,snowfall,weather_code,cloud_cover,wind_speed_10m`;
                    return fetch(url).then((response) => response.json());
                });

                const data = await Promise.all(promises);
                saveToLocalStorage("weatherData", data);
            }
            setWeatherData(getFromLocalStorage("weatherData"));
        };
        fetchWeatherData();
    }, []);

    useEffect(() => {
        weatherMarkerRef.current.forEach((marker) => {
            mapRef.current.removeLayer(marker);
        });

        weatherMarkerRef.current = [];

        if (weatherData.length > 0 && showWeather) {
            weatherData.forEach((weather, index) => {
                const { name, latitude, longitude } = coordinates[index];

                const weatherIconUrl = getWeatherIconUrl(
                    weather?.current?.weather_code,
                    weather?.current?.is_day
                );

                const weatherIcon = L.icon({
                    iconUrl: weatherIconUrl,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                });

                if (latitude && longitude) {
                    const marker = L.marker([latitude, longitude], {
                        icon: weatherIcon,
                    })
                        .bindPopup(
                            `
            <div>
              <h3>Weather in ${name}</h3>
              <p>Temperature: ${weather?.current?.temperature_2m}°C</p>
              <p>Wind Speed: ${weather?.current?.wind_speed_10m}m/s</p>
            </div>
            `
                        )
                        .addTo(mapRef.current);

                    // Add marker to the markers array
                    weatherMarkerRef.current.push(marker);
                }
            });
        }
    }, [weatherData, coordinates, showWeather]);

    useEffect(() => {
        if (mapRef.current === null) {
            mapRef.current = L.map("map", {
                center: [-25.2744, 133.7751], // Centered on Australia
                zoom: 0,
                zoomControl: false,
                maxBounds: [
                    [-90, -180],
                    [90, 180],
                ],
                maxBoundsViscosity: 1.0,
            }).setView([51.505, -0.09], 5);

            // Bounding box for Australia
            const australiaBounds = [
                [-44, 113], // Southwest coordinates
                [-10, 154], // Northeast coordinates
            ];

            mapRef.current.setMaxBounds(australiaBounds);

            // mapRef.current.on("zoomend", () => {
            //     if (
            //         !mapRef.current
            //             .getBounds()
            //             .contains(mapRef.current.getCenter())
            //     ) {
            //         mapRef.current.setView([-25.2744, 133.7751], 5);
            //     }
            // });

            // Add zoom control
            L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

            // Add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                noWrap: true,
                minZoom: 4,
                maxZoom: 13,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><a href="https://open-meteo.com/"> | Open-Meteo.com</a> contributors',
            }).addTo(mapRef.current);
            try {
                let currentLayer = null;

                const initialStyle = {
                    color: "white",
                    fillColor: "transparent",
                    weight: 2,
                    dashArray: "5, 5",
                    opacity: 0.6,
                    fillOpacity: 0.1,
                };

                const clickedStyle = {
                    color: "green",
                    weight: 5,
                };

                const states = L.geoJSON(getData(), {
                    style: {
                        color: "white",
                        fillColor: "transparent",
                        weight: 2,
                        dashArray: "5,5",
                        opacity: 0.6,
                        fillOpacity: 0.1,
                    },

                    onEachFeature: (feature, layer) => {
                        layer.on({
                            click: (e) => {
                                const clickedLayer = e.target;

                                const bounds = e.target.getBounds();
                                mapRef.current.flyToBounds(bounds, {
                                    // padding: [20, 20],
                                    animate: true,
                                });

                                if (
                                    currentLayer &&
                                    currentLayer !== clickedLayer
                                ) {
                                    currentLayer.setStyle(initialStyle);
                                }

                                clickedLayer.setStyle(clickedStyle);

                                currentLayer = clickedLayer;
                            },
                        });
                    },
                }).addTo(mapRef.current);
            } catch (error) {
                console.error("Error loading GeoJSON:", error);
            }
        }

        // Clear previous markers
        markersRef.current.forEach((marker) => {
            mapRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        const getIcon = (eventType) => {
            switch (eventType) {
                case "Crash":
                    return "https://qldtraffic.qld.gov.au/images/roadevents/Crash.png";
                case "Roadworks":
                    return "https://qldtraffic.qld.gov.au/images/roadevents/Roadworks.png";
                case "Hazard":
                    return "https://qldtraffic.qld.gov.au/images/roadevents/Hazard.png";
                case "Flooding":
                    return "https://qldtraffic.qld.gov.au/images/roadevents/Flooding.png";
                case "Special event":
                    return "https://qldtraffic.qld.gov.au/images/roadevents/SpecialEvents.png";
                default:
                    return "https://example.com/default-icon.png";
            }
        };

        data.forEach((feature) => {
            const eventType = feature.properties.event_type;
            const eventPriority = feature.properties.event_priority;
            if (eventFilter[eventType] && priorityFilter[eventPriority]) {
                const markerIcon = L.icon({
                    iconUrl: getIcon(eventType),
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                });

                const marker = L.geoJSON(feature, {
                    pointToLayer: (geoJsonPoint, latlng) => {
                        const marker = L.marker(latlng, { icon: markerIcon });
                        marker.bindPopup(`
                            <div class="custom_popup">
                                <h3>${feature.properties.event_type}</h3>
                                ${
                                    feature.properties.description
                                        ? `<p>Description: ${feature.properties.description}</p><br/>`
                                        : ""
                                }
                                ${
                                    feature.properties.advice
                                        ? `<p>Advice: ${feature.properties.advice}</p><br/>`
                                        : ""
                                }
                                ${
                                    feature.properties.alert_message
                                        ? `<p>Alert: ${feature.properties.alert_message}</p><br/>`
                                        : ""
                                }
                                ${
                                    feature.properties.road_summary
                                        ? `<p>Road: ${feature.properties.road_summary.road_name}</p><br/>`
                                        : ""
                                }
                            </div>
                        `);
                        return marker;
                    },
                    onEachFeature: (feature, layer) => {
                        if (layer instanceof L.Polyline) {
                            layer.bindPopup(`
                                <div class="custom_popup">
                                    <h3>${feature.properties.event_type}</h3>
                                    ${
                                        feature.properties.description
                                            ? `<p>Description: ${feature.properties.description}</p><br/>`
                                            : ""
                                    }
                                    ${
                                        feature.properties.advice
                                            ? `<p>Advice: ${feature.properties.advice}</p><br/>`
                                            : ""
                                    }
                                    ${
                                        feature.properties.alert_message
                                            ? `<p>Alert: ${feature.properties.alert_message}</p><br/>`
                                            : ""
                                    }
                                    ${
                                        feature.properties.road_summary
                                            ? `<p>Road: ${feature.properties.road_summary.road_name}</p><br/>`
                                            : ""
                                    }
                                </div>
                            `);
                        }
                    },
                }).addTo(mapRef.current);
                markersRef.current.push(marker);
            }
        });

        return () => {
            markersRef.current.forEach((marker) => {
                mapRef.current.removeLayer(marker);
            });
        };
    }, [data, eventFilter, priorityFilter]);

    const saveToLocalStorage = (key, value) => {
        const dataWithTimestamp = {
            value,
            timestamp: new Date().getTime(),
        };
        localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
    };

    const getFromLocalStorage = (key) => {
        const dataWithTimestamp = JSON.parse(localStorage.getItem(key));
        if (!dataWithTimestamp) return null;

        const currentTime = new Date().getTime();
        const dataAge = currentTime - dataWithTimestamp.timestamp;

        const sixHours = 6 * 60 * 60 * 1000;

        if (dataAge > sixHours) {
            localStorage.removeItem(key);
            return null;
        }

        return dataWithTimestamp.value;
    };

    return (
        <div className="relative md:px-[1.5rem] md:py-[8rem]  mx-auto max-w-7xl flex flex-row justify-between  ">
            <div className="  ">
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
                        {/* Filter Section */}
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#e0c981",
                                marginBottom: "1rem",
                                marginLeft: "2rem",
                                fontWeight: "bold",
                            }}
                        >
                            Weather
                        </Typography>
                        <div className="ml-12 flex flex-row items-center space-x-4 select-none">
                            <Checkbox
                                id="weather"
                                onChange={(e) =>
                                    setShowWeather((prev) => !prev)
                                }
                                checked={showWeather}
                                sx={{
                                    color: "#e2b540",
                                    "&.Mui-checked": {
                                        color: "#ebcb7a",
                                    },
                                }}
                                defaultChecked
                            />
                            <label
                                className="text-white cursor-pointer"
                                htmlFor="weather"
                            >
                                Show Weather
                            </label>
                        </div>

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
                            Priority
                        </Typography>
                        <div className="ml-12 flex flex-row items-center space-x-3 select-none">
                            <Checkbox
                                id="high"
                                onChange={(e) =>
                                    setPriorityFilter((prev) => ({
                                        ...prev,
                                        High: e.target.checked,
                                    }))
                                }
                                checked={priorityFilter.High}
                                sx={{
                                    color: "#e2b540",
                                    "&.Mui-checked": {
                                        color: "#ebcb7a",
                                    },
                                }}
                                defaultChecked
                            />
                            <label
                                className="text-white cursor-pointer"
                                htmlFor="high"
                            >
                                High
                            </label>

                            <Checkbox
                                id="medium"
                                onChange={(e) =>
                                    setPriorityFilter((prev) => ({
                                        ...prev,
                                        Medium: e.target.checked,
                                    }))
                                }
                                checked={priorityFilter.Medium}
                                sx={{
                                    color: "#e2b540",
                                    "&.Mui-checked": {
                                        color: "#ebcb7a",
                                    },
                                }}
                                defaultChecked
                            />
                            <label
                                className="text-white cursor-pointer"
                                htmlFor="medium"
                            >
                                Medium
                            </label>

                            <Checkbox
                                id="low"
                                onChange={(e) =>
                                    setPriorityFilter((prev) => ({
                                        ...prev,
                                        Low: e.target.checked,
                                    }))
                                }
                                checked={priorityFilter.Low}
                                sx={{
                                    color: "#e2b540",
                                    "&.Mui-checked": {
                                        color: "#ebcb7a",
                                    },
                                }}
                                defaultChecked
                            />
                            <label
                                className="text-white cursor-pointer"
                                htmlFor="low"
                            >
                                Low
                            </label>
                        </div>

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
                                className="ml-12 mr-12 bg-[#5e6367] flex flex-row rounded-lg space-x-5 items-center cursor-pointer pt-3 pb-3"
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
                                className="ml-12 mr-12 bg-[#5e6367] flex flex-row rounded-lg space-x-5 items-center cursor-pointer pt-3 pb-3"
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
                                className="ml-12 mr-12 bg-[#5e6367] flex flex-row rounded-lg space-x-5 items-center cursor-pointer pt-3 pb-3"
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
                                className="ml-12 mr-12 bg-[#5e6367] flex flex-row rounded-lg space-x-5 items-center cursor-pointer pt-3 pb-3"
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
                                className="ml-12 mr-12 bg-[#5e6367] flex flex-row rounded-lg space-x-5 items-center cursor-pointer pt-3 pb-3"
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
                                    Long-term flooding
                                </Typography>
                            </div>
                        </div>
                    </AccordionDetails>
                </Accordion>

                {/* The filter for large screens */}
                <div className="  hidden md:block  mx-auto    pb-5 pt-2    rounded-3xl  bg-transparent      z-10   ">
                    <h1 className="text-goldl mb-9 text-4xl font-semibold ">
                        Weather & Flood Map
                    </h1>

                    <h3 className=" text-white mb-4 text-start  mt-2 font-semibold">
                        Weather
                    </h3>

                    <div className="  flex flex-row items-center  select-none">
                        <Checkbox
                            id="weather"
                            onChange={(e) => setShowWeather((prev) => !prev)}
                            checked={showWeather}
                            sx={{
                                color: "#e2b540",
                                "&.Mui-checked": {
                                    color: "#ebcb7a",
                                },
                            }}
                            defaultChecked
                        />

                        <label
                            className="text-white  cursor-pointer "
                            htmlFor="weather"
                        >
                            Show Weather
                        </label>
                    </div>

                    <h3 className=" text-white mb-4 text-start  mt-2 font-semibold">
                        Priority
                    </h3>

                    <div className="  flex flex-row items-center  space-x-3 select-none">
                        {/* Checkbox for the High event priority */}
                        <Checkbox
                            id="high"
                            onChange={(e) =>
                                setPriorityFilter((prev) => ({
                                    ...prev,
                                    High: e.target.checked,
                                }))
                            }
                            checked={priorityFilter.High}
                            sx={{
                                color: "#e2b540",
                                "&.Mui-checked": {
                                    color: "#ebcb7a",
                                },
                            }}
                            defaultChecked
                        />
                        <label
                            className="text-white  cursor-pointer "
                            htmlFor="high"
                        >
                            High
                        </label>

                        {/* Checkbox for the medium event priority */}
                        <Checkbox
                            id="medium"
                            onChange={(e) =>
                                setPriorityFilter((prev) => ({
                                    ...prev,
                                    Medium: e.target.checked,
                                }))
                            }
                            checked={priorityFilter.Medium}
                            sx={{
                                color: "#e2b540",
                                "&.Mui-checked": {
                                    color: "#ebcb7a",
                                },
                            }}
                            defaultChecked
                        />

                        <label
                            className="text-white cursor-pointer "
                            htmlFor="medium"
                        >
                            Medium
                        </label>

                        {/* Checkbox for the Low event priority */}
                        <Checkbox
                            id="low"
                            onChange={(e) =>
                                setPriorityFilter((prev) => ({
                                    ...prev,
                                    Low: e.target.checked,
                                }))
                            }
                            checked={priorityFilter.Low}
                            sx={{
                                color: "#e2b540",
                                "&.Mui-checked": {
                                    color: "#ebcb7a",
                                },
                            }}
                            defaultChecked
                        />
                        <label
                            className="text-white cursor-pointer"
                            htmlFor="low"
                        >
                            Low
                        </label>
                    </div>
                    <h3 className=" text-white text-start  mb-4 mt-2 font-semibold">
                        Event Type
                    </h3>

                    {/* Roadworks Road Choice */}

                    <div className=" flex gap-3 flex-col select-none">
                        <div
                            className="  mr-12 bg-[#5e6367] flex flex-row rounded-lg   space-x-5 items-center cursor-pointer  pt-3 pb-3 "
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
                            <p className="text-white  ">Roadworks</p>
                        </div>

                        {/* Special Event Road Choice */}
                        <div
                            onClick={(e) =>
                                setEventFilter((prev) => ({
                                    ...prev,
                                    "Special event": !prev["Special event"],
                                }))
                            }
                            className="  mr-12  bg-[#5e6367] flex flex-row rounded-lg     cursor-pointer space-x-5 items-center  pt-3 pb-3"
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
                            <p className="text-white ">Special Events</p>
                        </div>

                        {/* Crash Road Choice */}

                        <div
                            className="  mr-12 bg-[#5e6367] flex flex-row rounded-lg   space-x-5 items-center  pt-3 pb-3 cursor-pointer"
                            onClick={(e) =>
                                setEventFilter((prev) => ({
                                    ...prev,
                                    Crash: !prev.Crash,
                                }))
                            }
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
                            <p className="text-white ">Crash</p>
                        </div>

                        {/* Hazard Road choice */}

                        <div
                            className="  mr-12 bg-[#5e6367] flex flex-row rounded-lg   space-x-5 items-center  cursor-pointer   pt-3 pb-3"
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

                        {/* Flooding Road choice */}

                        <div
                            className="  mr-12 bg-[#5e6367] flex flex-row rounded-lg pt-3 pb-3  space-x-5 items-center  cursor-pointer"
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
                                    color: "#e2b540",
                                    "&.Mui-checked": {
                                        color: "#ebcb7a",
                                    },
                                }}
                                defaultChecked
                            />
                            <img src={Flooding} width={28} height={21} alt="" />
                            <p className="text-white ">Long-tem flooding</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute md:mt-[18rem]  p-2 -right-[1rem] -top-[3rem]  md:w-[65%] h-[70vh] mt-[8rem] bg-gradient-to-l from-goldt2   lg:block -z-10 rounded-3xl ">
                <div className="h-full  bg-dark rounded-3xl"></div>
            </div>

            <div
                id="map"
                className=" w-[100%] md:mt-[9rem] shadow-md rounded-3xl  md:w-[65%] z-0 md:h-[70vh]  h-[90vh] "
            ></div>
        </div>
    );
};

export default Map;

// This obj contain icon for each weather status
const weatherIcons = {
    0: {
        day: "http://openweathermap.org/img/wn/01d@2x.png",
        night: "http://openweathermap.org/img/wn/01n@2x.png",
    },
    1: {
        day: "http://openweathermap.org/img/wn/01d@2x.png",
        night: "http://openweathermap.org/img/wn/01n@2x.png",
    },
    2: {
        day: "http://openweathermap.org/img/wn/02d@2x.png",
        night: "http://openweathermap.org/img/wn/02n@2x.png",
    },
    3: {
        day: "http://openweathermap.org/img/wn/03d@2x.png",
        night: "http://openweathermap.org/img/wn/03n@2x.png",
    },
    45: {
        day: "http://openweathermap.org/img/wn/50d@2x.png",
        night: "http://openweathermap.org/img/wn/50n@2x.png",
    },
    48: {
        day: "http://openweathermap.org/img/wn/50d@2x.png",
        night: "http://openweathermap.org/img/wn/50n@2x.png",
    },
    51: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    53: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    55: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    56: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    57: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    61: {
        day: "http://openweathermap.org/img/wn/10d@2x.png",
        night: "http://openweathermap.org/img/wn/10n@2x.png",
    },
    63: {
        day: "http://openweathermap.org/img/wn/10d@2x.png",
        night: "http://openweathermap.org/img/wn/10n@2x.png",
    },
    65: {
        day: "http://openweathermap.org/img/wn/10d@2x.png",
        night: "http://openweathermap.org/img/wn/10n@2x.png",
    },
    66: {
        day: "http://openweathermap.org/img/wn/10d@2x.png",
        night: "http://openweathermap.org/img/wn/10n@2x.png",
    },
    67: {
        day: "http://openweathermap.org/img/wn/10d@2x.png",
        night: "http://openweathermap.org/img/wn/10n@2x.png",
    },
    71: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    73: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    75: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    77: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    80: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    81: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    82: {
        day: "http://openweathermap.org/img/wn/09d@2x.png",
        night: "http://openweathermap.org/img/wn/09n@2x.png",
    },
    85: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    86: {
        day: "http://openweathermap.org/img/wn/13d@2x.png",
        night: "http://openweathermap.org/img/wn/13n@2x.png",
    },
    95: {
        day: "http://openweathermap.org/img/wn/11d@2x.png",
        night: "http://openweathermap.org/img/wn/11n@2x.png",
    },
    96: {
        day: "http://openweathermap.org/img/wn/11d@2x.png",
        night: "http://openweathermap.org/img/wn/11n@2x.png",
    },
    99: {
        day: "http://openweathermap.org/img/wn/11d@2x.png",
        night: "http://openweathermap.org/img/wn/11n@2x.png",
    },
};

function getWeatherIconUrl(weatherCode, isDay) {
    const timeOfDay = isDay ? "day" : "night";
    return weatherIcons[weatherCode]
        ? weatherIcons[weatherCode][timeOfDay]
        : null;
}

function getData() {
    return {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [149.976679, -37.50506],
                            [148.194946, -36.796253],
                            [148.211171, -36.650519],
                            [148.217563, -36.598239],
                            [148.13341, -36.566921],
                            [148.124663, -36.464713],
                            [148.037583, -36.390225],
                            [148.037726, -36.140797],
                            [148.002388, -36.140057],
                            [147.999692, -36.046204],
                            [147.912342, -35.995198],
                            [147.708415, -35.928545],
                            [147.591893, -35.969859],
                            [147.549115, -35.96455],
                            [147.584027, -35.984648],
                            [147.551873, -36.004095],
                            [147.494112, -35.943549],
                            [147.404631, -35.943495],
                            [147.319949, -36.060987],
                            [147.127391, -36.018047],
                            [147.123357, -35.994498],
                            [147.052963, -36.107881],
                            [146.956824, -36.078061],
                            [146.943705, -36.115989],
                            [146.731645, -36.023725],
                            [146.685812, -36.040576],
                            [146.61252, -35.972858],
                            [146.549581, -35.992457],
                            [146.502585, -35.958235],
                            [146.421673, -35.965831],
                            [146.368684, -36.050862],
                            [146.299009, -36.047859],
                            [146.185976, -36.042071],
                            [145.97207, -36.015747],
                            [145.953701, -35.9615],
                            [145.902693, -35.952496],
                            [145.811662, -35.991769],
                            [145.673992, -35.925924],
                            [145.535398, -35.801983],
                            [145.3554, -35.867067],
                            [144.992263, -35.852338],
                            [144.923606, -35.988768],
                            [144.981909, -36.072316],
                            [144.86346, -36.059112],
                            [144.80787, -36.123628],
                            [144.726379, -36.117781],
                            [144.725675, -36.089438],
                            [144.683907, -36.095138],
                            [144.689004, -36.061417],
                            [144.61767, -36.077192],
                            [144.615473, -36.031593],
                            [144.51614, -35.995438],
                            [144.521099, -35.970266],
                            [144.407927, -35.904013],
                            [144.349111, -35.767142],
                            [144.105015, -35.59078],
                            [143.989865, -35.554663],
                            [143.970101, -35.500078],
                            [143.751004, -35.387835],
                            [143.620416, -35.387682],
                            [143.562074, -35.337244],
                            [143.570828, -35.206905],
                            [143.394677, -35.192377],
                            [143.322081, -35.036727],
                            [143.347876, -34.791635],
                            [143.276736, -34.79226],
                            [143.25213, -34.772803],
                            [143.274016, -34.752685],
                            [143.224384, -34.758733],
                            [143.213847, -34.738496],
                            [143.112525, -34.680819],
                            [142.923844, -34.647856],
                            [142.868177, -34.627306],
                            [142.787687, -34.590178],
                            [142.791428, -34.546389],
                            [142.748291, -34.576759],
                            [142.618316, -34.728751],
                            [142.51417, -34.690931],
                            [142.467968, -34.564295],
                            [142.451622, -34.584265],
                            [142.367695, -34.530446],
                            [142.394681, -34.493484],
                            [142.359576, -34.498779],
                            [142.353334, -34.469582],
                            [142.350969, -34.396629],
                            [142.235894, -34.306973],
                            [142.08277, -34.173545],
                            [142.075638, -34.131418],
                            [142.027564, -34.122981],
                            [142.012927, -34.105246],
                            [141.67745, -34.101225],
                            [141.60458, -34.149115],
                            [141.603285, -34.191228],
                            [141.510071, -34.216479],
                            [141.324937, -34.138782],
                            [141.247217, -34.073209],
                            [141.241808, -34.061315],
                            [141.089218, -34.076696],
                            [141.002957, -34.022537],
                            [140.999278, -28.999103],
                            [148.958308, -28.999064],
                            [149.032686, -28.955958],
                            [149.080762, -28.841801],
                            [149.387389, -28.695803],
                            [149.502977, -28.574351],
                            [149.587938, -28.572815],
                            [149.703104, -28.633712],
                            [150.15228, -28.55021],
                            [150.212287, -28.574181],
                            [150.289648, -28.537157],
                            [150.445551, -28.665141],
                            [150.632541, -28.676572],
                            [150.752343, -28.633464],
                            [151.01065, -28.740805],
                            [151.045321, -28.844482],
                            [151.102759, -28.836369],
                            [151.274808, -28.938926],
                            [151.279649, -29.100769],
                            [151.33931, -29.177266],
                            [151.393784, -29.177893],
                            [151.502292, -29.070805],
                            [151.49149, -29.056244],
                            [151.545566, -28.952998],
                            [151.706536, -28.871784],
                            [151.73386, -28.871578],
                            [151.777834, -28.959885],
                            [151.832232, -28.959829],
                            [151.849363, -28.90785],
                            [151.900358, -28.914966],
                            [152.009703, -28.907663],
                            [152.038126, -28.864696],
                            [152.015064, -28.850626],
                            [152.076049, -28.708175],
                            [152.010168, -28.664951],
                            [151.955645, -28.518904],
                            [151.982893, -28.503395],
                            [152.016864, -28.525281],
                            [152.217189, -28.449236],
                            [152.309659, -28.363168],
                            [152.38616, -28.368554],
                            [152.463586, -28.259373],
                            [152.525981, -28.30625],
                            [152.579242, -28.338976],
                            [152.614517, -28.269555],
                            [152.624513, -28.298204],
                            [152.751062, -28.363914],
                            [152.880013, -28.309607],
                            [153.108829, -28.357543],
                            [153.476931, -28.15702],
                            [153.586296, -28.258206],
                            [153.608834, -28.843251],
                            [153.344322, -29.296579],
                            [153.333974, -29.674551],
                            [152.988454, -30.731967],
                            [153.088672, -30.911293],
                            [152.937829, -31.47576],
                            [152.508886, -32.172395],
                            [152.539907, -32.443464],
                            [152.172615, -32.761656],
                            [151.801417, -32.88492],
                            [151.317714, -33.74198],
                            [151.249211, -34.001814],
                            [150.928023, -34.316624],
                            [150.784718, -34.986574],
                            [150.67113, -35.037153],
                            [150.150243, -35.891139],
                            [150.148569, -36.266969],
                            [149.919697, -36.895441],
                            [149.976679, -37.50506],
                        ],
                        [
                            [149.399284, -35.319175],
                            [149.272048, -35.273644],
                            [149.214063, -35.219507],
                            [149.204883, -35.229549],
                            [149.120902, -35.124517],
                            [148.807854, -35.309647],
                            [148.762675, -35.495505],
                            [148.791182, -35.703449],
                            [148.855652, -35.760874],
                            [148.886633, -35.719136],
                            [148.909367, -35.853065],
                            [149.048811, -35.92041],
                            [149.093517, -35.824221],
                            [149.084514, -35.580594],
                            [149.14251, -35.59257],
                            [149.146586, -35.414836],
                            [149.207546, -35.345305],
                            [149.352134, -35.351317],
                            [149.399284, -35.319175],
                        ],
                    ],
                },
                properties: { STATE_CODE: "1", STATE_NAME: "New South Wales" },
                id: 0,
            },
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [140.965735, -38.055989],
                            [140.963616, -33.980648],
                            [141.00187, -34.039103],
                            [141.089218, -34.076696],
                            [141.241808, -34.061315],
                            [141.247217, -34.073209],
                            [141.324937, -34.138782],
                            [141.510071, -34.216479],
                            [141.603285, -34.191228],
                            [141.60458, -34.149115],
                            [141.67745, -34.101225],
                            [142.012927, -34.105246],
                            [142.027564, -34.122981],
                            [142.075638, -34.131418],
                            [142.08277, -34.173545],
                            [142.235894, -34.306973],
                            [142.350969, -34.396629],
                            [142.353334, -34.469582],
                            [142.359576, -34.498779],
                            [142.394681, -34.493484],
                            [142.367695, -34.530446],
                            [142.451622, -34.584265],
                            [142.467968, -34.564295],
                            [142.51417, -34.690931],
                            [142.618316, -34.728751],
                            [142.748291, -34.576759],
                            [142.791428, -34.546389],
                            [142.787687, -34.590178],
                            [142.868177, -34.627306],
                            [142.923844, -34.647856],
                            [143.112525, -34.680819],
                            [143.213847, -34.738496],
                            [143.224384, -34.758733],
                            [143.274016, -34.752685],
                            [143.25213, -34.772803],
                            [143.276736, -34.79226],
                            [143.347876, -34.791635],
                            [143.322081, -35.036727],
                            [143.394677, -35.192377],
                            [143.570828, -35.206905],
                            [143.562074, -35.337244],
                            [143.620416, -35.387682],
                            [143.751004, -35.387835],
                            [143.970101, -35.500078],
                            [143.989865, -35.554663],
                            [144.105015, -35.59078],
                            [144.349111, -35.767142],
                            [144.407927, -35.904013],
                            [144.521099, -35.970266],
                            [144.51614, -35.995438],
                            [144.615473, -36.031593],
                            [144.61767, -36.077192],
                            [144.689004, -36.061417],
                            [144.683907, -36.095138],
                            [144.725675, -36.089438],
                            [144.726379, -36.117781],
                            [144.80787, -36.123628],
                            [144.86346, -36.059112],
                            [144.981909, -36.072316],
                            [144.923606, -35.988768],
                            [144.992263, -35.852338],
                            [145.3554, -35.867067],
                            [145.535398, -35.801983],
                            [145.673992, -35.925924],
                            [145.811662, -35.991769],
                            [145.902693, -35.952496],
                            [145.953701, -35.9615],
                            [145.97207, -36.015747],
                            [146.185976, -36.042071],
                            [146.299009, -36.047859],
                            [146.368684, -36.050862],
                            [146.421673, -35.965831],
                            [146.502585, -35.958235],
                            [146.549581, -35.992457],
                            [146.61252, -35.972858],
                            [146.685812, -36.040576],
                            [146.731645, -36.023725],
                            [146.943705, -36.115989],
                            [146.956824, -36.078061],
                            [147.052963, -36.107881],
                            [147.123357, -35.994498],
                            [147.127391, -36.018047],
                            [147.319949, -36.060987],
                            [147.404631, -35.943495],
                            [147.494112, -35.943549],
                            [147.551873, -36.004095],
                            [147.584027, -35.984648],
                            [147.549115, -35.96455],
                            [147.591893, -35.969859],
                            [147.708415, -35.928545],
                            [147.912342, -35.995198],
                            [147.999692, -36.046204],
                            [148.002388, -36.140057],
                            [148.037726, -36.140797],
                            [148.037583, -36.390225],
                            [148.124663, -36.464713],
                            [148.13341, -36.566921],
                            [148.217563, -36.598239],
                            [148.211171, -36.650519],
                            [148.194946, -36.796253],
                            [149.976679, -37.50506],
                            [149.484958, -37.775441],
                            [148.289615, -37.810988],
                            [147.788216, -37.955322],
                            [147.476303, -38.15175],
                            [146.883139, -38.634634],
                            [146.410331, -38.711911],
                            [146.42651, -39.129986],
                            [146.083966, -38.815933],
                            [145.606696, -38.678782],
                            [145.433813, -38.434868],
                            [145.488988, -38.233414],
                            [145.118468, -38.145695],
                            [144.970308, -37.860787],
                            [144.397943, -38.073816],
                            [144.428618, -38.281629],
                            [144.036497, -38.475775],
                            [143.554064, -38.855695],
                            [143.232964, -38.766436],
                            [142.372518, -38.349483],
                            [142.1458, -38.391487],
                            [141.88151, -38.265811],
                            [141.542787, -38.432968],
                            [140.965735, -38.055989],
                        ],
                    ],
                },
                properties: { STATE_CODE: "2", STATE_NAME: "Victoria" },
                id: 1,
            },
            {
                type: "Feature",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            [
                                [153.476931, -28.15702],
                                [153.108829, -28.357543],
                                [152.880013, -28.309607],
                                [152.751062, -28.363914],
                                [152.624513, -28.298204],
                                [152.614517, -28.269555],
                                [152.579242, -28.338976],
                                [152.525981, -28.30625],
                                [152.463586, -28.259373],
                                [152.38616, -28.368554],
                                [152.309659, -28.363168],
                                [152.217189, -28.449236],
                                [152.016864, -28.525281],
                                [151.982893, -28.503395],
                                [151.955645, -28.518904],
                                [152.010168, -28.664951],
                                [152.076049, -28.708175],
                                [152.015064, -28.850626],
                                [152.038126, -28.864696],
                                [152.009703, -28.907663],
                                [151.900358, -28.914966],
                                [151.849363, -28.90785],
                                [151.832232, -28.959829],
                                [151.777834, -28.959885],
                                [151.73386, -28.871578],
                                [151.706536, -28.871784],
                                [151.545566, -28.952998],
                                [151.49149, -29.056244],
                                [151.502292, -29.070805],
                                [151.393784, -29.177893],
                                [151.33931, -29.177266],
                                [151.279649, -29.100769],
                                [151.274808, -28.938926],
                                [151.102759, -28.836369],
                                [151.045321, -28.844482],
                                [151.01065, -28.740805],
                                [150.752343, -28.633464],
                                [150.632541, -28.676572],
                                [150.445551, -28.665141],
                                [150.289648, -28.537157],
                                [150.212287, -28.574181],
                                [150.15228, -28.55021],
                                [149.703104, -28.633712],
                                [149.587938, -28.572815],
                                [149.502977, -28.574351],
                                [149.387389, -28.695803],
                                [149.080762, -28.841801],
                                [149.032686, -28.955958],
                                [148.958308, -28.999064],
                                [140.999278, -28.999103],
                                [140.999394, -25.996376],
                                [137.999054, -25.996867],
                                [138.00118, -16.544509],
                                [138.323615, -16.750458],
                                [138.628959, -16.767936],
                                [139.038676, -16.912443],
                                [139.23767, -17.319781],
                                [140.004377, -17.714575],
                                [140.384571, -17.677883],
                                [140.887415, -17.382311],
                                [140.958021, -16.998141],
                                [141.204446, -16.69199],
                                [141.43277, -16.074761],
                                [141.373379, -15.916912],
                                [141.663509, -15.003962],
                                [141.52561, -14.487086],
                                [141.599046, -14.101668],
                                [141.468182, -13.923139],
                                [141.523282, -13.572129],
                                [141.69539, -13.270078],
                                [141.588712, -13.017231],
                                [141.827326, -12.64855],
                                [141.591918, -12.558962],
                                [141.81038, -12.048632],
                                [141.942175, -11.945512],
                                [142.119961, -11.368544],
                                [142.132786, -10.948445],
                                [142.530935, -10.687543],
                                [142.786058, -11.074181],
                                [142.847488, -11.823918],
                                [143.185584, -11.990818],
                                [143.078573, -12.337485],
                                [143.418829, -12.615954],
                                [143.598187, -13.42231],
                                [143.53174, -13.754558],
                                [143.745771, -14.333114],
                                [143.88442, -14.482093],
                                [144.576479, -14.247362],
                                [144.618812, -14.47539],
                                [145.282239, -14.955165],
                                [145.418168, -16.338301],
                                [145.581937, -16.687196],
                                [145.889406, -17.057605],
                                [146.140586, -17.639712],
                                [146.016188, -18.245019],
                                [146.337881, -18.526627],
                                [146.273046, -18.860081],
                                [146.454158, -19.073694],
                                [147.1261, -19.422471],
                                [147.455161, -19.395188],
                                [147.738402, -19.847056],
                                [148.255476, -19.986003],
                                [148.840711, -20.351944],
                                [148.662046, -20.585768],
                                [148.847055, -20.855967],
                                [149.158072, -21.000314],
                                [149.449683, -21.578201],
                                [149.465416, -21.92568],
                                [149.658283, -22.354889],
                                [150.177423, -22.360496],
                                [150.835158, -22.684207],
                                [150.749647, -23.128814],
                                [150.878143, -23.552292],
                                [151.17292, -23.815879],
                                [151.573657, -24.035722],
                                [151.764638, -24.015229],
                                [152.148304, -24.626559],
                                [152.468174, -24.816086],
                                [152.663543, -25.244018],
                                [152.914399, -25.293372],
                                [152.878424, -25.683629],
                                [153.119893, -25.933571],
                                [153.076557, -26.224779],
                                [153.151353, -26.802186],
                                [153.069598, -27.313956],
                                [153.383078, -27.708796],
                                [153.476931, -28.15702],
                            ],
                        ],
                        [
                            [
                                [152.95018, -25.573919],
                                [152.992301, -25.220705],
                                [153.360352, -25.006351],
                                [153.015095, -25.769062],
                                [152.95018, -25.573919],
                            ],
                        ],
                    ],
                },
                properties: { STATE_CODE: "3", STATE_NAME: "Queensland" },
                id: 2,
            },
            {
                type: "Feature",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            [
                                [129.00134, -31.687068],
                                [129.001854, -25.998613],
                                [140.999394, -25.996376],
                                [141.002937, -33.99851],
                                [141.002956, -34.021892],
                                [140.963616, -33.980648],
                                [140.973872, -37.462093],
                                [140.965735, -38.055989],
                                [140.662442, -38.061474],
                                [140.39645, -37.919006],
                                [140.12084, -37.530865],
                                [139.761627, -37.199707],
                                [139.669972, -36.957431],
                                [139.842891, -36.839575],
                                [139.782926, -36.458816],
                                [139.52302, -36.043505],
                                [139.211957, -35.754559],
                                [138.883656, -35.55729],
                                [138.156886, -35.658167],
                                [138.441044, -35.349994],
                                [138.541428, -34.752951],
                                [138.265632, -34.476802],
                                [138.102306, -34.138883],
                                [137.637498, -35.168201],
                                [137.464103, -35.099218],
                                [137.173992, -35.237359],
                                [136.941123, -35.129111],
                                [137.012553, -34.92048],
                                [137.448758, -34.910318],
                                [137.506757, -34.137625],
                                [137.600358, -33.876794],
                                [137.939426, -33.547918],
                                [137.853601, -33.196834],
                                [137.661043, -32.950959],
                                [137.442264, -33.152177],
                                [137.213306, -33.661082],
                                [136.668362, -33.878689],
                                [136.363136, -34.069349],
                                [136.121769, -34.467421],
                                [135.93231, -34.528521],
                                [135.79209, -34.860956],
                                [135.624044, -34.906359],
                                [135.389235, -34.595065],
                                [135.346224, -34.267559],
                                [135.182152, -33.877771],
                                [134.830247, -33.626318],
                                [134.802047, -33.328782],
                                [134.189083, -32.942369],
                                [134.290382, -32.692865],
                                [134.163101, -32.469053],
                                [133.951086, -32.388513],
                                [133.666883, -32.103832],
                                [133.275245, -32.194901],
                                [132.746588, -31.949342],
                                [132.200614, -32.02728],
                                [131.758577, -31.72026],
                                [131.148637, -31.463654],
                                [130.806132, -31.60563],
                                [130.152187, -31.576538],
                                [129.00134, -31.687068],
                            ],
                        ],
                        [
                            [
                                [138.134901, -35.841399],
                                [137.611978, -35.913111],
                                [137.460723, -36.074971],
                                [136.727088, -36.045071],
                                [136.587436, -35.748857],
                                [137.313489, -35.57924],
                                [137.634199, -35.565733],
                                [138.134901, -35.841399],
                            ],
                        ],
                    ],
                },
                properties: { STATE_CODE: "4", STATE_NAME: "South Australia" },
                id: 3,
            },
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [129.001242, -14.879473],
                            [129.00134, -31.687068],
                            [128.314269, -31.979367],
                            [127.32596, -32.256526],
                            [126.672789, -32.308371],
                            [126.203139, -32.232277],
                            [125.95101, -32.290542],
                            [125.53206, -32.549232],
                            [125.026186, -32.728859],
                            [124.814039, -32.872863],
                            [124.305384, -32.98091],
                            [124.154307, -33.096063],
                            [123.97602, -33.558606],
                            [123.534286, -33.940132],
                            [123.083117, -33.871534],
                            [122.364201, -33.913517],
                            [122.136743, -34.006599],
                            [122.001002, -33.829299],
                            [121.789874, -33.909049],
                            [121.361874, -33.815443],
                            [120.639, -33.891729],
                            [120.43657, -33.971882],
                            [120.042168, -33.923368],
                            [119.597462, -34.134587],
                            [119.502718, -34.411473],
                            [118.755351, -34.545573],
                            [118.331264, -34.898061],
                            [117.629383, -35.127747],
                            [117.362834, -35.01957],
                            [116.630374, -35.060835],
                            [116.002145, -34.842218],
                            [115.669869, -34.480925],
                            [115.262563, -34.306793],
                            [114.991097, -34.098468],
                            [114.975079, -33.698053],
                            [115.42754, -33.608303],
                            [115.681022, -33.275255],
                            [115.608247, -32.666719],
                            [115.774567, -32.193807],
                            [115.729627, -31.765771],
                            [115.189756, -30.82495],
                            [114.954846, -30.048851],
                            [114.997569, -29.493548],
                            [114.872084, -29.116741],
                            [114.637438, -28.87771],
                            [114.596573, -28.611563],
                            [114.174711, -28.110972],
                            [114.104253, -27.503189],
                            [113.558225, -26.574004],
                            [113.807717, -26.610972],
                            [114.237651, -26.312765],
                            [114.205395, -25.85302],
                            [114.004183, -25.618519],
                            [113.623242, -24.746034],
                            [113.406958, -24.484176],
                            [113.470308, -23.898561],
                            [113.75326, -23.528236],
                            [113.826185, -22.956016],
                            [113.654082, -22.578773],
                            [114.023922, -21.851153],
                            [114.080266, -22.154135],
                            [114.33896, -22.492117],
                            [114.642507, -21.909328],
                            [114.903446, -21.705314],
                            [115.516477, -21.483476],
                            [115.918152, -21.078751],
                            [116.819273, -20.606307],
                            [117.302672, -20.726802],
                            [117.774281, -20.66354],
                            [118.160907, -20.357893],
                            [118.822624, -20.276008],
                            [119.099709, -19.959323],
                            [119.562789, -20.078977],
                            [120.195936, -19.913908],
                            [120.981888, -19.621038],
                            [121.412999, -19.237982],
                            [121.903643, -18.464057],
                            [122.370266, -18.116445],
                            [122.145169, -17.560353],
                            [122.253195, -17.11985],
                            [122.63741, -16.800705],
                            [122.778997, -16.584943],
                            [123.126613, -16.711067],
                            [123.394348, -17.280663],
                            [123.564479, -17.405802],
                            [123.647972, -16.999738],
                            [123.79612, -16.911838],
                            [123.460392, -16.524605],
                            [123.70311, -16.153894],
                            [124.394547, -16.33853],
                            [124.458426, -16.102519],
                            [124.375976, -15.680098],
                            [124.705033, -15.253395],
                            [124.907942, -15.245664],
                            [125.141429, -14.747673],
                            [125.335667, -14.555772],
                            [125.797984, -14.44532],
                            [126.041913, -14.53672],
                            [126.169718, -14.146188],
                            [126.555814, -14.151036],
                            [126.762732, -14.050093],
                            [126.760452, -13.808213],
                            [126.963289, -13.741672],
                            [127.14288, -13.982251],
                            [127.430068, -13.942949],
                            [127.850137, -14.484474],
                            [128.393426, -14.80445],
                            [129.001242, -14.879473],
                        ],
                    ],
                },
                properties: {
                    STATE_CODE: "5",
                    STATE_NAME: "Western Australia",
                },
                id: 4,
            },
            {
                type: "Feature",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            [
                                [144.754462, -41.061823],
                                [144.686043, -40.672218],
                                [145.118606, -40.828989],
                                [145.72934, -40.944952],
                                [146.154381, -41.154331],
                                [147.490728, -40.979349],
                                [147.974703, -40.737601],
                                [148.323833, -40.987847],
                                [148.25287, -41.190939],
                                [148.320296, -41.621392],
                                [148.284634, -42.038985],
                                [148.093656, -42.081067],
                                [147.791443, -42.89262],
                                [147.360963, -42.914127],
                                [146.844807, -43.633052],
                                [146.216007, -43.485565],
                                [146.046171, -43.552375],
                                [145.682228, -43.050468],
                                [145.262948, -42.621623],
                                [145.196877, -41.948587],
                                [144.920865, -41.667596],
                                [144.683526, -41.234829],
                                [144.754462, -41.061823],
                            ],
                        ],
                        [
                            [
                                [148.334277, -40.208333],
                                [148.04611, -40.249506],
                                [147.897245, -39.999015],
                                [147.960671, -39.730132],
                                [148.334277, -40.208333],
                            ],
                        ],
                        [
                            [
                                [148.011504, -43.221681],
                                [147.65074, -43.089445],
                                [147.802901, -42.893233],
                                [148.011504, -43.221681],
                            ],
                        ],
                        [
                            [
                                [144.138222, -39.933819],
                                [143.833303, -39.915546],
                                [143.94575, -39.580467],
                                [144.109657, -39.669979],
                                [144.138222, -39.933819],
                            ],
                        ],
                    ],
                },
                properties: { STATE_CODE: "6", STATE_NAME: "Tasmania" },
                id: 5,
            },
            {
                type: "Feature",
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [
                            [
                                [138.00118, -16.544509],
                                [137.999054, -25.996867],
                                [129.000584, -25.998613],
                                [129.001242, -14.879473],
                                [129.482478, -14.94106],
                                [129.672401, -14.763468],
                                [129.379285, -14.41941],
                                [129.409294, -14.23594],
                                [129.721306, -14.01343],
                                [129.827732, -13.51814],
                                [130.008369, -13.533339],
                                [130.284054, -13.305756],
                                [130.128194, -12.973699],
                                [130.520625, -12.703496],
                                [130.6193, -12.381373],
                                [130.841469, -12.555322],
                                [131.030606, -12.146439],
                                [131.472295, -12.283712],
                                [131.879259, -12.214551],
                                [132.069714, -12.30354],
                                [132.629281, -12.085415],
                                [132.553086, -11.554926],
                                [132.353457, -11.441274],
                                [132.122609, -11.526422],
                                [131.859751, -11.292782],
                                [132.338898, -11.140365],
                                [132.732875, -11.519077],
                                [132.917953, -11.331725],
                                [133.149872, -11.702237],
                                [133.912395, -11.906891],
                                [134.030774, -11.85497],
                                [134.492834, -12.071605],
                                [134.739702, -11.959872],
                                [135.056034, -12.263609],
                                [135.570011, -12.100746],
                                [135.720723, -12.281165],
                                [136.259704, -12.45644],
                                [136.414836, -11.958678],
                                [136.59931, -12.202296],
                                [136.782358, -12.159094],
                                [136.978918, -12.345442],
                                [136.617426, -12.689846],
                                [136.625398, -12.952945],
                                [136.388071, -13.227066],
                                [136.218042, -13.138268],
                                [135.918654, -13.26843],
                                [135.835287, -13.59083],
                                [135.914498, -13.747239],
                                [135.87877, -14.166827],
                                [135.382075, -14.725738],
                                [135.478818, -14.97606],
                                [136.239712, -15.416088],
                                [136.270412, -15.535779],
                                [136.729497, -15.932397],
                                [136.912706, -15.899684],
                                [137.372604, -16.133349],
                                [137.729671, -16.232252],
                                [138.00118, -16.544509],
                            ],
                        ],
                        [
                            [
                                [136.964126, -14.165254],
                                [136.899007, -14.297104],
                                [136.437348, -14.1963],
                                [136.531889, -13.785022],
                                [136.837318, -13.842907],
                                [136.707081, -14.168987],
                                [136.964126, -14.165254],
                            ],
                        ],
                        [
                            [
                                [130.402355, -11.363409],
                                [130.704562, -11.385318],
                                [131.288206, -11.193865],
                                [131.435824, -11.265902],
                                [131.469803, -11.608099],
                                [130.949287, -11.9401],
                                [130.492625, -11.654929],
                                [130.402355, -11.363409],
                            ],
                        ],
                        [
                            [
                                [130.212679, -11.712187],
                                [130.400138, -11.425023],
                                [130.503384, -11.830348],
                                [130.212679, -11.712187],
                            ],
                        ],
                    ],
                },
                properties: {
                    STATE_CODE: "7",
                    STATE_NAME: "Northern Territory",
                },
                id: 6,
            },
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [149.399284, -35.319175],
                            [149.352134, -35.351317],
                            [149.207546, -35.345305],
                            [149.146586, -35.414836],
                            [149.14251, -35.59257],
                            [149.084514, -35.580594],
                            [149.093517, -35.824221],
                            [149.048811, -35.92041],
                            [148.909367, -35.853065],
                            [148.886633, -35.719136],
                            [148.855652, -35.760874],
                            [148.791182, -35.703449],
                            [148.762675, -35.495505],
                            [148.807854, -35.309647],
                            [149.120902, -35.124517],
                            [149.204883, -35.229549],
                            [149.214063, -35.219507],
                            [149.272048, -35.273644],
                            [149.399284, -35.319175],
                        ],
                    ],
                },
                properties: {
                    STATE_CODE: "8",
                    STATE_NAME: "Australian Capital Territory",
                },
                id: 7,
            },
        ],
    };
}
