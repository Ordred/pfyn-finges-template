import {firebase} from '../initFirebase';
import {useAuth} from "../context/AuthContext";

export function CodeActivationPage(props) {
    let {isAuthenticated} = useAuth();
    console.log(isAuthenticated, props.match);
    return null;
}