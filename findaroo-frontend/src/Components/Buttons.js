import React from 'react';
import './Buttons.css';

export default function ButtonStandard({text, onClickFunction}) {
    if (onClickFunction) {
        return (
            <div className="ButtonStandard">
                <button onClick={onClickFunction}><b>{text}</b></button>
            </div>
        );
    } else {
        return (
            <div className="ButtonStandard">
                <button><b>{text}</b></button>
            </div>
        );
    }
}

export function ButtonImportant({text, onClickFunction}) {
    if (onClickFunction) {
        return (
            <div className="ButtonImportant">
                <button onClick={onClickFunction}><b>{text}</b></button>
            </div>
        );
    } else {
        return (
            <div className="ButtonImportant">
                <button><b>{text}</b></button>
            </div>
        );
    }
}

export function ButtonTransparent({text, onClickFunction}) {
    if (onClickFunction) {
        return (
            <div className="ButtonTransparent">
                <button onClick={onClickFunction}><b>{text}</b></button>
            </div>
        );
    } else {
        return (
            <div className="ButtonTransparent">
                <button><b>{text}</b></button>
            </div>
        );
    }
}