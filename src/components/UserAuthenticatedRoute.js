import {useAuth} from "../context/AuthContext";
import {Route} from "react-router-dom";
import SignIn from "../pages/SignIn";

export default function AuthenticatedRoute({children, ...rest}) {
    let {isAuthenticated} = useAuth();

    return (
        isAuthenticated
            ? (
                <Route {...rest}>
                    {children}
                </Route>
            ) : (
                <SignIn/>
            )
    )
}