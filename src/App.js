import "./App.css";
import 'leaflet/dist/leaflet.css'

import {useAuth} from "./context/AuthContext";
import React from 'react'
import {Switch, Redirect} from 'react-router-dom';

import {useTranslation} from "react-i18next";
import "./context/Translation";

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
