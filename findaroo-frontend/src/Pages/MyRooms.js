import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import { ButtonImportant } from "../Components/Buttons";
import {RoomAndRoommates} from "../Components/RoomAndRoommates"

export default function MyRooms() {
    const auth = getAuth();
    const [data, setData] = useState();

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Grid">
                    {
                        data && data.map((d, index) => (
                            <RoomAndRoommates dataDict={d}></RoomAndRoommates>
                        ))
                    }
                    <ButtonImportant text="Create Room" onClickFunction={createRoom}></ButtonImportant>
                </div>
            </div>
        </div>
    );

    async function createRoom() {

    }

    async function getRooms() {
        const response = await fetch(GlobalVariables.backendURL + "/Room", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
        const responseBody = await response.json();
        setData(responseBody.rooms);
    }
}