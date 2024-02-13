import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlovalVariables";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

export default function Messages() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <h1>
                Messages page!
            </h1>
        </div>
    );
}