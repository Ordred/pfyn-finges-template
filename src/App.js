import "./App.css";
import 'leaflet/dist/leaflet.css'

import {firebase} from "./initFirebase";
import {useAuth} from "./context/AuthContext";
import React from 'react'
import {Switch, Redirect} from 'react-router-dom';

import i18n from "i18next";
import {useTranslation, initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpApi from 'i18next-http-backend';

import CodeActivationPage from "./pages/CodeActivationPage";
import QrCodeGenerationPage from "./pages/QrCodeGeneration";
import WalkHistory from "./pages/WalkHistory";
import LinkButton from "./components/LinkButton";
import AuthenticatedRoute from "./components/UserAuthenticatedRoute";
import AdminRoute from "./components/AdminRoute";
import AddPointOfInterest from "./pages/AddPointOfInterest";
import Navigation from "./components/Nav";

import DiscoveredPointsOfInterest from "./pages/DiscoveredPointsOfInterest";

export const COLLECTION_POIS = "pois";
export const COLLECTION_USERS = "users";


function App() {
    const {t} = useTranslation();
    // Get authenticated state using the custom "auth" hook
    const {isAdmin, isAuthenticated} = useAuth();

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
        <div>
            {isAuthenticated && <Navigation/>}
            <div className="App">
                <h1>{t('welcome_to_forest_finges')}</h1>

                {/* Render buttons to add/remove data & log out */}
                <div style={{display: "flex"}}>
                    {/* Admin-only tasks */}
                    {isAdmin && (
                        <>
                            <LinkButton to="/admin/code/generation">{t('generate_a_qr_code')}</LinkButton>
                            <LinkButton to="/admin/poi/add">{t('create_poi')}</LinkButton>
                        </>
                    )}

                </div>

                <Switch>
                    <AdminRoute path="/admin/code/generation" component={QrCodeGenerationPage}/>

                    <AdminRoute path="/admin/poi/add" component={AddPointOfInterest}/>

                    <AuthenticatedRoute path="/code/:code" component={CodeActivationPage}/>

                    <AuthenticatedRoute path="/map/discovered-points-of-interest"
                                        component={DiscoveredPointsOfInterest}/>

                    <AuthenticatedRoute path="/map/walk-history/:gpx?" component={WalkHistory}/>

                    <AuthenticatedRoute path="/">
                        <Redirect to="/map/walk-history"/>
                    </AuthenticatedRoute>
                </Switch>

                {/* Render the collection of POIs from the DB */}
                {/*<h4>POIs Collection</h4>*/}
                {/*<code style={{ margin: "1em", textAlign: 'left' }}><pre>{JSON.stringify(poisCollection, null, 2)}</pre></code>*/}

            </div>
        </div>
    );
}


export default App;
