import "../App.css";

import 'leaflet/dist/leaflet.css'
import React, {useState} from 'react'
import {COLLECTION_POIS} from "../App";
import {firebase} from "../initFirebase";

const EMPTY_POI = {name: '', description: '', latitude: '', longitude: '', url: ''}

export function PointOfInterestCreationForm(props) {
    let db = firebase.firestore();
    let [newPOI, setNewPOI] = useState(EMPTY_POI)

    const savePointOfInterest = async (event) => {
        event.preventDefault();
        const poisCollection = await db.collection(COLLECTION_POIS);

        try {
            await poisCollection.add({...newPOI, latitude: props.position.lat, longitude: props.position.lng});
        } catch (e) {
            console.error("Could not add new POI", e.stack);
        }

        setNewPOI(EMPTY_POI);
        props.setCreationPositionCallback(null)
    };

    const handleFormInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        setNewPOI(newPOI => ({...newPOI, [name]: value}))
    };

    return (

        <form onSubmit={savePointOfInterest} className="addPOI">
            <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={newPOI.name}
                onChange={handleFormInputChange}
            />
            <input
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                value={newPOI.description}
                onChange={handleFormInputChange}
            />
            <input
                type="text"
                id="url"
                name="url"
                placeholder="QR-Code URL"
                value={newPOI.url}
                onChange={handleFormInputChange}
            />
            <button type="submit">Save point of interest</button>
        </form>
    )
}



