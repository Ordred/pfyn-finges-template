

import {Popup} from "react-leaflet";
import {firebase} from "./initFirebase";
import {Icon} from "leaflet";
import {useEffect, useState} from "react";

export function DiscoveredPOIS(props) {

    console.log(props.pois);
    console.log(props.user)

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
        let latitude = props.pois.find(id => props.pois.key === poi.key).latitude;
        let longitude = props.pois.find(id => props.pois.key === poi.key).longitude;

        return [latitude, longitude]

    }


    if(user){
       console.log(user);
       console.log(user.discovered)
    }


    return user != null && user.discovered.map(poi => <Popup key={poi.key} position={getDiscoveredPOIS(poi)}/>)
}

