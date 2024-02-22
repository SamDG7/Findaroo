import React from "react";
import './PersonInfo.css';
import { ButtonImportant } from "./Buttons";

export function ConnectionInfo({connectionDict}) {
    if (connectionDict == null){
        return;
    }
    
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
                <ButtonImportant text={"Accept"} onClickFunction={accept}></ButtonImportant>
                <ButtonImportant text={"Decline"} onClickFunction={decline}></ButtonImportant>
            </h3>
        </div>
    )

    async function accept() {

    }

    async function decline() {

    }
}