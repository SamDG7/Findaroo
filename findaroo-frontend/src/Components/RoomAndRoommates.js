import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import getAuth from "firebase/auth";

export default function MyRooms() {
    return (
        <div className="Page">
            <Navbar/>
        </div>
    );
}