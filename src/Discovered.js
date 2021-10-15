

import {Marker, Popup} from "react-leaflet";
import {firebase} from "./initFirebase";
import {Icon} from "leaflet";
import {useEffect, useState} from "react";

export function DiscoveredPOIS(props) {

    let [user, setUser] = useState();

    useEffect(() => {
        async function getUser() {
            let db = firebase.firestore();
            let userCollection = db.collection("users");
            console.log(props.user)
            let userData = userCollection.doc(props.user);

            let user = await userData.get()

            setUser(user.data());
            }
        getUser();
        }, [props.user]

    )

    function getDiscoveredPOIS(poi) {

        let latitude;
        let longitude;

        let tempPOI = props.pois.find(findPOI => findPOI.id === poi);

        return tempPOI

    }

    return user != null && user.discovered.map(poi => {
        let tempPOI = getDiscoveredPOIS(poi)
        return <Marker key={poi} position={{lat: tempPOI.latitude, lng: tempPOI.longitude}}>
        <Popup>
            {tempPOI.name}<br/>
            {tempPOI.discovered}<br/>
            <a href={tempPOI.url}>{tempPOI.url}</a>
        </Popup>
    </Marker>})
}

