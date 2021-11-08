import "../App.css";

import 'leaflet/dist/leaflet.css'
import React, {useState} from 'react'
import {COLLECTION_POIS} from "../App";
import {firebase} from "../initFirebase";
import {Alert, Button, Form, FormGroup, Input, Label} from "reactstrap";
import {useTranslation} from "react-i18next";

const EMPTY_POI = {name: '', description: '', latitude: '', longitude: '', url: ''}


export function PointOfInterestCreationForm(props) {
    let db = firebase.firestore();
    let [newPOI, setNewPOI] = useState(EMPTY_POI)
    let [errorMessages, setErrorMessages] = useState([]);

    const {t} = useTranslation();

    const savePointOfInterest = async (event) => {
        event.preventDefault();
        let messages = [];

        if(props.position === null){
            messages.push(t('poi-creation-empty-pos'))
        }

        if (messages.length > 0){
            setErrorMessages(messages);
            return;
        }

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
        <Form onSubmit={savePointOfInterest}>
            {errorMessages.length > 0 &&
            <Alert color="danger">
                {/* I would certainly used the message array index, but an UUID is fine too */}
                <ul>{errorMessages.map(err => <li key={crypto.randomUUID()}>{err}</li>)}</ul>
            </Alert>
            }

            <FormGroup>
                <Label for="name">{t('poi_name')}</Label>
                <Input type="text" id="name" name="name" value={newPOI.name} onChange={handleFormInputChange} required/>
            </FormGroup>

            <FormGroup>
                <Label for="lat">Latitude</Label>
                <Input type="text" value={props.position ? props.position.lat : ""} disabled/>
            </FormGroup>

            <FormGroup>
                <Label for="lat">Longitude</Label>
                <Input type="text" value={props.position ? props.position.lng : ""} disabled/>
            </FormGroup>

            <FormGroup>
                <Label for="description">{t('poi_description')}</Label>
                <Input type="textarea" id="description" name="description" rows="4" value={newPOI.description} onChange={handleFormInputChange} required/>
            </FormGroup>

            <FormGroup>
                <Label for="url">{t('qr_code_url')}</Label>
                <Input type="url" id="url" name="url" value={newPOI.url} onChange={handleFormInputChange} required/>
            </FormGroup>

            <p>
                <Button type="submit" color="primary" style={{marginTop: '1rem'}}>{t('save_poi')}</Button>
            </p>
        </Form>
    )
}



