import { useEffect } from 'react';
import { useGoogleMap } from '@react-google-maps/api';

const TrafficLayer = () => {
  // Get the current map instance using the useGoogleMap hook
  const map = useGoogleMap(); 

  useEffect(() => {
    if (!map) return; // Wait until the map instance is loaded

    // Create a new TrafficLayer instance
    const trafficLayer = new window.google.maps.TrafficLayer();
    
    // Add the traffic layer to the map
    trafficLayer.setMap(map);

    // Cleanup function to remove the traffic layer when the component is unmounted
    return () => {
      trafficLayer.setMap(null);
    };
  }, [map]); // Dependency array ensures this runs when the map instance changes

  return null; // No visual rendering required
};

export default TrafficLayer;
