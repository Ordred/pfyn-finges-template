import {PointOfInterestCreationForm} from "../components/PointOfInterestCreationForm";
import {MapComponent} from "../components/Map";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import React, {useState} from "react";
import {Icon} from "leaflet";
import usePoiCollection from "../hooks/usePoiCollection";

export default function AddPointOfInterest() {
    const [position, setPosition] = useState(null);
    let poisCollection = usePoiCollection();

    return (
        <>
            <PointOfInterestCreationForm position={position} setCreationPositionCallback={setPosition}/>
            <MapComponent>
                {poisCollection && poisCollection.map(coordinate => <PointOfInterest key={coordinate.id} {...coordinate}/>)}
                {position &&
                    <Popup position={position}>
                        <p>Longitude: {position.lng.toFixed(5)}, Latitude: {position.lat.toFixed(5)}</p>
                    </Popup>
                }
                <MarkerCreation setPositionCallback={setPosition}/>
            </MapComponent>
        </>
    )
}

function MarkerCreation(props) {
    useMapEvents({
        click: (e) => {
            console.log("latlng is :", e.latlng)
            props.setPositionCallback(e.latlng)
        }
    });

    return null;
}

function PointOfInterest(props) {
    let tempLat = +props.latitude;
    let tempLng = +props.longitude;

    return <Marker position={{lat: tempLat, lng: tempLng}} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}/>
}