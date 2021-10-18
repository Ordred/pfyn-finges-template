
import { useAuth } from "./context/AuthContext";
import {Marker, Popup} from "react-leaflet";
import {firebase} from "./initFirebase";
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from "leaflet";
import {useEffect, useState} from "react";
import useUserData from "./hooks/useUserData";
import usePoiCollection from "./hooks/usePoiCollection";

export function DiscoveredPOIS(props) {

    let uid = useAuth().uid;
    let user;

    user = useUserData(uid);
    let pois = usePoiCollection();


    function getDiscoveredPOIS(poi) {

        let latitude;
        let longitude;
        let tempPOI;

        console.log(pois);

        if (pois != null) {
            tempPOI = pois.find(findPOI => findPOI.id === poi);
        }


        return tempPOI

    }

    return user != null && pois != null && user.discovered.map(poi => {
        let tempPOI = getDiscoveredPOIS(poi)
        console.log(tempPOI)
        return tempPOI != null && <Marker key={poi} position={{lat: tempPOI.latitude, lng: tempPOI.longitude}} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
        <Popup>
            {tempPOI.name}<br/>
            {tempPOI.discovered}<br/>
            <a href={tempPOI.url}>{tempPOI.url}</a>
        </Popup>
    </Marker>})
}

