import React, {useEffect} from 'react';
import logo from '../Findaroo.png';
import "./Navbar.css"
import "./Notification.css"
import { useState, useRef } from 'react';
import {ButtonImportant, ButtonTransparent} from './Buttons';
import {Link} from "react-router-dom";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate} from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Dropdown, DropdownButton } from 'react-bootstrap';

export function Notification() {
    const auth = getAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const [seenNotification, setSeenNotification] = useState(false);
    const scrollbar = useRef(null);

    useEffect(() => {
        scrollbar.current.addEventListener('scroll', (event) => {
            if (Math.abs(scrollbar.current.scrollHeight - scrollbar.current.scrollTop - scrollbar.current.clientHeight) < 1) {
                //console.log('debug');
            }
        })
        getNotifications();
        console.log(notificationData);
    }, []);

    useEffect(() => {
        if (showDropdown && !seenNotification) {
            recordNotificationAsSeen();
            setSeenNotification(true);
        }
    }, [showDropdown]);

    return (
            <div>
                <div className='notification-button' onClick={() => setShowDropdown(!showDropdown)}>
                    <img
                        className="bell"
                        src="https://static-00.iconduck.com/assets.00/notification-bell-icon-1775x2048-y1w4ovo2.png"
                    ></img>
                </div>
                <div 
                    ref={scrollbar} 
                    className={`dropdown-menu ${showDropdown ? 'active' : 'inactive'}`}
                >
                    <ul>
                        {notificationData.map((n, i) => (
                            <NotificationItem prop={n}></NotificationItem>
                        ))}
                    </ul>
                </div>
            </div>
    );

    async function getNotifications() {
        const response = await fetch(GlobalVariables.backendURL + "/Notification", {
            credentials:'include'
        });
        const data = await response.json();

        if (data.length == 0) {
            return;
        }

        var idList = [];
        data.forEach(element => {
            idList.push(element["sender_id"])
        });

        var imageList = [];

        for (const id of idList) {
            var imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
            var blob = await imageResponse.blob();
            imageList.push(URL.createObjectURL(blob));
        }

        var nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            body: JSON.stringify({"ids": idList}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json());

        setNotificationData(data.map((d, i) => ({
            'notification': d,
            'name': nameList[i],
            'image': imageList[i]
        })))
    }

    async function recordNotificationAsSeen() {
        await fetch(GlobalVariables.backendURL + "/Notification", {
            method: 'POST',
            credentials: 'include'
        })
    }
}

function NotificationItem({prop}) {
    const navigate = useNavigate();
    return (
        <li onClick={() => navigate("/Profile")}>
            <div className={`Row Start notification-item ${prop.notification.seen ? 'seen' : 'not-seen'}`}>
                <img src={prop.image}></img>
                <div className='Column Start'>
                    <h2>{getMessage(prop.name, prop.notification.type)}</h2>
                    <h3>{prop.notification.date_created    
                            .substring(0, prop.notification.date_created.indexOf('T'))}
                    </h3>
                </div>
            </div>
        </li>
    )

    function getMessage(name, type) {
        const notificationType = {
            Message: 0,
            ConnectionRequest: 1,
            ConnectionRequestAccepted: 2,
            RoommateInvitation: 3,
            RoommateInvitationAccepted: 4
        }

        switch(type) {
            case notificationType.ConnectionRequest:
                return `${name} sent you a connection request.`
            case notificationType.ConnectionRequestAccepted:
                return `${name} accepted your connection request.`
            case notificationType.RoommateInvitation:
                return `${name} sent you a roommate invitation.`
            case notificationType.RoommateInvitationAccepted:
                return `${name} accepted your roommate invitation.`
            default:
                return 'Invalid notification type.'
        }
    }
}