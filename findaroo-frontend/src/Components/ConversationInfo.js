import React, { useEffect, useState } from "react";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { FaRegTrashCan } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import Popup from "./Popup";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from 'emoji-picker-react';
import TimeZoneHelper from "./TimeZoneHelper";

export function MessageStyle({messageInfo}){
    //console.log(messageInfo.date_modified)
    const [userName, setUserName] = useState();
    const [lastDate, setLastDate] = useState(null);
    const [isVisible, setVisible] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [showSuggestionMode, setShowSuggestionMode] = useState(false);
    const [userHasNotReacted, setUserHasNotReacted] = useState(true);
    const [myReaction, setMyReaction] = useState();
    const [messageReactions, setMessageReactions] = useState(null);
    const [reactionCount, setReactionCount] = useState(null);

    const closePopup = () => {
        setIsPopupOpen(false);
    }

    const date = new Date(messageInfo.date_modified);

    useEffect(() => {
        // Get the name of the user who made this message
        console.log("POST Call")
        fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ids: [messageInfo.user_id]})
        }).then(response => response.json()).then(data => {console.log(data); setUserName(data[0]);}).catch(error => console.log(error));
        getReactions();
    }, [messageInfo.user_id]);

    useEffect(() => {
        fetch(GlobalVariables.backendURL + "/User?user_id=" + GlobalVariables.userCredential.uid)
            .then(e => e.json())
            .then(e => TimeZoneHelper(new Date(messageInfo.date_modified), e.time_zone))
            .then(e => setLastDate(e))
            .catch(error => console.log(error));
    }, [messageInfo.date_modified]);

    return(
        isVisible ?
        <div
            className={"Column drop-shadow-xl my-[1.5vh]" + (messageInfo.user_id === GlobalVariables.userCredential.uid ? " End bg-blue-200 ml-auto" : " Start bg-gray-200  mr-auto")}>
            <Popup isOpen={isPopupOpen} closePopup={closePopup}>
                <h2>Delete Message</h2>
                <p>Are you sure you want to delete this message?</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={deleteMessage}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={closePopup}>Cancel</button>
                </div>
            </Popup>
            {messageInfo.user_id === GlobalVariables.userCredential.uid ? <RxCross1 onClick={() => setIsPopupOpen(true)}/> : <div></div>}
            <div className="Row">
                <h3>{userName}</h3>
                <h3>{lastDate}</h3>
            </div>
            <h2>{messageInfo.message_text}</h2>
            {showSuggestionMode && <EmojiPicker onEmojiClick={(emojiData, event) => {
                sendReaction(emojiData);
                setShowSuggestionMode(false);
                setUserHasNotReacted(false);
            }}/>}
            <div className="Row Start" onClick={() => console.log("debug")}>
                {
                    messageReactions && reactionCount && messageReactions.map((reaction, i) => (
                        <MessageReaction emoji={reaction} count={reactionCount[i]}/>
                    ))
                }
                {
                    userHasNotReacted && 
                    <div className="Row Start outline-offset-5 outline rounded-lg" onClick={() => setShowSuggestionMode(!showSuggestionMode)}>
                        <CiFaceSmile />
                        +
                    </div>
                }
                
            </div>
        </div>
        :
        <div></div>
    );

    function MessageReaction({emoji, count}) {
        return (
            <div 
                className={`Row Start outline-offset-5 ${emoji == myReaction ? "outline-double" : "outline"} rounded-lg`} 
                onClick={() => {
                    if (emoji == myReaction) {
                        removeReaction();
                    };
                }}
            >
                {`${emoji} ${count}`}
            </div>
        );
    }

    async function getReactions() {
        const response = await fetch(`${GlobalVariables.backendURL}/MessageReaction?messageId=${messageInfo.message_id}`, {
            method: 'GET',
            credentials: 'include'
        }).catch(error => {
            console.log(error);
        })
        const data = await response.json()
        .catch(error => {
            console.log(error);
        });

        if (data == null) return;

        var reactionList = [];
        var countList = [];
        
        for (const r of data.messageReactions) {
            if (r.user_id == GlobalVariables.userCredential.uid) {
                setUserHasNotReacted(false);
                setMyReaction(r.react_emoji);
            }
            var index = reactionList.indexOf(r.react_emoji);
            if (index != -1) {
                countList[index]++;
            } else {
                reactionList.push(r.react_emoji);
                countList.push(1);
            }
        }
        setMessageReactions(reactionList);
        setReactionCount(countList);
    }

    async function sendReaction(emojiData) {
        await fetch(GlobalVariables.backendURL + "/MessageReaction", {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "messageId": messageInfo.message_id,
                "messageReactionEmoji": emojiData.emoji
            })
        })
        getReactions();
    }

    async function removeReaction() {
        await fetch(GlobalVariables.backendURL + "/MessageReaction", {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "messageId": messageInfo.message_id
            })
        })
        getReactions();
        setUserHasNotReacted(true);
    }

    async function deleteMessage() {
        await fetch(GlobalVariables.backendURL + "/Conversation/message", {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'message_id': messageInfo.message_id})
        }).catch(error => console.log(error));
        setVisible(false);
    }
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