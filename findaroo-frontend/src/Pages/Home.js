import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import {useEffect} from "react";

export default function Home() {
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
            <h3>
                This is the home page! Click on the buttons on the Navbar to move to a different page!
            </h3>
        </div>
    );
}
