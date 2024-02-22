import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAuth, deleteUser } from "firebase/auth";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";

export default function Profile() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

    }, []);

    async function DisableAccountCall() {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                status: false
            }
            await fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                return response.text()
            });
        }catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="Page">
            <Navbar/>

            <Popup isOpen={isPopupOpen} closePopup={togglePopup}>
                <h2>Deactivate Account</h2>
                <p>Are you sure you want to deactivate your account?</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={deactivateAccount}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={togglePopup}>Cancel</button>
                </div>
            </Popup>

            
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <PersonInfo personDict={userData}/>
                    <div className="Column Start">
                        <div className="Row space-x-[2vw]">
                            <Link to="/Profile/Edit">
                                <ButtonImportant text="Edit Profile"/>
                            </Link>
                            <Link to="/Profile/Photo">
                                <ButtonImportant text="Change Photo"/>
                            </Link>
                            <Link to="/Profile/Preferences">
                            <ButtonImportant text="Edit Preferences"/>
                            </Link>
                            <Link to="/Profile/Questions">
                                <ButtonImportant text="Compatibility Questions"/>
                            </Link>
                        </div>
                        <div className="Row space-x-[2vw]">
                            <ButtonStandard text="View Roomies"/>
                            <ButtonStandard text="My Connections" onClickFunction={() => {navigate("/Profile/MyConnections");}}/>
                            <ButtonStandard text="Connection Requests" onClickFunction={() => {navigate("/Profile/MyConnectionRequests");}}/>
                            <ButtonStandard text="Blocked Users"/>
                            <ButtonStandard text="My Reviews"/>
                        </div>
                        <div className="Row space-x-[2vw]">
                            <ButtonDelete text="Disable Account" onClickFunction={togglePopup}/>
                            <ButtonDelete text="Delete Account" onClickFunction={DeleteAccountCall}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function DeleteAccountCall() {
        let answer = window.confirm("Your record will be removed from Findaroo. Are you sure?");
        if (!answer) return;
        const auth = getAuth();
        var toBeDeleted = auth.currentUser;
        var user_id = auth.currentUser.uid;

        deleteUser(toBeDeleted).catch((error) => {
            console.log(error)
        })

        await fetch(GlobalVariables.backendURL + "/User", {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({"user_id": user_id})
        })
        .catch(error => console.error(error));

        GlobalVariables.authenticated = false;
        navigate("/Login");
    }

}