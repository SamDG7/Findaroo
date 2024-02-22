import React from "react";
import './PersonInfo.css';
import { ButtonImportant } from "./Buttons";
import {getAuth} from 'firebase/auth';
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";

export function ConnectionInfo({connectionDict}) {
    const auth = getAuth();
    const [on, setData] = useState(true);

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
                <h3 className="Column End">
                    <ButtonImportant text={"Unfriend"} onClickFunction={unfriend}></ButtonImportant>
                </h3>
            </div>
        );
    }
    else {
        return;
    }
    

    async function unfriend() {
        await fetch(GlobalVariables.backendURL + "/Connection", {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"user_1_id": connectionDict.user_id, "user_2_id": auth.currentUser.uid})
        }).catch(error => console.log(error));
        setData(false);
    }
}