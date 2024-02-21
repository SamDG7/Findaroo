import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import {PersonInfoSmall} from "../Components/PersonInfo";

export default function Search() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    // TODO: For now this data is hardcoded, but this is what should be returned by the get call
    const tempData = [{
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
    }, {
        user_id: "IDK",
        first_name: "Andy",
        last_name: "Sharp",
        email: "ajsusa2@gmail.com",
        phone: "1234567890",
        age: 22,
        address: "1407 My Road",
        state: "Indiana",
        country: "USA",
        zip_code: "22182",
        occupation: "Student",
        company: "Dovel",
        school: "Indiana University",
        rating: 4.5,
        date_created: "2024-02-13T19:09:02.274Z",
        date_modified: "2024-02-13T19:09:02.274Z",
        status: true
    }];

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Grid">
                    {
                        tempData.map((person, index) => (
                            <PersonInfoSmall personDict={person}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}