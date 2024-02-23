import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";

export default function PersonInfo({ personDict }) {
    if (!personDict) {
        return;
    }
    return (
        <div className="Row Start">
            <img className="ProfileImage" src="https://andysharpe.dev/wp-content/uploads/2024/02/MeGGJ.png"
                alt={personDict.first_name + " " + personDict.last_name + "'s profile picture"} />
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

export function PersonInfoSmall({ personDict }) {
    const navigate = useNavigate();
    const [image, setImage] = useState(undefined);

    if (!personDict) {
        return;
    }
    return (
        <div className="Row Start" onClick={() => navigate("/User/" + personDict.user_id)}>
            <img className="ProfileImageSmall" src={image}
                alt={personDict.first_name + " " + personDict.last_name + "'s profile picture"} />
            <div className="Column Start">
                <Link to="/User" params={{ uid: personDict.user_id }}>
                    <h3>
                        {personDict.first_name + " " + personDict.last_name}
                    </h3>
                </Link>
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