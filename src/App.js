import "./App.css";

import { firebase } from "./initFirebase";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css'
import React from 'react'
import {MapComponent} from "./Map";
import {SetPOIS} from "./SetPOIS";

// Get the DB object from the firebase app
export const db = firebase.firestore();

// EXAMPLE : Reference to a collection of POIs
export const COLLECTION_POIS = "pois";
export const COLLECTION_USERS = "users";

function App() {
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

    // Get authenticated state using the custom "auth" hook
    const { isAuthenticated, isAdmin } = useAuth();

    // EXAMPLE : Store an entire collection of POIs in the state
    const [poisCollection, setPoisCollection] = useState(null);

    const [uid, setUID] = useState(firebase.auth().currentUser != null && firebase.auth().currentUser.uid);
    const [position, setPosition] = useState({lat: 46.3021, lng: 7.6261});

    useEffect(() => {
        // EXAMPLE : Fetch POIs of your DB
        const poisCollection = db.collection(COLLECTION_POIS);

        // Subscribe to DB changes
        const unsubscribe = poisCollection.onSnapshot(
            (snapshot) => {
                // Store the collection of POIs as an array of ID => Data pairs
                //setPoisCollection(snapshot.docs.map((d) => ({ [d.id]: d.data() })));
                setPoisCollection(snapshot.docs.map((d) => ({id: d.id, ...d.data()} )));
            },
            (error) => console.error(error)
        );

        // Unsubscribe on unmount
        return () => unsubscribe();
    }, []);

    // EXAMPLE : Add a new document to the DB
    const addDummyData = async () => {
        // Add a random POI to your group's DB
        const poisCollection = await db.collection(COLLECTION_POIS);

        try {
            await poisCollection.add({
                name: `POI Test ${Math.floor(Math.random() * 500)}`,
            });
        } catch (e) {
            console.error("Could not add new POI");
        }
    };

    // WARNING: Only for debugging purposes, this should not be used in a production environment!
    const cleanDB = async () => {
        const ref = db.collection(COLLECTION_POIS);

        let snapshot = await ref.get();

        for (let doc of snapshot.docs) {
            try {
                await ref.doc(doc.id).delete();
            } catch (e) {
                console.error(`Could not delete document with ID ${doc.id} `);
                console.error(e);
            }
        }
    };

    // Log out of the application
    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.error(e);
        }
    };

    // If the user is not authenticated, render the "SignIn" component (Firebase UI)
    if (!isAuthenticated) return <SignIn />;

    // Normal rendering of the app for authenticated users
    return (
        <div className="App">

            <h1>Welcome to the Pfyn-Finges Forest!</h1>
            <SetPOIS setPOIs={setPoisCollection} position={position}/>
            {/*<MapComponent pois={POIS} wayPoints={POIS2} poisCollection={poisCollection}  setPosition={setPosition} position={position}/>*/}
            <MapComponent line={coordinates}/>

            {/* Show role based on admin status (from custom claim) */}
            <h2>Your role is : {isAdmin ? "Admin" : "User"}</h2>

            {/* Render the collection of POIs from the DB */}
            <h4>POIs Collection</h4>
            <code style={{ margin: "1em" }}>{JSON.stringify(poisCollection)}</code>

            {/* Render buttons to add/remove data & log out */}
            <div style={{ display: "flex" }}>
                {/* Admin-only tasks */}
                {isAdmin && (
                    <>
                        <button onClick={addDummyData}>Add Dummy Data</button>
                        <button onClick={cleanDB}>Clean DB</button>
                    </>
                )}
                <button onClick={signOut}>Logout</button>
            </div>
        </div>
    );
}

export default App;
