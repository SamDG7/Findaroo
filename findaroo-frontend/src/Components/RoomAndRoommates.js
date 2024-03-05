import React from "react";
import './PersonInfo.css';
import ButtonStandard, { ButtonImportant } from "./Buttons";
import {getAuth} from 'firebase/auth';
import {useState, useEffect} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import { PersonInfoSmall } from "./PersonInfo";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export function RoomAndRoommates({dataDict}) {
    const auth = getAuth();
    const [showRoommate, setShowRoommate] = useState(false);
    const [roommateDict, setRoommateDict] = useState({});
    const [visible, setVisible] = useState(true);

    if (!visible) {
        return;
    }

    return (
        <div>
            <div className="Row Start">
                <div className="Column Start">
                    <h1>{dataDict.room_name}</h1>
                    <h2>{`Created on: ${dataDict.date_created.substring(0, dataDict["date_created"].indexOf('T'))}`}</h2>
                </div>
                <div className="Column End">
                    <ButtonImportant text="Leave" onClickFunction={removeFromGroup}></ButtonImportant>
                    <div className="p-[1vw]"/>
                    <ButtonStandard text="View Roommates" onClickFunction={displayRoommates}/>
                </div>
            </div>
            <div className="Row Start">
                {
                    showRoommate && roommateDict.map((rm, i) => (
                        <RoommateInfo roommate={rm} room_id={dataDict.room_id}/>
                    ))
                }
            </div>
        </div>
    );

    async function removeFromGroup() {
        setVisible(false);
        const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
            method:'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"roomId": dataDict.room_id, "userIdToRemove": auth.currentUser.uid})
        })
    }

    async function displayRoommates() {
        if (!showRoommate && roommateDict == {}) {
            const userResponse = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"ids": dataDict["roommate_id"]})
            })
            const userData = await userResponse.json();
            setRoommateDict(userData.map((name, i) => ({
                'name': name,
                'id': dataDict["roommate_id"][i],
                'date_joined': dataDict["date_joined"][i].substring(0, dataDict["date_joined"][i].indexOf('T'))
            })));
        }
        setShowRoommate(!showRoommate);
        console.log(roommateDict);
    }
}

export function RoommateInfo({roommate, room_id}) {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(true);

    const auth = getAuth();

    useEffect(() => {
        if (roommate["id"] != null && image == null) {
            GetImage(roommate["id"]);
        }
    }, [roommate['id']]);

    const GetImage = async function() {
        console.log(roommate["id"])
        const imageResponse = await fetch("http://localhost:5019/Image?user_id=" + roommate["id"]);
        const blob = await imageResponse.blob();
        const source = URL.createObjectURL(blob);
        setImage(source);
    }

    if (!roommate['id'] || !visible) {
        return;
    }
    return (
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]" onClick={() => navigate("/User/" + roommate["id"])}>
            <img className="ProfileImageSmall" src={image}
                alt={roommate['name'] + "'s profile picture"} />
            <div className="Column Start">
                <Link to="/User" params={roommate["id"]}>
                    <h2>
                        {roommate['name']}
                    </h2>
                </Link>
                <h4>
                    Date joined: {roommate['date_joined']}
                </h4>
            </div>
            <h3 className="Column End">
                <ButtonImportant text={"Remove from group"} onClickFunction={removeFromGroup}></ButtonImportant>
            </h3>
        </div>
    );

    async function removeFromGroup() {
        setVisible(false);
        const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
            method:'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"roomId": room_id, "userIdToRemove": roommate.id})
        })
    }
}