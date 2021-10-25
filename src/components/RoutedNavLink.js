import {NavLink} from "react-router-dom";

export default function RoutedNavLink({children, ...rest}) {


    return(
        <NavLink {...rest} className="nav-link">
            {children}
        </NavLink>
    )
}