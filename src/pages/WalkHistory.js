import {firebase} from "../initFirebase";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Polyline} from "react-leaflet";
import {MapComponent} from "../components/Map";
import 'leaflet/dist/leaflet.css'
import React from 'react'
import useUserData from "../hooks/useUserData";


export default function WalkHistory(props) {
    // Unauthenticated users are kept from executing this component by the AuthenticatedRoute HoC

    let userData = useUserData(firebase.auth().currentUser.uid);
    let [trackCoordinates, setTrackCoordinates] = useState(null)

    let gpxFilename = props.match.params.gpx;

    useEffect(() => {
        // Nothing requested ? Don't load anything then !
        if(!gpxFilename){
            return;
        }

        let storage = firebase.storage();
        let gpxFileRef = storage.refFromURL(`gs://${process.env.REACT_APP_FIREBASE_STORAGE}/${gpxFilename}`);

        gpxFileRef.getDownloadURL()
            .then(url => fetch(url, {mode: "cors"}))
            .then(response => response.text())
            .then(response_content => {
                // The resulting content is an XML file. We can then use the DOMParser to parse the XML content and
                // the Document API ─ XMLDocument inherits Document ─ to fetch an array of trkpt nodes
                let parser = new DOMParser();
                let parsed_doc = parser.parseFromString(response_content, "application/xml");
                let nodes = [...parsed_doc.querySelectorAll("trkpt")];
                let coords = nodes.map(node => [node.attributes.lat.value, node.attributes.lon.value])
                setTrackCoordinates(coords);
            })
            .catch(error => console.error("Couldn't fetch the user's GPX file", error));
    }, [gpxFilename]);

    if(userData === null){
        return null; // Don't render anything until the user data is loaded
    }

    let gpxFilesList;

    if(userData.gpx_files.length === 0) {
        gpxFilesList = <p>No GPX file to explore</p>
    } else {
        gpxFilesList = (
            <ul>
                {userData.gpx_files.map((file, index) => <li key={index}><Link to={`/map/walk-history/${file}`} className="App-link">{file}</Link></li>)}
            </ul>
        )
    }

    return (
        <>
            <MapComponent>
                {trackCoordinates && <Polyline pathOptions={{fillColor: 'red', color: 'purple'}} positions={trackCoordinates}/>}
            </MapComponent>

            {gpxFilesList}
        </>
    )
}