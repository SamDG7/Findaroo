import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { ButtonImportant } from "./Buttons";
import { getAuth } from "@firebase/auth";

export default function ConversationInfo({conversationDict}) {
    const peopleArr = conversationDict.user_ids;
    const lastMessage =  conversationDict.messages[-1];

    if (!conversationDict) {
        return;
    }
    return (
        <div className="Row Start">
            <div className="Column Start">
                <h2>
                    {peopleArr.map((person, index) => (
                        person.uid + " "
                    ))}
                </h2>
                <h3>
                    {lastMessage.text}
                </h3>
            </div>
            <h1 className="Column End">
                {lastMessage.date_created}
            </h1>
        </div>
    );
}

// Only show the most recent message and people in the conversation
export function ConversationInfoSmall({conversationDict}) {
    const peopleArr = conversationDict.user_ids;
    const lastMessage =  conversationDict.messages[-1];

    if (!conversationDict) {
        return;
    }
    return (
        <div className="Row Start">
            <div className="Column Start">
                <h2>
                    {peopleArr.map((person, index) => (
                        person.uid + " "
                    ))}
                </h2>
                <h3>
                    {lastMessage.text}
                </h3>
            </div>
            <h1 className="Column End">
                {lastMessage.date_created}
            </h1>
        </div>
    );
}