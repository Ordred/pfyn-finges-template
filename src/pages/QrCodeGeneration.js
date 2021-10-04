
import {useEffect, useState} from "react";
import {useQRCode} from "react-qrcodes";

import {firebase} from '../initFirebase';

const database = firebase.firestore();

export function QrCodeGenerationPage() {
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

function QrCode(props){
    let [qrcoderef] = useQRCode({
        text: props.url,
        options: {
            level: 'H',
            margin: 5,
            scale: 4,
            width: 250,
            color: {
                light: "#ffffffff",
                dark: "#000000ff"
            }
        }
    });

    return props.url && <img ref={qrcoderef} alt={"QR code for link " + props.url}/>
}