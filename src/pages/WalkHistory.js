import {useAuth} from "../context/AuthContext";
import {firebase} from "../initFirebase";
import {db} from "../App";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Polyline} from "react-leaflet";
import {MapComponent} from "../Map";
import 'leaflet/dist/leaflet.css'
import React from 'react'


export function WalkHistory(){

    const db = firebase.firestore();
    const {isAuthenticated, isAdmin} = useAuth();

    let [gpxList, setGpx] = useState(null);
    let [loadError, setLoadError] = useState(null);
    useEffect(() => {
        async function getGpxFileFromAuthUser() {
            if (!isAuthenticated) {
                return;
            }

            const currentUser = firebase.auth().currentUser;
            console.assert(currentUser !== null);
            const userId = currentUser.uid;

            const userDataRef = db.collection('users')
                .doc(userId);

            let userData;

            try {
                userData = (await userDataRef.get()).data();
            } catch (e) {
                console.error("Couldn't query database for user", e);
                setLoadError("Failed to query database");
                return;
            }

                userData = userData.gpx_files
            setGpx(userData);
            console.log(userData)
        }

        getGpxFileFromAuthUser();
        // We don't have any "live" snapshots loaded into memory, we can safely
        // finish this effect without worrying about leaking listeners
    }, []);




    let storage = firebase.storage();
    let ref = storage.refFromURL("gs://pfyn-finges-nature-park-grp2.appspot.com/test3.gpx");
    let [coordinates, setCoordinates] = useState(0)

    useEffect(() => {

        ref.getDownloadURL()
            .then(url => fetch(url, {mode: "cors"}))
            .then(response => response.text())
            .then(response_content => {
                let parser = new DOMParser();
                let parsed_doc = parser.parseFromString(response_content, "application/xml");
                let nodes = [...parsed_doc.querySelectorAll("trkpt")];
                let coords = nodes.map(node => [node.attributes.lat.value, node.attributes.lon.value])
                setCoordinates(coords);
            })
            .catch(error => console.error(error)
            );
    }, []);

    if(!isAuthenticated) {
        // TODO: Redirect to the root URL to do the login ?
        return <p>You are not authenticated</p>;
    }

        return(
            <>
            <MapComponent>
                <Polyline pathOptions={{ fillColor: 'red', color: 'purple' }} positions={coordinates}/>
            </MapComponent>
            <ul style={{ padding: 0}}>
                {gpxList !=null &&gpxList.map((gpx, index)=>(
                    <li key={index}>
                        <div>
                            <p>
                                <Link className="App-link">
                                    {gpx}
                                </Link>
                            </p>
                        </div>
                    </li>
                ))}

            </ul></>)

}