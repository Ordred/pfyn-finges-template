// Configure FirebaseUI.
import { firebase } from "../initFirebase";
import { StyledFirebaseAuth } from "react-firebaseui";

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
        let users = db.collection('users');
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
    <div className="App">
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}
