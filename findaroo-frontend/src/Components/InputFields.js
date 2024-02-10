import React from 'react';
import './InputFields.css';

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
    return (
        <div className="Row">
            <h3>
                {name}
            </h3>
            <input className="InputStandard" name={name} type="password" value={defaultValue}
                   onChange={onChangeFunction}/>
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