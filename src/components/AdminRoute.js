import {useAuth} from "../context/AuthContext";
import AuthenticatedRoute from "./UserAuthenticatedRoute";

export default function AdminRoute({children, ...rest}) {
    let {isAdmin} = useAuth();

    // An admin route is a specialized authenticated route
    return (
        <AuthenticatedRoute {...rest}>
            { isAdmin ? children : <p>Access denied</p> }
        </AuthenticatedRoute>
    )
}