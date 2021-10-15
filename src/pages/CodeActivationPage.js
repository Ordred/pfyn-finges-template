import {firebase} from '../initFirebase';
import {useEffect, useState} from "react";
import {COLLECTION_POIS, COLLECTION_USERS} from "../App";
import {firebaseDocIntoPoiObject} from "../hooks/usePoiCollection";

export default function CodeActivationPage(props) {
    // Unauthenticated users are kept from executing this component by the AuthenticatedRoute HoC

    let code = props.match.params.code;

    let [redirectUrl, setRedirectUrl] = useState(null);
    let [loadError, setLoadError] = useState(null);

    useEffect(() => {
        async function executeFirestoreTxn(){
            // POI loading logic, see comment below on the reasoning why the PoI is loaded manually
            const db = firebase.firestore();
            const reference = db.collection(COLLECTION_POIS).doc(code);
            let poiData;

            try{
                // We don't need a snapshot with live update capabilities. We are querying the data and using it for something
                // else. Plus, the user will leave this page soon anyway, making the live update capability useless
                poiData = await reference.get();
            } catch (e) {
                console.error("Couldn't query database for PoI", e);
                setLoadError("Failed to query database");
                return;
            }

            if(!poiData.exists){
                setLoadError("Not found");
                return;
            }

            // Note: this shouldn't return undefined since we have checked for the existence of
            // the document we want to retrive
            console.assert(poiData.data() !== undefined, "Point of interest data is undefined even after verification");
            const poi = firebaseDocIntoPoiObject(poiData);

            // POI unlocking logic

            // Note: we have checked if the user is currently logged in before loading the point of interest. This
            // should not be null
            const currentUser = firebase.auth().currentUser;
            console.assert(currentUser !== null);
            const userId = currentUser.uid;

            const userDataRef = db.collection(COLLECTION_USERS)
                .doc(userId);

            let userData;

            try {
                userData = (await userDataRef.get()).data();
            } catch (e) {
                console.error("Couldn't query database for user", e);
                setLoadError("Failed to query user data");
                return;
            }

            // We could assume that the user data is always present. I would much rather raise an assertion error in the
            // console whenever this assumption is not held.
            console.assert(userData !== undefined, `User data on user ${userId} is undefined`);
            console.assert(userData.discovered instanceof Array, 'Entry `unlocked` in user data is not an array');

            if(userData.discovered.indexOf(poi.id) !== -1){
                setRedirectUrl(poi.url);
                return;
            }

            userData.discovered.push(poi.id);
            await userDataRef.update(userData);

            console.log("Updated user")
            setRedirectUrl(poi.url);
        }

        executeFirestoreTxn();
        // We don't have any "live" snapshots loaded into memory, we can safely
        // finish this effect without worrying about leaking listeners
    }, [code]);

    if (redirectUrl === null){
        if (loadError !== null){
            return <p>Failed to load point of interest: {loadError}</p>
        }

        return <p>Loading point of interest with code {code}</p>;
    } else {
        window.location.replace(redirectUrl);

        return <p>
            Redirecting to multi-media content. <a href={redirectUrl}>Click here</a> if you are not redirected.
        </p>
    }
}