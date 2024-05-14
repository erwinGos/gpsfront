import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from 'react-leaflet'
import mapboxgl from 'mapbox-gl';

function CurrentLocation() {

  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12");

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFrZXJzb3VsIiwiYSI6ImNsbHhtd3V1dzBlMjYzcnAzNmVhdDRidjIifQ.Z4UswRfpsjf5pXByC4DN4A';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.85);
  const [lat, setLat] = useState(45.75);
  const [zoom, setZoom] = useState(11);
  const currentMarker = useRef(null);

  var options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    seconde: '2-digit'
  };

  useEffect(() => {
    const socket = io('http://90.65.50.13:5000');
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom
    });
  
      // Add our navigation control (the +/- zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
      // Map onload event 
      map.current.on("load", ()=> {
          // Nifty code to force map to fit inside container when it loads
          map.current.resize();
  
      })

    socket.on("currentLocation", (marker) => {
    if (currentMarker.current) {
      currentMarker.current.remove();
    }
    const popup = new mapboxgl.Popup({ offset: 25 })
    .setText("Vitesse actuelle : " + (marker.speed > 5 ? marker.speed : 0) + "km/h à : " + new Date(marker.timestamp).toLocaleDateString('fr-FR', options))
    
    currentMarker.current = new mapboxgl.Marker()
      .setLngLat([marker.location[0], marker.location[1]])
      .setPopup(popup)
      .addTo(map.current);
    })

    // Clean up function to remove the map and disconnect the socket when the component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
      }
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    map.current.setStyle(mapStyle);
  }, [mapStyle])
  
  return (
    <div className="w-full flex justify-center items-center">
      <div ref={mapContainer} className="map-container" />
      <select onChange={(e) => setMapStyle(e.target.value)} value={mapStyle} name="map-style" id="mapstyle">
        <option value="mapbox://styles/mapbox/satellite-streets-v12">Satellite</option>
        <option value="mapbox://styles/mapbox/outdoors-v12">Normal</option>
      </select>
    </div>
  );
}

export default CurrentLocation;