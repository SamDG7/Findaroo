import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import PersonInfo from "../Components/PersonInfo";

export default function Profile() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

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
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

    }, []);

    return (
        <div className="Page">
            <Navbar/>
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
                            <ButtonDelete text="Disable Account" onClickFunction={DisableAccountCall}/>
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