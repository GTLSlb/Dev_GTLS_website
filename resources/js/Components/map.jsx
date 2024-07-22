import React, { useEffect, useState, useRef } from "react";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import Roadworks from '../assets/pictures/Roadworks.png'
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

  console.log("show weather", showWeather);
  // This use state contain the filter values of event like crash roadworks etc ..
  const [eventFilter, setEventFilter] = useState({
    Roadworks: true,
    Crash: true,
    Flooding: true,
    Hazard: true,
    "Special event": true,
  });

  console.log("filter", eventFilter);
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
          console.log("url", url);
          return fetch(url).then((response) => response.json());
        });

        const data = await Promise.all(promises);
        console.log("data", data);
        saveToLocalStorage("weatherData", data);
      }
      setWeatherData(getFromLocalStorage("weatherData"));

      console.log("locall", getFromLocalStorage("weatherData"));

      console.log("local storage", getFromLocalStorage("weatherData"));
    };
    console.log("testing");
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
          const marker = L.marker([latitude, longitude], { icon: weatherIcon })
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

  console.log("weatherData", weatherData);
    useEffect(() => {
        if (mapRef.current === null) {
            mapRef.current = L.map("map", {
                center: [-25.2744, 133.7751], // Centered on Australia
                zoom: 4,
                zoomControl: false,
            });

            // Bounding box for Australia
            const australiaBounds = [
                [-44, 113], // Southwest coordinates
                [-10, 154], // Northeast coordinates
            ];

            mapRef.current.setMaxBounds(australiaBounds);

            mapRef.current.on("zoomend", () => {
                if (!mapRef.current.getBounds().contains(mapRef.current.getCenter())) {
                    mapRef.current.setView([-25.2744, 133.7751], 5);
                }
            });

            // Add zoom control
            L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);

            // Add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                noWrap: true,
                minZoom: 2,
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><a href="https://open-meteo.com/"> | Open-Meteo.com</a> contributors',
            }).addTo(mapRef.current);
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
                                ${feature.properties.description ? `<p>Description: ${feature.properties.description}</p><br/>` : ""}
                                ${feature.properties.advice ? `<p>Advice: ${feature.properties.advice}</p><br/>` : ""}
                                ${feature.properties.alert_message ? `<p>Alert: ${feature.properties.alert_message}</p><br/>` : ""}
                                ${feature.properties.road_summary ? `<p>Road: ${feature.properties.road_summary.road_name}</p><br/>` : ""}
                            </div>
                        `);
                        return marker;
                    },
                    onEachFeature: (feature, layer) => {
                        if (layer instanceof L.Polyline) {
                            layer.bindPopup(`
                                <div class="custom_popup">
                                    <h3>${feature.properties.event_type}</h3>
                                    ${feature.properties.description ? `<p>Description: ${feature.properties.description}</p><br/>` : ""}
                                    ${feature.properties.advice ? `<p>Advice: ${feature.properties.advice}</p><br/>` : ""}
                                    ${feature.properties.alert_message ? `<p>Alert: ${feature.properties.alert_message}</p><br/>` : ""}
                                    ${feature.properties.road_summary ? `<p>Road: ${feature.properties.road_summary.road_name}</p><br/>` : ""}
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

    console.log("age", dataAge);
    const sixHours = 6 * 60 * 60 * 1000;

    if (dataAge > sixHours) {
      localStorage.removeItem(key);
      return null;
    }

    return dataWithTimestamp.value;
  };

  return (
      <div className="relative md:px-[1.5rem] md:py-[8rem]  mx-auto max-w-7xl flex flex-row justify-between bg-no-repeat  bg-60%  bg-left-bottom  bg-au ">
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
                                  checked={eventFilter['Roadworks']}
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
                              <img src={Crash} width={28} height={21} alt="" />
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
                              <img src={Hazard} width={28} height={21} alt="" />
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

                          <img src={Roadworks} width={28} height={21} alt="" />
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
                          {/* <input
                              type="checkbox"
                              name=""
                              id=""
                              className="ml-5 custom-checkbox"
                              checked={eventFilter["Flooding"]}
                              onChange={(e) =>
                                  setEventFilter((prev) => ({
                                      ...prev,
                                      Flooding: e.target.checked,
                                  }))
                              }
                          /> */}

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
          <div className="absolute md:mt-[16rem]  p-2 -right-[3rem] -top-[3rem]  md:w-[60%] h-[60vh] mt-[8rem] bg-gradient-to-l from-goldt2   lg:block -z-10 rounded-3xl ">
              <div className="h-full  bg-dark rounded-3xl"></div>
          </div>

          <div
              id="map"
              className=" w-[100%] md:mt-[9rem] shadow-md rounded-3xl  md:w-[60%] z-0 md:h-[60vh]  h-[90vh] "
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
