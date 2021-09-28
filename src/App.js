import "./App.css";

import _ from "lodash";
import { firebase } from "./initFirebase";
import { useAuth } from "./context/AuthContext";
import SignIn from "./pages/SignIn";
import { useEffect, useState } from "react";

// Get the DB object from the firebase app
const db = firebase.firestore();

const COLLECTION_POIS = "pois";

function App() {
  // Get authenticated state using the custom "auth" hook
  const { isAuthenticated, isAdmin } = useAuth();

  // For demo only - store the whole content of your group's DB
  const [poisCollection, setPoisCollection] = useState(null);

  useEffect(() => {
    // Example - POIs of your DB
    const poisCollection = db.collection(COLLECTION_POIS);

    // Subscribe to DB changes
    const unsubscribe = poisCollection.onSnapshot(
      (snapshot) => {
        setPoisCollection(snapshot.docs.map((d) => ({ [d.id]: d.data() })));
      },
      (error) => console.error(error)
    );

    // Unsubscribe on umount
    return () => unsubscribe();
  }, []);

  // Add a new document to the DB
  const addDummyData = async () => {
    // Add a random POI to your group's DB
    const poisCollection = await db.collection(COLLECTION_POIS);

    try {
      await poisCollection.add({
        name: `POI Test ${_.random(500)}`,
      });
    } catch (e) {
      console.error("Could not add new POI");
    }
  };

  // WARNING - Only for debugging purposes, this should not be used in a production environment!
  const cleanDB = async () => {
    const ref = db.collection(COLLECTION_POIS);

    let snapshot = await ref.get();

    for (let doc of snapshot.docs) {
      try {
        await ref.doc(doc.id).delete();
      } catch (e) {
        console.error(`Could not delete document with ID ${doc.id} `);
        console.error(e);
      }
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) return <SignIn />;

  return (
    <div className="App">
      <h1>Welcome to the Pfyn-Finges Forest!</h1>

      <h2>Your role is : {isAdmin ? "Admin" : "User"}</h2>

      <h4>POIs Collection</h4>
      <code style={{ margin: "1em" }}>{JSON.stringify(poisCollection)}</code>

      <div style={{ display: "flex" }}>
        {/* Admin-only tasks */}
        {isAdmin && (
          <>
            <button onClick={addDummyData}>Add Dummy Data</button>
            <button onClick={cleanDB}>Clean DB</button>
          </>
        )}
        <button onClick={signOut}>Logout</button>
      </div>
    </div>
  );
}

export default App;
