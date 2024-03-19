import React from "react";
import './PersonInfo.css';
import ButtonStandard, { ButtonImportant } from "./Buttons";
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import {getAuth} from 'firebase/auth';
import { Link } from "react-router-dom";

export function InvitationInfo({invitationDict, isSender, thisUserName}) {
    const [visible, setVisible] = useState(true);
    const auth = getAuth();

    if (invitationDict == null){
        return;
    }

    return (
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]">
            <img className="object-scale-down w-24 h-24" src={invitationDict.image}
                alt={`${invitationDict.name}'s profile picture`} />
            <div className="Column Start">
                    <h2>
                        {invitationDict.name}
                    </h2>
            </div>
            <h3 className="Column End">
                <Link
                    to={{
                        pathname: `/Profile/MyRooms/RoommateAgreement`,
                    }}
                    state={
                        {
                            'name': invitationDict.name, 
                            'receiver_id': isSender ? invitationDict.user_id : auth.currentUser.uid,
                            'receiver_name': isSender ? invitationDict.name : thisUserName,
                            'room_id': invitationDict.room_id,
                            'sender_id': isSender ? auth.currentUser.uid : invitationDict.user_id,
                            'sender_name': isSender ? thisUserName : invitationDict.name,
                            'is_sender': isSender,
                            'agreement_form': invitationDict.agreement_form
                        }
                    }
                    >
                        <ButtonImportant text="Review Roommate Agreement"/>
                </Link>
            </h3>
        </div>
    );
}