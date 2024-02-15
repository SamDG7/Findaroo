import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";

export default function Profile() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    const [userData, setUserData] = useState();

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
                    <div className="Row Top Left">
                        <img src="https://andysharpe.dev/wp-content/uploads/2024/02/MeGGJ.png"
                             alt={tempData.first_name + " " +  tempData.last_name + "'s profile picture"}/>
                        <div className="Column items-start">
                            <h1>
                                {tempData.first_name + " " +  tempData.last_name}
                            </h1>
                            <h2>
                                {(tempData.state ? tempData.state + ", " : "")  + tempData.country}
                            </h2>
                            <h2>
                                {(!(tempData.school === null || tempData.school === "")
                                    ? "Student" + " at " + tempData.school
                                    : "") +
                                    (!(tempData.company === null || tempData.company === "")
                                        ? "Employee" + " at " + tempData.company
                                        : "")
                                }
                            </h2>
                            // Interests
                        </div>
                        <h1 className="Right">
                            {tempData.rating + "/5"}
                        </h1>
                    </div>
                    <div className="Row space-x-10">
                    <ButtonImportant text="Settings"/>
                        <ButtonStandard text="Roomies"/>
                        <ButtonStandard text="Blocked Users"/>
                        <ButtonStandard text="My Reviews"/>
                        <ButtonDelete text="Delete Account"/>
                     <ButtonImportant text="Compatibility Questions"/>
                    </div>
                    // Bio
                    // What they want in a roommate
                    // TODO: Put reviews below
                </div>
            </div>
        </div>
    );

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