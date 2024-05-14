import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup
// } from 'react-leaflet'
import mapboxgl from 'mapbox-gl';

function TripStream() {

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFrZXJzb3VsIiwiYSI6ImNsbHhtd3V1dzBlMjYzcnAzNmVhdDRidjIifQ.Z4UswRfpsjf5pXByC4DN4A';
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(4.85);
  const [lat, setLat] = useState(45.75);
  const [zoom, setZoom] = useState(11);

  const fetchData = async() => {
    const data = await fetch('http://90.65.50.13:5000/getall');
    return data.json();
  }

  useEffect(() => {
    const socket = io('http://90.65.50.13:5000');
    fetchData().then((res) => {
      if(!map.current) {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: zoom
        });
      }

      res.forEach((marker) => {
        // URL de l'API de géocodage de Mapbox pour le snap-to-road
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${marker.location[0]},${marker.location[1]}.json?access_token=pk.eyJ1IjoibWFrZXJzb3VsIiwiYSI6ImNsbHhtd3V1dzBlMjYzcnAzNmVhdDRidjIifQ.Z4UswRfpsjf5pXByC4DN4A&types=address`;
    
        // Appel à l'API de Mapbox
        fetch(url)
          .then(response => response.json())
          .then(data => {
            // Supposer que la première caractéristique est la route la plus proche
            const closestRoad = data.features[0];
            const roadCoordinates = closestRoad.geometry.coordinates;
    
            // Créer et ajouter le marqueur à la nouvelle position
            new mapboxgl.Marker()
              .setLngLat([roadCoordinates[0], roadCoordinates[1]])
              .addTo(map.current);
          })
          .catch(error => console.error('Erreur lors de la géolocalisation:', error));
      });
  
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
    socket.on("pointCreated", (newMarkers) => {
      newMarkers.forEach((marker) => {
        // URL de l'API de géocodage de Mapbox pour le snap-to-road
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${marker.location[0]},${marker.location[1]}.json?access_token=pk.eyJ1IjoibWFrZXJzb3VsIiwiYSI6ImNsbHhtd3V1dzBlMjYzcnAzNmVhdDRidjIifQ.Z4UswRfpsjf5pXByC4DN4A&types=address`;
    
        // Appel à l'API de Mapbox
        fetch(url)
          .then(response => response.json())
          .then(data => {
            // Supposer que la première caractéristique est la route la plus proche
            const closestRoad = data.features[0];
            const roadCoordinates = closestRoad.geometry.coordinates;
    
            // Créer et ajouter le marqueur à la nouvelle position
            new mapboxgl.Marker()
              .setLngLat([roadCoordinates[0], roadCoordinates[1]])
              .addTo(map.current);
          })
          .catch(error => console.error('Erreur lors de la géolocalisation:', error));
      });
    });
  
    // Clean up function to remove the map and disconnect the socket when the component unmounts
    return () => {
      if (map.current) {
        map.current.remove();
      }
      socket.disconnect();
    };
  }, []);


  
  return (
    <div className="w-[800px] h-[800px]">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default TripStream;
