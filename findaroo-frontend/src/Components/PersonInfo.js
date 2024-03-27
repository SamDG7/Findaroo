import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './PersonInfo.css';
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { ButtonImportant } from "./Buttons";
import { getAuth } from "@firebase/auth";

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
    const navigate = useNavigate();
    const [image, setImage] = useState();
    const [connected, setConnected] = useState(false);

    const auth = getAuth();

    useEffect(() => {
        if (personDict != null) {
            GetImage(personDict);
        }
    }, [personDict]);

    // Check if the person is a connection
    useEffect(() => {
        if (!personDict.user_id) {
            return
        }
        console.log("GET Call")
        fetch('http://localhost:5019/Connection/check?user_id1=' + GlobalVariables.userCredential.uid + "&user_id2=" + personDict.user_id)
            .then(response => response.json())
            .then(data => {
                setConnected(data);
            }).catch(error => console.error(error));
    }, [personDict.user_id]);

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
                {connected && <ButtonImportant text={"Start Conversation"} onClickFunction={startConversation}></ButtonImportant>}
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

    async function startConversation() {
        console.log([auth.currentUser.uid, personDict.user_id])
        await fetch(GlobalVariables.backendURL + "/Conversation", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify([auth.currentUser.uid, personDict.user_id])
        }).catch(error => console.log(error));
        navigate("/conversations")
    }
}