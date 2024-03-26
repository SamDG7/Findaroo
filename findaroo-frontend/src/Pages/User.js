import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ButtonStandard, { ButtonDelete, ButtonImportant } from "../Components/Buttons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAuth, deleteUser } from "firebase/auth";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";
import { signOut } from "firebase/auth";

export default function User() {
    // This redirects to the login page if not logged in
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [userData, setUserData] = useState(null);
    const { uid } = useParams();

    useEffect(() => {

        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLoggedInUser(data);
            }).catch(error => console.error(error));

        fetch('http://localhost:5019/User?user_id=' + uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

    }, []);
    const BlockUser = async () => {
        console.log(loggedInUser.blocked_users)
        console.log("PUT Call")
        var copy = null
        
        if(loggedInUser.blocked_users == null) {
            // loggedInUser.blocked_users = [userData.user_id]
            copy = [userData.user_id]
        } else {
            copy = loggedInUser.blocked_users
            copy.push(userData.user_id)
        }
        console.log(copy)
        
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                blocked_users: copy
            }
            await fetch('http://localhost:5019/User', {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form)
			}).then(response => {
                console.log("HERE")
				return response.text()
			  });
        } catch (err) {
            console.log(err)
            
        }
    }
    return (
        <div className="Page">
            <Navbar />

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <PersonInfo personDict={userData} />
                    <ButtonImportant text="Block User" onClickFunction={BlockUser}/>
                </div>
            </div>
        </div>
    );


}