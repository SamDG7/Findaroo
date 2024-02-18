import React, {useState} from "react";
import './InputFields.css';

import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

export default function InputStandard({name, defaultValue, onChangeFunction}) {
    return (
        <div className="Row">
            <h3>
                {name}
            </h3>
            <input className="InputStandard" name={name} value={defaultValue} onChange={onChangeFunction}/>
        </div>
            );
}

export function InputPassword({name, defaultValue, onChangeFunction}) {

    const [showPassword, setShowPassword] = useState(false);
    const [icon, setIcon] = useState(eyeOff);

    const togglePasswordVisibility = () => {
        if (!showPassword) {
           setIcon(eye);
           setShowPassword(true)
        } else {
           setIcon(eyeOff)
           setShowPassword(false)
        }
     }

    return (
        <div className="Row">
            <h3>
                {name}
            </h3>
            <input 
                className="InputStandard"
                name={name}
                type={showPassword ? "text" : "password"}
                value={defaultValue}
                onChange={onChangeFunction}
            />
            <span class="flex justify-around items-center" onClick={togglePasswordVisibility}>
                <Icon class="absolute mr-10" icon={icon} size={25}/>
            </span>
        </div>
    );
}

export function InputImportant({name, defaultValue, onChangeFunction}) {
    return (
        <div>
            <h1>
                {name}
            </h1>
            <input className="InputImportant" name={name} value={defaultValue} onChange={onChangeFunction}/>
        </div>
    );
}