import React, {useEffect} from 'react';
import logo from '../Findaroo.png';
import "./Navbar.css"
import {ButtonTransparent} from './Buttons';
import {Link} from "react-router-dom";
import GlobalVariables from "../Utils/GlovalVariables";
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed w-full z-10 top-0">
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
                    <ButtonTransparent text={"Log Out"} onClickFunction={() => {
                        GlobalVariables.authenticated = false;
                        navigate("/Login");
                    }}/>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Profile">
                        <ButtonTransparent text={"Profile"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Messages">
                        <ButtonTransparent text={"Messages"}/>
                    </Link>
                </li>
                <li style={{float: "right"}}>
                    <Link to="/Search">
                        <ButtonTransparent text={"Search"}/>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;