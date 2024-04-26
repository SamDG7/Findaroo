import React, { useEffect, useState } from "react";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import TimeZoneHelper from "./TimeZoneHelper";

export function MessageStyle({messageInfo}){

    const [userName, setUserName] = useState();
    const [lastDate, setLastDate] = useState(null);

    useEffect(() => {
        // Get the name of the user who made this message
        console.log("POST Call")
        fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ids: [messageInfo.user_id]})
        }).then(response => response.json()).then(data => {console.log(data); setUserName(data[0]);}).catch(error => console.log(error)).then(
            // Get the correct time zone

        );
    }, [messageInfo.user_id]);

    useEffect(() => {
        fetch(GlobalVariables.backendURL + "/User?user_id=" + GlobalVariables.userCredential.uid)
            .then(e => e.json())
            .then(e => TimeZoneHelper(new Date(messageInfo.date_modified), e.time_zone))
            .then(e => setLastDate(e))
            .catch(error => console.log(error));
    }, [messageInfo.date_modified]);

    return(
        <div
            className={"Column drop-shadow-xl my-[1.5vh]" + (messageInfo.user_id === GlobalVariables.userCredential.uid ? " End bg-blue-200 ml-auto" : " Start bg-gray-200  mr-auto")}>
            <div className="Row">
                <h3>{userName}</h3>
                <h3>{lastDate}</h3>
            </div>
            <h2>{messageInfo.message_text}</h2>
        </div>
    );
}

// Only show the most recent message and people in the conversation
export function ConversationInfoSmall({conversationDict}) {
    const navigate = useNavigate();

    const uidArr = conversationDict.user_ids;
    const [peopleArr, setPeopleArr] = useState([]);
    const [lastMessage, setLastMessage] = useState();
    const [lastDate, setLastDate] = useState(null);

    useEffect(() => {
        console.log("POST Call")
        fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ids: uidArr})
        }).then(response => response.json()).then(data => {console.log(data); setPeopleArr(data);}).catch(error => console.log(error));

        // Get most recent message
        console.log("GET Call")
        fetch('http://localhost:5019/Conversation/messages?conversation_id=' + conversationDict.conversation_id)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLastMessage(data[data.length - 1]);
            }).catch(error => console.error(error));
    }, [conversationDict.conversation_id, uidArr]);

    useEffect(() => {
        if (lastMessage){
            fetch(GlobalVariables.backendURL + "/User?user_id=" + GlobalVariables.userCredential.uid)
                .then(e => e.json())
                .then(e => TimeZoneHelper(new Date(lastMessage.date_modified), e.time_zone))
                .then(e => setLastDate(e))
                .catch(error => console.log(error));
        }
    }, [lastMessage]);

    if (!conversationDict || peopleArr === []) {
        return;
    }

    const dateString = lastMessage && lastDate ? "Last Message: " + lastDate : "Conversation Created: " + conversationDict.date_modified;

    return (
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]"
             onClick={() => navigate("/Conversations/" + conversationDict.conversation_id)}>
            <div className="Column Start">
                <h2>
                    {peopleArr.map((personName, index) => (
                        personName + (index < peopleArr.length - 1 ? ", " : "")
                    ))}
                </h2>
            </div>
            <div className="Column">
                {lastMessage && <MessageStyle messageInfo={lastMessage}/>}
            </div>
            <div className="Column End">
                <h3>
                    {dateString}
                </h3>
            </div>
        </div>
    );
}