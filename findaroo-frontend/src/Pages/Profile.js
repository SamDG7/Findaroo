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

    const [userData, setUserData] = useState();

    const [] = useState();

    // TODO: I'm not sure how to actually get the user's userID, so we will have to do that later
    // UserCall(10);

    // TODO: For now this data is hardcoded, but this is what should be returned by the get call
    const tempData = {
        user_id: "IDK",
        first_name: "Andy",
        last_name: "Sharpe",
        email: "ajsusa1@gmail.com",
        phone: "1234567890",
        age: 22,
        address: "1407 My Road",
        state: "Indiana",
        country: "USA",
        zip_code: "22182",
        occupation: "Student",
        company: "Telos",
        school: "Purdue University",
        rating: 4.5,
        date_created: "2024-02-13T19:09:02.274Z",
        date_modified: "2024-02-13T19:09:02.274Z",
        status: true
    };

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <PersonInfo personDict={tempData}/>
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
                        // Bio
                        // What they want in a roommate
                        // TODO: Put reviews below
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