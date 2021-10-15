import {SetPOIS} from "../SetPOIS";
import {MapComponent} from "../Map";
import {Marker, Popup, useMapEvents} from "react-leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import React, {useState} from "react";
import {Icon} from "leaflet";
import usePoiCollection from "../hooks/usePoiCollection";

export default function AddPointOfInterest() {
    const [position, setPosition] = useState({lat: 46.3021, lng: 7.6261});
    let poisCollection = usePoiCollection();

    return (
        <>
            <SetPOIS position={position}/>
            <MapComponent>
                {poisCollection && poisCollection.map(coordinate => <PointOfInterest key={coordinate.id} {...coordinate}/>)}
                <Popup position={position}/>
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