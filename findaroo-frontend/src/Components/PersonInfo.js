import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { ButtonImportant } from "./Buttons";
import { getAuth } from "@firebase/auth";
import fb from "../fb.png";
import ig from "../ig.png";
import tw from "../tw.png";
import li from "../li.png";


export default function PersonInfo({personDict}) {
    const [image, setImage] = useState();

    useEffect(() => {
        if (personDict != null) {
            GetImage(personDict);
        }

        // if (personDict.social === null) {
            // personDict.social = {
            //     fb: "sai.girap",
            //     ig: "sai.girap",
            //     tw: "sai.girap",
            //     li: "sai-girap"
            // }
        // }
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
            
                {personDict.social && <div className="Row">

                    {personDict.social[0] && <a href={"https://www.facebook.com/" + personDict.social[0]} target="_blank" rel="noopener noreferrer">
                        <img src={fb} alt={"Facebook link"} style={{ width: '50%', height: 'auto' }} />
                    </a>}

                    {personDict.social[1] && <a href={"https://www.instagram.com/" + personDict.social[1]} target="_blank" rel="noopener noreferrer">
                        <img src={ig} alt={"Instagram link"} style={{ width: '50%', height: 'auto' }} />
                    </a>}

                    {personDict.social[2] && <a href={"https://www.twitter.com/" + personDict.social[2]} target="_blank" rel="noopener noreferrer">
                        <img src={tw} alt={"Twitter link"} style={{ width: '50%', height: 'auto' }} />
                    </a>}

                    {personDict.social[3] && <a href={"https://www.linkedin.com/in/" + personDict.social[3]} target="_blank" rel="noopener noreferrer">
                        <img src={li} alt={"LinkedIn link"} style={{ width: '50%', height: 'auto' }} />
                    </a>}
                </div>}
                
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
    const navigate = useNavigate();
    const [image, setImage] = useState();

    const auth = getAuth();

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
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]" onClick={() => navigate("/User/" + personDict.user_id)}>
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
                <div className="p-[1vw]"/>
                <ButtonImportant text={"Add Connection"} onClickFunction={addConnection}></ButtonImportant>
            </h3>
        </div>
    );

    async function addConnection() {
        await fetch(GlobalVariables.backendURL + "/ConnectionRequest/send", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"sender_id": auth.currentUser.uid, "receiver_id": personDict.user_id})
        }).catch(error => console.log(error));
    }
}