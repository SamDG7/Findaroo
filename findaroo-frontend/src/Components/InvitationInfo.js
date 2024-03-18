import React from "react";
import './PersonInfo.css';
import ButtonStandard, { ButtonImportant } from "./Buttons";
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import {getAuth} from 'firebase/auth';
import { Link } from "react-router-dom";

export function InvitationInfo({invitationDict, isSender}) {
    const [visible, setVisible] = useState(true);

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
                            'receiver_id': invitationDict.id,
                            'room_id': invitationDict.room_id,
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