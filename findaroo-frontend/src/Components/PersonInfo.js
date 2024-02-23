import React, {useEffect, useState} from "react";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";

export default function PersonInfo({personDict}) {
    const [image, setImage] = useState();

    useEffect(() => {
        if (personDict != null) {
            GetImage(personDict);
        }
    }, [personDict]);

    const GetImage = async function() {
        const imageResponse = await fetch("http://localhost:5019/Image?user_id=" + personDict.user_id);
        const blob = await imageResponse.blob();
        const source = URL.createObjectURL(blob);
        setImage(source);
    }

    if (!personDict) {
        return;
    }
    return (
        <div className="Row Start">
            <img className="ProfileImage" src={image}
                 alt={personDict.first_name + " " + personDict.last_name + "'s profile picture"}/>
            <div className="Column Start">
                <h1>
                    {personDict.first_name + " " + personDict.last_name}
                </h1>
                <h2>
                    {(personDict.state ? personDict.state + ", " : "") + personDict.country}
                </h2>
                <h2>
                    {(!(personDict.school === null || personDict.school === "")
                        ? "Student" + " at " + personDict.school
                        : "")
                    }
                </h2>
                <h2>
                    {(!(personDict.company === null || personDict.company === "")
                        ? "Employee" + " at " + personDict.company
                        : "")
                    }
                </h2>
                <h2>
                    {personDict.preferences}
                </h2>
            </div>
            <h1 className="Column End">
                {personDict.rating >= 0 ? personDict.rating + "/5" : "Unrated"}
            </h1>
        </div>
    );
}



export function PersonInfoSmall({personDict}) {
    const [image, setImage] = useState();

    useEffect(() => {
        if (personDict != null) {
            GetImage(personDict);
        }
    }, [personDict]);

    const GetImage = async function() {
        const imageResponse = await fetch("http://localhost:5019/Image?user_id=" + personDict.user_id);
        const blob = await imageResponse.blob();
        const source = URL.createObjectURL(blob);
        setImage(source);
    }

    if (!personDict) {
        return;
    }
    return (
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]">
            <img className="ProfileImageSmall" src={image}
                 alt={personDict.first_name + " " + personDict.last_name + "'s profile picture"}/>
            <div className="Column Start">
                <h3>
                    {personDict.first_name + " " + personDict.last_name}
                </h3>
                <h4>
                    {(!(personDict.school === null || personDict.school === "")
                        ? "Student" + " at " + personDict.school
                        : "") +
                        (!(personDict.company === null || personDict.company === "") &&
                        !(personDict.school === null || personDict.school === "")
                            ? " and "
                            : "")
                        +
                        (!(personDict.company === null || personDict.company === "")
                            ? "Employee" + " at " + personDict.company
                            : "")
                    }
                </h4>
                <h4>
                    {personDict.preferences}
                </h4>
            </div>
            <h3 className="Column End">
                {personDict.rating >= 0 ? personDict.rating + "/5" : "Unrated"}
            </h3>
        </div>
    );
}