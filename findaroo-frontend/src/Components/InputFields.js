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
            <input
                className="InputStandard"
                name={name}
                value={defaultValue}
                onChange={onChangeFunction}
                placeholder="..."
            />
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
                placeholder="..."
            />
            <span className="flex justify-around items-center" onClick={togglePasswordVisibility}>
                <Icon className="absolute mr-10" icon={icon} size="1.5vw"/>
            </span>
        </div>
    );
}

export function InputImportant({name, defaultValue, onChangeFunction}) {
    return (
        <div className="Row">
            <h3>
                {name}
            </h3>
            <input className="InputImportant" name={name} value={defaultValue} onChange={onChangeFunction}
                   placeholder="..."/>
        </div>
    );
}

export function InputBox({name, defaultValue, onChangeFunction}) {
    return (
        <div className="Row Start">
            <h3>
                {name}
            </h3>
            <textarea className="InputBox" name={name} value={defaultValue} onChange={onChangeFunction}
                    placeholder="..."/>
        </div>
    );
}

export function InputImage({onChangeFunction}){
    return (
        <div className="Row Start">
            <input className="InputStandard" type="file" accept='image/*' onChange={onChangeFunction}/>
        </div>
    );
}