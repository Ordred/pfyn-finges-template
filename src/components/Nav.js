import React, {useState} from 'react';
import {Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, NavbarText} from "reactstrap";
import {firebase} from "../initFirebase";

const Navigation = (props) => {

    const [collapsed, setCollapsed] = useState(true);

    //const { isAdmin, isAuthenticated } = useAuth();

    // Log out of the application
    const signOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (e) {
            console.error(e);
        }
    };


    const toggleNavbar = () => setCollapsed(!collapsed);

    return (
        <div>
            <Navbar color="faded" light expand="md">
                <NavbarBrand href="/" className="mr-auto">Finges</NavbarBrand>
                <NavbarToggler onClick={toggleNavbar} className="mr-2"/>
                <Collapse isOpen={!collapsed} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href="/map/walk-history">Map Walk History</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/map/discovered-points-of-interest">Point of interest</NavLink>
                        </NavItem>

                    </Nav>


                </Collapse>
                <NavLink href="https://example.org">Admin</NavLink>
                <NavbarText>
                    <button onClick={signOut}>Logout</button>
                </NavbarText>
            </Navbar>
        </div>
    );
}

export default Navigation;