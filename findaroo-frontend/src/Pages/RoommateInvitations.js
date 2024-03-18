import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import { ButtonImportant } from "../Components/Buttons";
import { useEffect } from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import Popup from "../Components/Popup";
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { InvitationInfo } from "../Components/InvitationInfo";

export default function RoommateInvitation() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [sentInvitations, setSentInvitations] = useState(null);
    const [receivedInvitations, setReceivedInvitations] = useState(null);

    useEffect(() => {
        if (!GlobalVariables.authenticated || auth.currentUser == null) {
            navigate("/Login");
            return;
        }
        getInvitations("sent", setSentInvitations);
        console.log(sentInvitations);
    }, []);

    return (
        <div className="Page">
            <Navbar/>

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <h2 className="text-left">Received Invitations</h2>
                    {receivedInvitations && receivedInvitations.map((element, i) => (
                        <InvitationInfo invitationDict={element} isSender={false}></InvitationInfo>
                    ))}
                <h2 className="text-left">Sent Invitations</h2>
                {
                    sentInvitations && sentInvitations.map((element, i) => (
                        <InvitationInfo invitationDict={element} isSender={true}></InvitationInfo>
                    ))
                }
            </div>
        </div>
    );

    async function getInvitations(path, updateState) {
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateInvitation/${path}`, {
            method: 'GET',
            credentials: 'include',
        });
        const connections = await response.json();

        if (connections.length == 0) {
            return;
        }

        var idList = [];
        connections.forEach(element => {
            if (path == 'sent') {
                idList.push(element["receiver_id"])
            } else {
                idList.push(element["sender_id"])
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
            credentials: 'include',
            body: JSON.stringify({"ids": idList}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json());

        var dataList = nameList.map((name, i) => (
            {
                'name':name, 
                'image':imageList[i], 
                'user_id':idList[i], 
                'room_id':connections[i]['room_id'],
                'agreement_form': connections[i]['roommate_agreement']
            }
        ));
        updateState(dataList);
    }
}