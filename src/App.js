import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from 'react-leaflet'
import mapboxgl from 'mapbox-gl';

function App() {

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFrZXJzb3VsIiwiYSI6ImNsbHhtd3V1dzBlMjYzcnAzNmVhdDRidjIifQ.Z4UswRfpsjf5pXByC4DN4A';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.85);
  const [lat, setLat] = useState(45.75);
  const [zoom, setZoom] = useState(11);

  const fetchData = async() => {
    const data = await fetch('http://localhost:5000/getall');
    return data.json();
  }

  useEffect(() => {
    const socket = io('http://localhost:5000');
    fetchData().then((res) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });

      res.map((marker) => {
        new mapboxgl.Marker()
        .setLngLat([marker.location[0], marker.location[1]])
        .addTo(map.current);
      })
  
      // Add our navigation control (the +/- zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
      // Map onload event 
      map.current.on("load", ()=> {
          // Nifty code to force map to fit inside container when it loads
          map.current.resize();
  
      })
  
      // Clean up on unmount
      return () => map.current.remove();
    })
    socket.on("pointCreated", (res) => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });
  
      
      res.map((marker) => {
        new mapboxgl.Marker()
        .setLngLat([marker.location[0], marker.location[1]])
        .addTo(map.current);
      })
  
  
      // Add our navigation control (the +/- zoom buttons)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
      // Map onload event 
      map.current.on("load", ()=> {
          // Nifty code to force map to fit inside container when it loads
          map.current.resize();
  
      })
  
      // Clean up on unmount
      return () => map.current.remove();
    })
    return () => socket.disconnect();
  }, []);


  
  return (
    <div className="w-[800px] h-[800px]">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default App;
