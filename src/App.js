import "./App.css";
import 'leaflet/dist/leaflet.css'

import { firebase } from "./initFirebase";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";
import React from 'react'
import {Switch, Redirect} from 'react-router-dom';
import {CodeActivationPage} from "./pages/CodeActivationPage";
import {QrCodeGenerationPage} from "./pages/QrCodeGeneration";
import {WalkHistory} from "./pages/WalkHistory";
import LinkButton from "./components/LinkButton";
import AuthenticatedRoute from "./components/UserAuthenticatedRoute";
import AdminRoute from "./components/AdminRoute";
import AddPointOfInterest from "./pages/AddPointOfInterest";

// Get the DB object from the firebase app
export const db = firebase.firestore();

export const COLLECTION_POIS = "pois";
export const COLLECTION_USERS = "users";

function App() {
    // Get authenticated state using the custom "auth" hook
    const { isAdmin } = useAuth();

    // EXAMPLE : Store an entire collection of POIs in the state
    const [poisCollection, setPoisCollection] = useState(null);

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
        // Add a random PointOfInterest to your group's DB
        const poisCollection = await db.collection(COLLECTION_POIS);

        try {
            await poisCollection.add({
                name: `POI Test ${Math.floor(Math.random() * 500)}`,
            });
        } catch (e) {
            console.error("Could not add new PointOfInterest");
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

    // Normal rendering of the app for authenticated users
    return (
        <div className="App">
            <h1>Welcome to the Pfyn-Finges Forest!</h1>

            {/* Show role based on admin status (from custom claim) */}
            <h2>Your role is : {isAdmin ? "Admin" : "User"}</h2>

            {/* Render buttons to add/remove data & log out */}
            <div style={{ display: "flex" }}>
                {/* Admin-only tasks */}
                {isAdmin && (
                    <>
                        <button onClick={addDummyData}>Add Dummy Data</button>
                        <button onClick={cleanDB}>Clean DB</button>
                        <LinkButton to="/admin/code/generation">Generate a QR code for a PoI</LinkButton>
                        <LinkButton to="/admin/poi/add">Create a PoI</LinkButton>
                    </>
                )}

                <button onClick={signOut}>Logout</button>
            </div>

            <Switch>
                <AdminRoute path="/admin/code/generation" component={QrCodeGenerationPage}/>

                <AdminRoute path="/admin/poi/add">
                    <AddPointOfInterest setPoisCollection={setPoisCollection} poisCollection={poisCollection} />
                </AdminRoute>

                <AuthenticatedRoute path="/code/:code" component={CodeActivationPage}/>

                <AuthenticatedRoute path="/map/discovered-points-of-interest">

                </AuthenticatedRoute>

                <AuthenticatedRoute path="/map/walk-history/:gpx?" component={WalkHistory}/>

                <AuthenticatedRoute path="/">
                    <Redirect to="/map/walk-history"/>
                </AuthenticatedRoute>
            </Switch>

            {/* Render the collection of POIs from the DB */}
            {/*<h4>POIs Collection</h4>*/}
            {/*<code style={{ margin: "1em", textAlign: 'left' }}><pre>{JSON.stringify(poisCollection, null, 2)}</pre></code>*/}

        </div>
    );
}

export default App;
