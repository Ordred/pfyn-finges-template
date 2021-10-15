import {useEffect, useState} from "react";
import {firebase} from "../initFirebase";
import {COLLECTION_USERS} from "../App";

export default function useUserData(userId){
    let [userData, setUserData] = useState(null);

    useEffect(() => {
        const db = firebase.firestore();
        const collection = db.collection(COLLECTION_USERS);
        const userDocument = collection.doc(userId);

        const unsubscribe = userDocument.onSnapshot(
            snapshot => { setUserData(snapshot.data()) },
            console.error
        )

        // Unsubscribe to changes on unmount to not leak a listener
        return () => unsubscribe();
    }, [userId]);

    return userData;
}