import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRef, useEffect, useState } from "react";
import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import iconMarker from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
import { Location } from "../../interfaces/AddressInterfaces";
import styles from "./MapView.module.scss";
const icon = L.icon({
  iconRetinaUrl: iconRetina,
  iconUrl: iconMarker,
  shadowUrl: iconShadow,
  iconSize: [20, 30],
});
type MapViewProps = {
  location: Location | null;
  zoom: number;
};
type MarkPointerProps = {
  location: Location;
};
const MarkPointer: React.FC<MarkPointerProps> = ({ location }) => {
  const map = useMap();
  if (location) map.flyTo(location, 12);

  return location ? (
    <Marker
      position={location}

      // icon={icon}
    >
      <Popup>{"your  location"}</Popup>
    </Marker>
  ) : null;
};
const MapView: React.FC<MapViewProps> = ({ location, zoom }) => {
  console.log(location);

  return (
    <div className={styles.map_view_container}>
      <MapContainer>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkPointer location={location ?? {}} />
      </MapContainer>
    </div>
  );
};
export default MapView;
