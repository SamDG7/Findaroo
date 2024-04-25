import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";
import GlobalVariables from "../Utils/GlobalVariables";

export default function FAQs() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const [show1, setShow1] = useState(false)
    const [show2, setShow2] = useState(false)
    const [show3, setShow3] = useState(false)
    const [show4, setShow4] = useState(false)
    const [show5, setShow5] = useState(false)
    const [show6, setShow6] = useState(false)
    const [show7, setShow7] = useState(false)
    const [show8, setShow8] = useState(false)
    const [show9, setShow9] = useState(false)
    const [show10, setShow10] = useState(false)

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    // Personal Info
    
    useEffect(() => {
        
        
        
    }, []);

    
    const show = (a) => {
        switch(a) {
            case 1: setShow1(!show1)
            case 2: setShow2(!show2)
            case 3: setShow3(!show3)
            case 4: setShow4(!show4)
            case 5: setShow5(!show5)
            case 6: setShow6(!show6)
            case 7: setShow7(!show7)
            case 8: setShow8(!show8)
            case 9: setShow9(!show9)
            case 10: setShow10(!show10)
        }
        
        console.log(a)
    }

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl items-center flex">
                <div className="Row Start">
                    <div className="Column Start items-center">
                        <h1>FAQs</h1>
                        
                        <h2 onClick={() => show(1)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to edit profile </a></h2>
                        {show1 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(2)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to start a conversation </a></h2>
                        {show2 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(3)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to add a roommate </a></h2>
                        {show3 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(4)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to remove a roommate</a></h2>
                        {show4 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(5)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to add an event on the calendar</a></h2>
                        {show5 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(6)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to find potential roommates</a></h2>
                        {show6 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(7)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to add a connection</a></h2>
                        {show7 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(8)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to remove a connection</a></h2>
                        {show8 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(9)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to block a user</a></h2>
                        {show9 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        <h2 onClick={() => show(10)}> <a href="#" class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline">How to deactive my account </a></h2>
                        {show10 && (
                            <div className="drop-shadow-xl mx-5 my-5 flex"><h3>Click here</h3></div>
                        )}
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
}