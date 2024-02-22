import React from "react";
import './PersonInfo.css';

export default function PersonInfo({personDict}) {
    return (
        <div className="Row Start">
            <img className="ProfileImage" src="https://andysharpe.dev/wp-content/uploads/2024/02/MeGGJ.png"
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
            </div>
            <h1 className="Column End">
                {personDict.rating + "/5"}
            </h1>
        </div>
    );
}

export function PersonInfoSmall({personDict}) {
    return (
        <div className="Row Start">
            <img className="ProfileImageSmall" src="https://andysharpe.dev/wp-content/uploads/2024/02/MeGGJ.png"
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
            </div>
            <h3 className="Column End">
                {personDict.rating + "/5"}
            </h3>
        </div>
    );
}