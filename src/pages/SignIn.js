// Configure FirebaseUI.
import { firebase } from "../initFirebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup, Input, Label,
  Row
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
    <div style={{ backgroundImage: 'url("/imageFondLogin.jpg")'}}>
      <h1>Welcome to the Finges trip 2021</h1>

     <div className="App" >

      <Row>

        <Card >

          <h4>Sign in</h4>
        <Form>
          <FormGroup >
            <Label for="exampleEmail">Email</Label>
            <Input type="email" name="email" id="exampleEmail" placeholder="Email" />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input type="password" name="password" id="examplePassword" placeholder="Password" />
          </FormGroup>

        </Form>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Card>
      </Row>

    </div>
    </div>

  );
}
