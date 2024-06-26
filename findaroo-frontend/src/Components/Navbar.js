import React, {useEffect} from 'react';
import logo from '../Findaroo.png';
import "./Navbar.css"
import {ButtonImportant, ButtonTransparent} from './Buttons';
import {Link} from "react-router-dom";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Notification } from './Notification';


const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed w-full z-10 top-0 drop-shadow-xl">
            <ul style={{
                'listStyleType': 'none',
                margin: 0,
                padding: '0.5vw',
                'paddingTop': '0.75vw',
                overflow: 'hidden',
            }}>
                <li>
                    <Link to="/">
                        <img src={logo} alt="Findaroo" align="left"/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    {
                        GlobalVariables.authenticated ?
                        <ButtonTransparent text={"Log Out"} onClickFunction={() => {
                            GlobalVariables.authenticated = false;
                            GlobalVariables.isMod = false;
                            const auth = getAuth();
                            signOut(auth);
                            document.cookie = "idToken=\"\"; max-age=0; path=/";
                            navigate("/Login");
                        }}/>
                        :
                        <ButtonTransparent text={"Log In"} onClickFunction={() => {
                            navigate("/Login");
                        }}/>
                    }
                </li>
                {
                    GlobalVariables.authenticated ?
                    <Notification></Notification> : 
                    <div></div>
                }
                <li style={{float: "right"}}>
                    <Link to="/Profile">
                        <ButtonTransparent text={"Profile"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Conversations">
                        <ButtonTransparent text={"Conversations"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Calendar">
                        <ButtonTransparent text={"Calendar"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Search">
                        <ButtonTransparent text={"Search"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/FAQs">
                        <ButtonTransparent text={"FAQs"}/>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;