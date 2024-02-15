import React from "react";
import { ButtonImportant, ButtonDelete, ButtonStandard } from './Buttons';


export default function Popup({ title, text, onClickFunction }) {
    return (
        <div className="Popup">
            <div className="PopupPanel">
                <h1>{title}</h1>
                <p>{text}</p>
                <ButtonDelete text="Cancel" onClickFunction={() => { onClickFunction(false) }} />
                <ButtonImportant text="Okay" onClickFunction={() => { onClickFunction(true) }} />
            </div>
        </div>
    );
}