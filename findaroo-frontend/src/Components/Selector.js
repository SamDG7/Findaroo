import React from "react";
import './InputFields.css';

export default function Selector({name, values, onChangeFunction}) {
    return (
        <div className="Row Start">
            <h3>
                {name}
            </h3>
            <select className="InputStandard" onChange={onChangeFunction}>
                {
                    values.map((value, index) => (
                        <option key={index} value={value}>{value}</option>
                    ))
                }
            </select>
        </div>
    );
}