import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Autosuggest from "react-autosuggest";

function Map() {
    const apiKey = "5b3ce3597851110001cf6248ea7dac8e31724a08ac282c8e09db2bde";
    const [startVenue, setStartVenue] = useState("");
    const [endVenue, setEndVenue] = useState("");
    const [distance, setDistance] = useState(0);
    const [weight, setWeight] = useState(0);
    const [estimation25, setEstimation25] = useState(0);
    const [estimation35, setEstimation35] = useState(0);
    const [startVenueCoordinates, setStartVenueCoordinates] = useState([]);
    const [endVenueCoordinates, setEndVenueCoordinates] = useState([]);
    const [startVenueSuggestions, setStartVenueSuggestions] = useState([]);
    const [endVenueSuggestions, setEndVenueSuggestions] = useState([]);

    const handleCalculation = () => {
        const a = (2.7 / 34) * 0.25;
        const b = (2.7 / 34) * 0.35;
        setEstimation25(distance * (Number(weight) + 27) * a);
        setEstimation35(distance * (Number(weight) + 27) * b);
    };

    const handleVenueSearch = async (
        query,
        setLocation,
        setCoordinates,
        setSuggestions,
        isStartVenue
    ) => {
        try {
            const response = await axios.get(
                `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(
                    query
                )}&boundary.country=AU`
            );

            if (response.data.features && response.data.features.length > 0) {
                const venue = response.data.features[0];
                setLocation(venue.properties.name);
                setCoordinates([
                    venue.geometry.coordinates[1],
                    venue.geometry.coordinates[0],
                ]);
            }

            const suggestions = response.data.features.map(
                (venue) => venue.properties.name
            );
            if (isStartVenue) {
                setStartVenueSuggestions(suggestions);
            } else {
                setEndVenueSuggestions(suggestions);
            }
        } catch (error) {
            console.error("Error searching for venues:", error);
        }
    };

    const onSuggestionsFetchRequested = async (
        { value },
        setSuggestions,
        isStartVenue
    ) => {
        try {
            const response = await axios.get(
                `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(
                    value
                )}&boundary.country=AU`
            );

            if (response.data.features) {
                const suggestions = response.data.features.map(
                    (venue) => venue.properties.name
                );
                if (isStartVenue) {
                    setStartVenueSuggestions(suggestions);
                } else {
                    setEndVenueSuggestions(suggestions);
                }
            }
        } catch (error) {
            console.error("Error getting suggestions:", error);
        }
    };

    const onSuggestionsClearRequested = (setSuggestions) => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestionValue }, isStartVenue) => {
        if (isStartVenue) {
            setStartVenue(suggestionValue);
        } else {
            setEndVenue(suggestionValue);
        }
    };

    const startInputProps = {
        placeholder: "Enter Starting Location",
        className:
            "w-full text-white peer appearance-none bg-transparent outline-none border-dark border-transparent focus:border-transparent focus:ring-0",
        value: startVenue,
        onChange: (event, { newValue }) => setStartVenue(newValue),
        onBlur: () =>
            handleVenueSearch(
                startVenue,
                setStartVenue,
                setStartVenueCoordinates,
                setStartVenueSuggestions,
                true
            ),
    };

    const endInputProps = {
        placeholder: "Enter Ending Location",
        className:
            "w-full text-white peer appearance-none bg-transparent outline-none border-dark border-transparent focus:border-transparent focus:ring-0",
        value: endVenue,
        onChange: (event, { newValue }) => setEndVenue(newValue),
        onBlur: () =>
            handleVenueSearch(
                endVenue,
                setEndVenue,
                setEndVenueCoordinates,
                setEndVenueSuggestions,
                false
            ),
    };

    const getDrivingDistance = async () => {
        const startLocation = `${startVenueCoordinates[1]},${startVenueCoordinates[0]}`;
        const endLocation = `${endVenueCoordinates[1]},${endVenueCoordinates[0]}`;

        const endpoint = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLocation}&end=${endLocation}`;

        try {
            const response = await axios.get(endpoint);
            const calculatedDistance =
                response.data.features[0].properties.segments[0].distance /
                1000;
            setDistance(calculatedDistance);
        } catch (error) {
            console.error("Error fetching driving distance:", error);
        }
    };
    useEffect(() => {
        if (
            startVenueCoordinates.length > 0 &&
            endVenueCoordinates.length > 0
        ) {
            getDrivingDistance();
        }
    }, [startVenueCoordinates, endVenueCoordinates]);

    return (
        <div>
            <h2 className="gradient-text py-5 text-2xl font-bold">
                CO<span className="text-sm">2 </span> Emissions Calculator
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="col-span-1 w-full border-b border-goldt">
                    <h2 className="text-goldt font-bold">Starting Location</h2>
                    <div className="h-10">
                        <div className="absolute ">
                            <Autosuggest
                                suggestions={startVenueSuggestions}
                                onSuggestionsFetchRequested={({ value }) =>
                                    onSuggestionsFetchRequested(
                                        { value },
                                        setStartVenueSuggestions,
                                        true
                                    )
                                }
                                onSuggestionsClearRequested={() =>
                                    onSuggestionsClearRequested(
                                        setStartVenueSuggestions
                                    )
                                }
                                onSuggestionSelected={(
                                    event,
                                    { suggestionValue }
                                ) =>
                                    onSuggestionSelected(
                                        event,
                                        { suggestionValue },
                                        true
                                    )
                                }
                                getSuggestionValue={(suggestion) => suggestion}
                                renderSuggestion={(suggestion) => (
                                    <div className="bg-darkk p-3 w-100">
                                        {suggestion}
                                    </div>
                                )}
                                inputProps={startInputProps}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="text-center">to</div> */}
                <div className="col-span-1 border-b border-goldt">
                    <h2 className="text-goldt font-bold">Ending Location</h2>
                    <div className=" absolute ">
                        <Autosuggest
                            suggestions={endVenueSuggestions}
                            onSuggestionsFetchRequested={({ value }) =>
                                onSuggestionsFetchRequested(
                                    { value },
                                    setEndVenueSuggestions,
                                    false
                                )
                            }
                            onSuggestionsClearRequested={() =>
                                onSuggestionsClearRequested(
                                    setEndVenueSuggestions
                                )
                            }
                            onSuggestionSelected={(
                                event,
                                { suggestionValue }
                            ) =>
                                onSuggestionSelected(
                                    event,
                                    { suggestionValue },
                                    false
                                )
                            }
                            getSuggestionValue={(suggestion) => suggestion}
                            renderSuggestion={(suggestion) => (
                                <div className="bg-darkk p-3 w-100">
                                    {suggestion}
                                </div>
                            )}
                            inputProps={endInputProps}
                        />
                    </div>
                </div>
                <div className="col-span-1 border-b border-goldt">
                    <label for="weight-input" className="text-goldt font-bold text-2xl">Weight (in tons)</label>
                    <input
                        id="weight-input"
                        className="w-full text-white peer appearance-none bg-transparent outline-none border-dark border-transparent focus:border-transparent focus:ring-0"
                        type="number"
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="col-span-1 ">
                    <button
                        type="submit"
                        onClick={handleCalculation}
                        className="mt-5 block rounded-3xl bg-gradient-to-r from-goldl to-goldd hover:from-goldd hover:to-goldl px-10 py-2.5 text-center text-md font-bold text-dark shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-goldt"
                    >
                        Calculate
                    </button>
                </div>
            </div>

            <p className="mt-5">
                Measured Distance:{" "}
                <span className="text-goldt">{distance}</span> KM{" "}
            </p>

            <p>
                co2 emissions:{" "}
                <span className="text-goldt">{estimation25}</span> Kg -{" "}
                <span className="text-goldt">{estimation35}</span> Kg{" "}
            </p>
        </div>
    );
}

export default Map;
