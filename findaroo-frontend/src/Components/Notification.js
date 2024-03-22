import React, {useEffect} from 'react';
import logo from '../Findaroo.png';
import "./Navbar.css"
import "./Notification.css"
import { useState } from 'react';
import {ButtonImportant, ButtonTransparent} from './Buttons';
import {Link} from "react-router-dom";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Dropdown, DropdownButton } from 'react-bootstrap';

export function Notification() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <li style={{float: "right"}}>
            <div>
                <div className='notification-button' onClick={() => setShowDropdown(!showDropdown)}>
                    <img
                        className="bell"
                        src="https://static-00.iconduck.com/assets.00/notification-bell-icon-1775x2048-y1w4ovo2.png"
                    ></img>
                </div>
                <div className={`dropdown-menu ${showDropdown ? 'active' : 'inactive'}`}>
                    <ul>
                        <NotificationItem></NotificationItem>
                        <NotificationItem></NotificationItem>
                    </ul>
                </div>
            </div>
            
        </li>
    );
}

function NotificationItem() {
    return (
        <li className='notification-item'>
            <div className='Row Start'>
                <img src="https://static-00.iconduck.com/assets.00/notification-bell-icon-1775x2048-y1w4ovo2.png"></img>
                <div className='Column Start'>
                    <h2>Test</h2>
                    <h3>Today</h3>
                </div>
            </div>
        </li>
    )
}