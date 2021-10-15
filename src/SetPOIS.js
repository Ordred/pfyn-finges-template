import "./App.css";

import 'leaflet/dist/leaflet.css'
import React, {useState} from 'react'
import {COLLECTION_POIS} from "./App";
import {firebase} from "./initFirebase";

const EMPTY_POI = {name: '', description: '', latitude: '', longitude: '', url: ''}

export function SetPOIS(props) {
    let db = firebase.firestore();
    let [newPOI, setNewPOI] = useState(EMPTY_POI)

    const addPOI = async (event) => {
        event.preventDefault();
        const poisCollection = await db.collection(COLLECTION_POIS);

        try {
            await poisCollection.add({...newPOI, latitude: props.position.lat, longitude: props.position.lng});
        } catch (e) {
            console.error("Could not add new POI", e.stack);
        }

        resetNewPOI();
    };

    const handleFormInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        setNewPOI(newPOI => ({...newPOI, [name]: value}))
    };


    /* Reset the new book object */
    const resetNewPOI = () => {
        setNewPOI(EMPTY_POI);
    };


    return (

        <form onSubmit={addPOI} className="addPOI">
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
            {/*<input
                type="number"
                id="latitude"
                name="latitude"
                placeholder="Latitude"
                value={newPOI.latitude}
                onChange={handleFormInputChange}
            />
            <input
                type="number"
                id="longitude"
                name="longitude"
                placeholder="Longitude"
                value={newPOI.longitude}
                onChange={handleFormInputChange}
            />*/}
            <input
                type="text"
                id="url"
                name="url"
                placeholder="QR-Code URL"
                value={newPOI.url}
                onChange={handleFormInputChange}
            />
            <button type="submit">Add POI</button>
        </form>
    )
}



