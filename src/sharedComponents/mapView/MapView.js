import { MapContainer, TileLayer,Marker,Popup,useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef,useEffect,useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'
import L from 'leaflet';
import styles from "./MapView.module.scss"
const icon = L.icon({ 
  iconRetinaUrl:iconRetina, 
  iconUrl: iconMarker, 
  shadowUrl: iconShadow ,
  iconSize:     [20, 30]
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
        
          icon={icon}
        >
          <Popup>{"your locstion"}</Popup>
        </Marker>
      ) : null;
    }
    
    return(
        <div className={styles.map_view_container}>
        <MapContainer  center={[20.5937, 78.9629]} zoom={zoom}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Test location={location}  />
  </MapContainer>
 
       </div>
    )
}
export default MapView