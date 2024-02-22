import React from "react";
import './PersonInfo.css';
import { ButtonImportant } from "./Buttons";
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import {getAuth} from 'firebase/auth';

export function ConnectionRequestInfo({connectionDict}) {
    const [on, setData] = useState(true);
    const auth = getAuth();
    const requestBody = {'sender_id': connectionDict.user_id, 
        'receiver_id': auth.currentUser.uid
    }

    console.log(requestBody)

    if (connectionDict == null){
        return;
    }

    if (on) {
        return (
            <div className="Row Start">
                <img className="ProfileImageSmall" src={connectionDict.image}
                     alt={connectionDict.name + "'s profile picture"}/>
                <div className="Column Start">
                    <h3>
                        {connectionDict.name}
                    </h3>
                </div>
                <div className="Column End">
                    <div className="Row">
                        <ButtonImportant text={"Accept"} onClickFunction={accept}></ButtonImportant>
                        <div className="p-[1vw]"/>
                        <ButtonImportant text={"Decline"} onClickFunction={decline}></ButtonImportant>
                    </div>
                </div>
            </div>
        );
    }
    else 
    {
        return;
    }
    

    async function accept() {
        await fetch(GlobalVariables.backendURL + "/ConnectionRequest/accept", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(requestBody)
        }).catch(error => console.log(error));
        setData(false);
    }

    async function decline() {
        await fetch(GlobalVariables.backendURL + "/ConnectionRequest", {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(requestBody)
        }).catch(error => console.log(error));
        setData(false);
    }
}