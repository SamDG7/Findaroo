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
    const [userData, setUserData] = useState(null);
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

    useEffect(() => {
        console.log("GET Call for new added user in search")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);    
                setUserData(data);
            }).catch(error => console.error(error));
    }, []);
   

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
                {"Similarity: "+ calculateSimilarity() + "/5"}
                <div className="p-[1vw]"/>
                <ButtonImportant text={"Add Connection"} onClickFunction={addConnection}></ButtonImportant>
                {connected && <ButtonImportant text={"Start Conversation"} onClickFunction={startConversation}></ButtonImportant>}
            </h3>
        </div>
    );


    function calculateSimilarity() {
        var total_sim = 5;
        if (userData != null) {
            if (personDict.min_price != null && userData.min_price != null) {
                if (Math.abs(personDict.min_price - userData.min_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.max_price != null && userData.max_price != null) {
                if (Math.abs(personDict.max_price - userData.max_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.school != null && userData.school != null) {
                if (personDict.school != userData.school) {
                    total_sim -= 1;
                }
            }
            if (personDict.state != null && userData.state != null) {
                if (personDict.state != userData.state) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.rating) {
                if (personDict.rating < 3) {
                    total_sim -= 0.5;
                }
            }
            //TODO: CONSIDER LIFESTYLE PREFERENCES
        }
        
        //TODO: set total_sim as person rating
        if (total_sim < 0) {
            total_sim = 0;
        }

        personDict.rating = total_sim;
        return total_sim;
    }

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