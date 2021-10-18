import {DiscoveredPOIS} from "../Discovered";
import {firebase} from "../initFirebase";
import React from "react";
import {MapComponent} from "../components/Map";
import usePoiCollection from "../hooks/usePoiCollection";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Marker} from "react-leaflet";
import {Icon} from "leaflet";
import {Popup} from "leaflet/dist/leaflet-src.esm";


export default function DiscoveredPointsOfInterest(){
    let poisCollection = usePoiCollection();

    return (
        <MapComponent>
            <DiscoveredPOIS user={firebase.auth().currentUser.uid} pois={poisCollection}/>
        </MapComponent>
    );
}

function PointOfInterest(props) {
    let tempLat = +props.latitude;
    let tempLng = +props.longitude;

    return <Marker position={{lat: tempLat, lng: tempLng}} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
        <Popup>
            {props.name}<br/>
            {props.description}<br/>
            <a href={props.url}>{props.url}</a>
        </Popup>
    </Marker>
}
