import React, {useState} from 'react';
import {Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Nav, NavbarText, Button} from "reactstrap";
import { NavLink as RRNavLink } from 'react-router-dom';
import {firebase} from "../initFirebase";
import {useAuth} from "../context/AuthContext";

const Navigation = (props) => {

    const [collapsed, setCollapsed] = useState(true);
    const {isAdmin} = useAuth();

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
                            <NavLink to="/map/walk-history" activeClassName="active" tag={RRNavLink}>Map Walk History</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink to="/map/discovered-points-of-interest" tag={RRNavLink}>Point of interest</NavLink>
                        </NavItem>

                    </Nav>


                </Collapse>
                <NavLink href="https://example.org">{isAdmin ? "Admin" : "user"}</NavLink>
                <NavbarText>
                    <Button onClick={signOut} outline color="secondary">Logout</Button>{' '}
                </NavbarText>
            </Navbar>
        </div>
    );
}

export default Navigation;