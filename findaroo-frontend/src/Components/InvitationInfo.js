import React from "react";
import './PersonInfo.css';
import ButtonStandard, { ButtonImportant } from "./Buttons";
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import {getAuth} from 'firebase/auth';

export function InvitationInfo({invitationDict}) {
    const [visible, setVisible] = useState(true);

    if (invitationDict == null){
        return;
    }

    return (
        <div className="Row Start">
            <img className="ProfileImageSmall" src={invitationDict.image}
                 alt={`${invitationDict.name}'s profile picture`}/>
            <div className="Column Start">
                <h3>
                    {invitationDict.name}
                </h3>
            </div>
            <div className="Column End">
                <div className="Row">
                    <ButtonImportant text={"Review Roommate Agreement"} onClickFunction={navigateToRoommateAgreement}></ButtonImportant>
                </div>
            </div>
        </div>
    );

    function navigateToRoommateAgreement() {

    }
}