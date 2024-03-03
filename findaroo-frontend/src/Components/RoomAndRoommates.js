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
    const [showRoommate, setVisible] = useState(false);
    const [roommateDict, setRoommateDict] = useState({});

    return (
        <div>
            <div className="Row Start">
                <div className="Column Start">
                    <h1>{dataDict.room_name}</h1>
                    <h2>{`Created on: ${dataDict.date_created}`}</h2>
                </div>
                <div className="Column End">
                    <ButtonImportant text="Leave"></ButtonImportant>
                    <div className="p-[1vw]"/>
                    <ButtonStandard text="View Roommates" onClickFunction={displayRoommates}/>
                </div>
            </div>
            <div className="Row Start">
                {
                    showRoommate && roommateDict.map((rm, i) => (
                        <RoommateInfo roommate={rm}/>
                    ))
                }
            </div>
        </div>
    );

    async function displayRoommates() {
        if (!showRoommate) {
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
                'date_joined': dataDict["date_joined"][i]
            })));
        }
        setVisible(!showRoommate);
        console.log(roommateDict);
    }
}

export function RoommateInfo({roommate}) {
    const navigate = useNavigate();
    const [image, setImage] = useState();

    const auth = getAuth();

    useEffect(() => {
        if (roommate["id"] != null) {
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

    if (!roommate['id']) {
        return;
    }
    return (
        <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]" onClick={() => navigate("/User/" + roommate["id"])}>
            <img className="ProfileImageSmall" src={image}
                alt={roommate['name'] + "'s profile picture"} />
            <div className="Column Start">
                <Link to="/User" params={roommate["id"]}>
                    <h3>
                        {roommate['name']}
                    </h3>
                </Link>
                <h5>
                    Date joined: {roommate['date_joined']}
                </h5>
            </div>
            <h3 className="Column End">
                <ButtonImportant text={"Remove from group"} ></ButtonImportant>
            </h3>
        </div>
    );
}