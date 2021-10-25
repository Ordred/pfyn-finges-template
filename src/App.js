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
import AuthenticatedRoute from "./components/UserAuthenticatedRoute";
import AdminRoute from "./components/AdminRoute";
import AddPointOfInterest from "./pages/AddPointOfInterest";
import Navigation from "./components/Nav";

import DiscoveredPointsOfInterest from "./pages/DiscoveredPointsOfInterest";
import {Container} from "reactstrap";

export const COLLECTION_POIS = "pois";
export const COLLECTION_USERS = "users";


function App() {
    const {t} = useTranslation();
    // Get authenticated state using the custom "auth" hook
    const {isAuthenticated} = useAuth();

    // Normal rendering of the app for authenticated users
    return (
        <div>
            {isAuthenticated && <Navigation/>}
            <Container>
                <h1>{t('welcome_to_forest_finges')}</h1>

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
            </Container>
        </div>
    );
}


export default App;
