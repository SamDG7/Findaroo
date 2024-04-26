import React, {useEffect, useState} from "react";
import './InputFields.css';
import GlobalVariables from "../Utils/GlobalVariables";

export default function Selector({name, values, onChangeFunction, defaultValue}) {
    const [uniqueValues, setUniqueValues] = useState([]);

    // This removes duplicates
    useEffect(() => {
        const arr = [defaultValue];
        // eslint-disable-next-line array-callback-return
        values.map((item) => {
            const findItem = arr.find((x) => x === item);
            if (!findItem) arr.push(item);
        });
        setUniqueValues(arr);
    }, [values]);

    return (
        <div className="Row Start">
            <h3>
                {name}
            </h3>
            <select className="InputStandard" onChange={onChangeFunction} value={defaultValue}>
                {
                    uniqueValues.map((value, index) =>
                        (
                        value && <option key={value} value={value}>{value}</option>
                    ))
                }
            </select>
        </div>
    );
}