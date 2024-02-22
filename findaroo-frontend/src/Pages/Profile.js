import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";
import { getAuth, signOut } from "firebase/auth";

export default function Profile() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };


    const [userData, setUserData] = useState(null);

    useEffect(() => {

        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

    }, []);

    const deactivateAccount = () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                status: false
            }
            console.log(form);
            fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                return response.text()
            });
        } catch (err) {
            console.log(err)
        } finally {
            GlobalVariables.authenticated = false;
            const auth = getAuth();
            signOut(auth);
            navigate("/Login");
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

    function DisableAccountCall(userId) {

    }

    function DeleteAccountCall(userId) {

    }

    /*
    async function UserCall(userId) {
        console.log("Getting User with id " + userId);
        // should return a dictionary of the values returned
        // TODO: This is not correct, but should be close to what
        //  it should be. The docs are here: http://localhost:5019/swagger/index.html - Andy
        const response = await fetch("http://localhost:5019/User", {
            mode: 'cors',
            method: "Post",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(userId)
        }).then(response => setUserData(response.json()))
            .catch(error => console.error(error));
    }
     */
}