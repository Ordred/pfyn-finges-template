// Configure FirebaseUI.
import { firebase } from "../initFirebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import {COLLECTION_USERS} from "../App";
import {
  Card,
} from "reactstrap";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display E-Mail & GitHub sign-in options
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: ({user}) => {
      async function createUserData() {
        let db = firebase.firestore();
        let users = db.collection(COLLECTION_USERS);
        let userDocumentRef = users.doc(user.uid);
        let userDocument = await userDocumentRef.get();

        if (!userDocument.exists) {
          await userDocumentRef.set({discovered: [], gpx_files: []});
        }
      }

      createUserData();

      return false;
    },
  },
};

export default function SignIn() {
  return (

      <div className="App" style={{ backgroundImage: 'url("/imageFondLogin.jpg")'}} >

      <h1>Welcome to the Finges trip 2021</h1>




        <Card >

          <h4>Sign in </h4>

            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Card>


    </div>


  );
}
