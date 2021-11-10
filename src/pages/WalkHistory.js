import {firebase} from "../initFirebase";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Polyline, useMap} from "react-leaflet";
import {MapComponent} from "../components/Map";
import 'leaflet/dist/leaflet.css'
import React from 'react'
import useUserData from "../hooks/useUserData";
import {Row, Col} from 'reactstrap';


export default function WalkHistory(props) {
    // Unauthenticated users are kept from executing this component by the AuthenticatedRoute HoC

    let uid = firebase.auth().currentUser.uid;
    let userData = useUserData(uid);
    let [firebaseGpxFilesList, setFirebaseGpxFilesList] = useState([]);
    let [trackCoordinates, setTrackCoordinates] = useState(null)

    let gpxFilename = props.match.params.gpx;

    useEffect(() => {
        const fetch_user_files = async () => {

            let storage = firebase.storage();
            let file_list_ref = storage.refFromURL(`gs://${process.env.REACT_APP_FIREBASE_STORAGE}/${uid}`);
            let file_list = [];
            try {
                file_list = await file_list_ref.listAll()
            } catch (e) {
                // no-op
            }

            setFirebaseGpxFilesList(file_list.items.map(file_ref => file_ref.name))
        }

        if(!userData?.gpx_files){
            return;
        }

        fetch_user_files()

        // The user data is already observed for us, as an update trigger. We can't watch the storage directly
    }, [uid, userData?.gpx_files])

    useEffect(() => {
        // Nothing requested ? Don't load anything then !
        if(!gpxFilename){
            return;
        }

        let storage = firebase.storage();
        let gpxFileRef = storage.refFromURL(`gs://${process.env.REACT_APP_FIREBASE_STORAGE}/${uid}/${gpxFilename}`);

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
    }, [gpxFilename, uid]);

    if(userData === null){
        return null; // Don't render anything until the user data is loaded
    }

    let gpxFilesList;

    if(firebaseGpxFilesList.length === 0) {
        gpxFilesList = <p>No GPX file to explore</p>
    } else {
        gpxFilesList = (
            <ul>
                {firebaseGpxFilesList.map((file) => <li key={file}><Link to={`/map/walk-history/${file}`} className="App-link">{file}</Link></li>)}
            </ul>
        )
    }

    return (
        <Row>
            <Col sm="12" md="4" lg="3">
                {gpxFilesList}
            </Col>

            <Col sm="12" md="8" lg="9">
                <MapComponent>
                    {trackCoordinates && <Polyline pathOptions={{fillColor: 'red', color: 'red'}} positions={trackCoordinates}/>}
                    <WalkWaypointCenterer position={trackCoordinates && trackCoordinates.length > 0 && trackCoordinates[0]}/>
                </MapComponent>
            </Col>
        </Row>
    )
}

function WalkWaypointCenterer({position}) {
    const map = useMap();

    if(!position){
        return null;
    }

    map.panTo(position);

    return null;
}