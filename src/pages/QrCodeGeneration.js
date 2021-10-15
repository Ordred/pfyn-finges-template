import {useEffect, useState} from "react";

import {firebase} from '../initFirebase';
import {QrCode} from "../components/QrCode";

const database = firebase.firestore();

export default function QrCodeGenerationPage() {
    function handlePoiButtonClick(e){
        setCurrentPoiCode(e.target.dataset.poi)
    }

    const [poisCollection, setPoiCollection] = useState(null);
    const [currentPoiCode, setCurrentPoiCode] = useState(null);

    useEffect(() => {
        // TODO: Refactor this into its own hook ?
        const collection = database.collection("pois");
        const unsubscribe = collection.onSnapshot(snap => {
            setPoiCollection(
                snap.docs.map(
                    doc => ({id: doc.id, ...doc.data()})
                )
            )
        }, console.error);

        return () => unsubscribe();
    }, [])

    return (
        <>
            <p>QRCode generation page</p>
            <ul className="ul-no-bullets">
                { poisCollection &&
                    poisCollection.map(poi => {
                        return <li key={poi.id}><button onClick={handlePoiButtonClick} data-poi={poi.id}>{poi.name}</button></li>
                    })
                }
            </ul>

            { currentPoiCode && <QrCode url={"http://localhost:3000/code/" + currentPoiCode }/>}
        </>
    )
}
