import "../App.css";

import 'leaflet/dist/leaflet.css'
import React, {useState} from 'react'
import {COLLECTION_POIS} from "../App";
import {firebase} from "../initFirebase";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";
import {useTranslation} from "react-i18next";

const EMPTY_POI = {name: '', description: '', latitude: '', longitude: '', url: ''}


export function PointOfInterestCreationForm(props) {
    let db = firebase.firestore();
    let [newPOI, setNewPOI] = useState(EMPTY_POI)

    const {t} = useTranslation();

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

        <Form onSubmit={savePointOfInterest}>
            <FormGroup>
                <Label for="name">{t('poi_name')}</Label>
                <Input type="text" id="name" name="name" placeholder="Name" value={newPOI.name}
                       onChange={handleFormInputChange}/>
            </FormGroup>

            <FormGroup>
                <Label for="description">{t('poi_description')}</Label>
                <Input type="textarea" id="description" name="description" rows="4" placeholder="Description"
                       value={newPOI.description} onChange={handleFormInputChange}/>
            </FormGroup>

            <FormGroup>
                <Label for="url">{t('qr_code_url')}</Label>
                <Input type="url" id="url" name="url" placeholder="QR-Code URL" value={newPOI.url}
                       onChange={handleFormInputChange}/>
            </FormGroup>

            <p>
                <Button type="submit" color="primary" style={{marginTop: '1rem'}}>{t('save_poi')}</Button>
            </p>
        </Form>
    )
}



