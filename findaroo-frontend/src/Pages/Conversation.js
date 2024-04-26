import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard from "../Components/Buttons";
import {MessageStyle} from "../Components/ConversationInfo";
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmileFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { useRef } from "react";
import {MessageAddDelete} from "../Components/MessageAddDelete";

export default function Conversations() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [conversationData, setConversationData] = useState(null);
    const [conversationMessages, setConversationMessages] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messageInput = useRef();

    const [connections, setConnections] = useState(null);
    const { cid } = useParams();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);
    
    useEffect(() => {
        if (conversationData != null && !conversationData.user_ids.includes(GlobalVariables.userCredential.uid)) {
            console.log("UIDS:")
            console.log(conversationData.user_ids)
            console.log(GlobalVariables.userCredential.uid)
            navigate("/Conversations")
        }
    }, [conversationData]);

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

        getConnections();
    }, [cid]);

    if (!conversationData || !conversationMessages) {
        return;
    }

    return (
        <div className="Page">
            <Navbar />

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <div className="Row">
                        <MessageAddDelete conversationDict={conversationData} connectionDict={connections}/>
                    </div>
                    {conversationMessages.map((message, index) => (
                        <MessageStyle messageInfo={message} key={index}/>
                    ))}
                    {
                        showEmojiPicker ? 
                        <div position="absolute">
                            <EmojiPicker 
                                onEmojiClick={(emojiData, event) => {
                                    messageInput.current.value = messageInput.current.value + emojiData.emoji;
                                    setNewMessage(newMessage + emojiData.emoji);
                                }
                            }></EmojiPicker>
                        </div>
                        :
                        <div></div>
                    }
                    <div className="Row">
                        {
                            //I have to expand this InputStandard to add a useRef (yeah it's kinda scuffed)
                        }
                        <div className="Row">
                            <h3 style={{width: "10vw", textAlign: "right"}}>
                            </h3>
                            <input
                                className="InputStandard"
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="..."
                                ref={messageInput}
                            />
                        </div>
                        <IconContext.Provider value={{ color: '#ffd800', size: '1.5em'}}>
                            <div>
                                <BsEmojiSmileFill onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                            </div>
                        </IconContext.Provider>
                        <ButtonStandard text="Send Message" onClickFunction={sendMessage}/>
                    </div>
                </div>
            </div>
        </div>
    );

    async function sendMessage() {
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

    async function getConnections() {
        const connectionResponse = await fetch(`${GlobalVariables.backendURL}/Connection?user_id=${GlobalVariables.userCredential.uid}`);
        const connectionBody = await connectionResponse.json();

        var idList = [];
        connectionBody.forEach(element => {
            if (element['user_1_id'] == GlobalVariables.userCredential.uid) {
                idList.push(element['user_2_id'])
            } else {
                idList.push(element['user_1_id'])
            }
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
                "Content-Type": "application/json",
            }
        }).then(response => response.json());

        var nameIdImageList = nameList.map((name, i) => ({'name':name, 'image':imageList[i], 'user_id':idList[i]}));
        setConnections(nameIdImageList);
    }
}