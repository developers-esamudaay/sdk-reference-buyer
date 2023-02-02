import { MapContainer, TileLayer,Marker,Popup,useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef,useEffect,useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet';
const icon = L.icon({ 
  iconRetinaUrl:iconRetina, 
  iconUrl: iconMarker, 
  shadowUrl: iconShadow 
});
const MapView=({location,zoom})=>{
    console.log(location)
     
     function Test({ location}) {
      const map = useMap();
      if (location) map.flyTo(location, 12);
    
      return location ? (
        <Marker
          draggable
          position={location}
          //ref={markerRef}
          icon={icon}
        >
          <Popup>{"your locstion"}</Popup>
        </Marker>
      ) : null;
    }
    
    return(
        <>
        <MapContainer  center={[20.5937, 78.9629]} zoom={zoom}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Test location={location}  />
  </MapContainer>
 
       </>
    )
}
export default MapView