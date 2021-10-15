

import {Marker, Popup} from "react-leaflet";
import {firebase} from "./initFirebase";
import {Icon} from "leaflet";
import {useEffect, useState} from "react";

export function DiscoveredPOIS(props) {

    let [user, setUser] = useState();

    async function getUser() {
        let db = firebase.firestore();
        let userCollection = db.collection("users");
        let userData = userCollection.doc(props.user);
        let user = await userData.get()

        return user.data();
    }

    useEffect(() => {
        async function getUser() {
            let db = firebase.firestore();
            let userCollection = db.collection("users");
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

        if (tempPOI != null) {

            latitude = tempPOI.latitude;
            longitude = tempPOI.longitude;
        }

        return latitude != null && [latitude, longitude]

    }

    return user != null && user.discovered.map(poi => <Marker key={poi} position={{lat: getDiscoveredPOIS(poi)[0], lng: getDiscoveredPOIS(poi)[1]}}/>)
}

