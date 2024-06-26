import React, {useEffect} from 'react';
import "./Navbar.css"
import "./Notification.css"
import { useState, useRef } from 'react';
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate} from "react-router-dom";
import { getAuth } from "firebase/auth";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";

export function Notification() {
    const auth = getAuth();
    const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
    const [notificationData, setNotificationData] = useState([]);
    const [seenNotification, setSeenNotification] = useState(false);
    const [showMessageNotificationDropdown, setShowMessageNotificationDropdown] = useState(false);
    const [messageNotificationData, setMessageNotificationData] = useState([]);
    const [seenMessageNotification, setSeenMessageNotification] = useState(false);
    const notificationScrollbar = useRef(null);

    useEffect(() => {
        notificationScrollbar.current.addEventListener('scroll', (event) => {
            if (Math.abs(notificationScrollbar.current.scrollHeight - notificationScrollbar.current.scrollTop - notificationScrollbar.current.clientHeight) < 1) {
                //console.log('debug');
            }
        })
        getNotifications(true);
        getNotifications(false);
        //console.log(notificationData);
    }, []);

    useEffect(() => {
        if (showNotificationDropdown && !seenNotification) {
            recordNotificationAsSeen();
            setSeenNotification(true);
        }
    }, [showNotificationDropdown]);

    useEffect(() => {
        if (showMessageNotificationDropdown && !seenMessageNotification) {
            recordMessageNotificationAsSeen();
            setSeenMessageNotification(true);
        }
    }, [showMessageNotificationDropdown]);

    return (
        <div>
            <li style={{float: "right"}}>
                <div className='notification-button' onClick={() => {
                        setShowNotificationDropdown(!showNotificationDropdown)
                        setShowMessageNotificationDropdown(false)
                    }
                }>
                    <IoMdNotificationsOutline size={50}/>
                </div>
                <div 
                    ref={notificationScrollbar} 
                    className={`dropdown-menu ${showNotificationDropdown ? 'active' : 'inactive'}`}
                >
                    <ul>
                        {notificationData.map((n, i) => (
                            <NotificationItem prop={n}/>
                        ))}
                    </ul>
                </div>
            </li>
            <li style={{float: "right"}}>
                <div className='notification-button' onClick={() => {
                        setShowMessageNotificationDropdown(!showMessageNotificationDropdown)
                        setShowNotificationDropdown(false)
                    }
                }>
                    <AiFillMessage size={50}/>
                </div>
                <div
                    className={`dropdown-menu ${showMessageNotificationDropdown ? 'active' : 'inactive'}`}
                >
                    <ul>
                        {messageNotificationData.map((n, i) => (
                            <MessageNotificationItem prop={n}/>
                        ))}
                    </ul>
                </div>
            </li>
        </div>
            
    );

    async function getNotifications(getMessageNotification) {
        const data = await fetch(`${GlobalVariables.backendURL}${getMessageNotification ? "/Notification/Message" : "/Notification"}`, {
            credentials:'include'
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return [];
            }
        });

        if (data.length === 0) {
            return;
        }

        var idList = [];
        data.forEach(element => {
            idList.push(element["sender_id"])
        });

        var filteredIdList = Array.from(new Set(idList));

        var imageList = [];

        for (const id of idList) {
            var imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
            var blob = await imageResponse.blob();
            imageList.push(URL.createObjectURL(blob));
        }

        var nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            body: JSON.stringify({"ids": filteredIdList}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json());
        
        var nameDict = {}
        filteredIdList.forEach((id, i) => {
            nameDict[id] = nameList[i];
        })

        if (getMessageNotification) {
            await setMessageNotificationData(data.map((d, i) => ({
                'notification': d,
                'name': nameDict[d.sender_id],
                'image': imageList[i]
            })));
            //console.log(messageNotificationData);
        } else {
            setNotificationData(data.map((d, i) => ({
                'notification': d,
                'name': nameDict[d.sender_id],
                'image': imageList[i]
            })));
        }
    }

    async function recordNotificationAsSeen() {
        await fetch(GlobalVariables.backendURL + "/Notification", {
            method: 'POST',
            credentials: 'include'
        })
    }

    async function recordMessageNotificationAsSeen() {
        await fetch(GlobalVariables.backendURL + "/Notification/Message", {
            method: 'POST',
            credentials: 'include'
        })
    }
}

function NotificationItem({prop}) {
    const navigate = useNavigate();
    const notificationType = {
        Message: 0,
        ConnectionRequest: 1,
        ConnectionRequestAccepted: 2,
        RoommateInvitation: 3,
        RoommateInvitationAcceptedBySender: 4,
        RoommateInvitationAcceptedByReceiver: 5,
        ModDeletedAccount: 6,
        AddedToConversation: 7,
        RemovedFromConversation: 8,
    }

    return (
        <li onClick={() => navigate(getNavigatePath(prop.notification.type))}>
            <div className={`Row Start notification-item ${prop.notification.seen ? 'seen' : 'not-seen'}`}>
                <img src={prop.image}></img>
                <div className='Column Start'>
                    <h3>{getMessage(prop.name, prop.notification.type)}</h3>
                    <h4>{prop.notification.date_created    
                            .substring(0, prop.notification.date_created.indexOf('T'))}
                    </h4>
                </div>
            </div>
        </li>
    )

    function getMessage(name, type) {
        switch(type) {
            case notificationType.ConnectionRequest:
                return `${name} sent you a connection request.`
            case notificationType.ConnectionRequestAccepted:
                return `${name} accepted your connection request.`
            case notificationType.RoommateInvitation:
                return `${name} sent you a roommate invitation.`
            case notificationType.RoommateInvitationAcceptedByReceiver:
                return `${name} accepted your roommate invitation.`
            case notificationType.RoommateInvitationAcceptedBySender:
                return `You now belong to a room with ${name}.`
            case notificationType.AddedToConversation:
                return `You have been added to a conversation`
            case notificationType.RemovedFromConversation:
                return `You have been removed from a conversation`
            case notificationType.ModDeletedAccount:
                return 'Moderator deleted account'
            default:
                return 'Invalid notification type.'
        }
    }

    function getNavigatePath(type) {
        switch(type) {
            case notificationType.ConnectionRequest:
                return '/Profile/MyConnectionRequests'
            case notificationType.ConnectionRequestAccepted:
                return '/Profile/MyConnections'
            case notificationType.RoommateInvitation:
                return 'http://localhost:3000/Profile/MyRooms/RoommateInvitations'
            case notificationType.RoommateInvitationAcceptedByReceiver:
                return '/Profile/MyRooms'
            case notificationType.RoommateInvitationAcceptedBySender:
                return '/Profile/MyRooms'
            case notificationType.AddedToConversation:
                return `/Conversations`
            case notificationType.RemovedFromConversation:
                return `/Conversations`
            default:
                return '/Profile'
        }
    }
}

function MessageNotificationItem({prop}) {
    const navigate = useNavigate();
    //console.log(prop.notification.seen);
    return (
        <li onClick={() => navigate("/Conversations")}>
            <div className={`Row Start notification-item ${prop.notification.seen ? 'seen' : 'not-seen'}`}>
                <img src={prop.image}></img>
                <div className='Column Start'>
                    <h3>{`You have ${prop.notification.count} new messages from ${prop.name}`}</h3>
                    <h4>{prop.notification.date_created    
                            .substring(0, prop.notification.date_created.indexOf('T'))}
                    </h4>
                </div>
            </div>
        </li>
    )
}