// Configure FirebaseUI.
import { firebase } from "../initFirebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import {COLLECTION_USERS} from "../App";

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

        // No need to handle anything in this function. The folders are created dynamically when a file is uploaded to
        // the firebase cloud storage service
      }

      createUserData();

      return false;
    },
  },
};

export default function SignIn() {
  return (
    <>
      <h4 style={{textAlign: "center"}}>Sign in</h4>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </>
  );
}
