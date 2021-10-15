import {useEffect, useState} from "react";
import {firebase} from "../initFirebase";
import {COLLECTION_POIS} from "../App";

export function firebaseDocIntoPoiObject(document) {
    return {
        id: document.id,
        ...document.data()
    }
}

export default function usePoiCollection(){
    let [poisCollection, setPoisCollection] = useState(null);

    useEffect(() => {
        const db = firebase.firestore();
        const collection = db.collection(COLLECTION_POIS);

        const unsubscribe = collection.onSnapshot(
            snapshot => {
                setPoisCollection(snapshot.docs.map(firebaseDocIntoPoiObject));
            },
            console.error
        )

        // Unsubscribe to changes on unmount to not leak a listener
        return () => unsubscribe();
    }, []);

    return poisCollection;
}