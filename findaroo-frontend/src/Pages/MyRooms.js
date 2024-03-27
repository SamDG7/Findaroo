import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import ButtonStandard, { ButtonImportant } from "../Components/Buttons";
import {RoomAndRoommates} from "../Components/RoomAndRoommates"
import InputStandard from "../Components/InputFields";

export default function MyRooms() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [data, setData] = useState();
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState();
    const [connections, setConnections] = useState(null);

    useEffect(() => {

        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        getRooms();
        getConnections();
    }, []);

    useEffect(() => {
        
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Grid">
                    {
                        data && data.map((d, index) => (
                            <RoomAndRoommates roomDict={d} connectionDict={connections}></RoomAndRoommates>
                        ))
                    }
                </div>
                <ButtonStandard text="My Invitations" onClickFunction={() => navigate("/Profile/MyRooms/RoommateInvitations")}></ButtonStandard>
                {
                    showCreateRoom && <div>
                        <InputStandard name="Room Name" defaultValue={newRoomName} onChangeFunction={(e) => setNewRoomName(e.target.value)}/>
                    </div>
                }
                {
                    showCreateRoom && <ButtonStandard text="Cancel" onClickFunction={cancel}></ButtonStandard>
                }
                <ButtonImportant text="Create Room" onClickFunction={createRoom}></ButtonImportant>
            </div>
        </div>
    );

    async function createRoom() {
        if (showCreateRoom) {
            const response = await fetch(GlobalVariables.backendURL + "/Room", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"room_name": newRoomName})
            });
            navigate("/Profile/MyRooms");
        } else {
            setShowCreateRoom(true);
        }
    }

    function cancel() {
        setShowCreateRoom(false);
    }

    async function getRooms() {
        const response = await fetch(GlobalVariables.backendURL + "/Room", {
            method: 'GET',
            credentials: 'include',
        })
        const responseBody = await response.json();
        setData(responseBody.rooms);
    }

    async function getConnections() {
        const connectionResponse = await fetch(`${GlobalVariables.backendURL}/Connection?user_id=${auth.currentUser.uid}`);
        const connectionBody = await connectionResponse.json();

        var idList = [];
        connectionBody.forEach(element => {
            if (element['user_1_id'] == auth.currentUser.uid) {
                idList.push(element['user_2_id'])
            } else {
                idList.push(element['user_1_id'])
            }
        });

        var imageList = [];

        for (const id of idList) {
            var imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
            var blob = await imageResponse.blob();
            imageList.push(URL.createObjectURL(blob));
        }

        var nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            body: JSON.stringify({"ids": idList}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => response.json());

        var nameIdImageList = nameList.map((name, i) => ({'name':name, 'image':imageList[i], 'user_id':idList[i]}));
        setConnections(nameIdImageList);
    }
}