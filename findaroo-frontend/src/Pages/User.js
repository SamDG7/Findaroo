import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAuth, deleteUser } from "firebase/auth";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";
import { signOut } from "firebase/auth";

export default function User() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const [userData, setUserData] = useState(null);
    const { uid } = useParams();

    useEffect(() => {

        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

    }, []);

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