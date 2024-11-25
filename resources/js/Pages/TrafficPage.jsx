import "../../css/gradient.css";
import { useState, useEffect } from "react";

export default function GoingGreen() {
    const [getfooter, setfooter] = useState([]);

    // *********************************************************
    // ********************* All requests  *********************
    // *********************************************************
    // Footer
    useEffect(() => {
        axios
            .get("/footer")
            .then((response) => {
                // console.log('fetching data:',response.data);
                setfooter(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);
    // *********************************************************
    // ********************* End requests  *********************
    // *********************************************************
    return (
        <>
        </>
    );
}
