import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard from "../Components/Buttons";
import {MessageStyle} from "../Components/ConversationInfo";

export default function Conversations() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [conversationData, setConversationData] = useState(null);
    const [conversationMessages, setConversationMessages] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const { cid } = useParams();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {

        console.log("GET Call")
        fetch('http://localhost:5019/Conversation?conversation_id=' + cid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setConversationData(data);
            }).catch(error => console.error(error));

        console.log("GET Call")
        fetch('http://localhost:5019/Conversation/messages?conversation_id=' + cid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setConversationMessages(data);
            }).catch(error => console.error(error));

    }, []);

    if (!conversationData || !conversationMessages) {
        return;
    }

    const peopleArr = conversationData.user_ids;

    return (
        <div className="Page">
            <Navbar />

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    {conversationMessages.map((message, index) => (
                        <MessageStyle messageInfo={message} key={index}/>
                    ))}
                    <div className="Row">
                        <InputStandard onChangeFunction={(e) => setNewMessage(e.target.value)}/>
                        <ButtonStandard text="Send Message" onClickFunction={sendMessage}/>
                    </div>
                </div>
            </div>
        </div>
    );

    async function sendMessage(){
        console.log("Attempting to create message '" + newMessage + "'");
        await fetch(GlobalVariables.backendURL + "/Conversation/messages", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({conversation_id: conversationData.conversation_id, user_id: GlobalVariables.userCredential.uid, message_text: newMessage})
        }).catch(error => console.log(error));

        // This updates the current messages page
        console.log("GET Call")
        fetch('http://localhost:5019/Conversation/messages?conversation_id=' + cid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setConversationMessages(data);
            }).catch(error => console.error(error));
    }
}