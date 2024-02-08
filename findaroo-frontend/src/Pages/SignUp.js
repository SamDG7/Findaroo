import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, {useState} from "react";
import {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputPassword} from "../Components/InputFields";
import { redirect } from "react-router-dom";

export default function SignUp() {
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel">
                <h1>Welcome To</h1>
                <img src={logo} alt="Findaroo" align="left"/>
                <InputStandard name="First Name: " onChangeFunction={(e) => setFirstName(e.target.value)}/>
                <InputStandard name="Last Name: " onChangeFunction={(e) => setLastName(e.target.value)}/>
                <InputStandard name="Email: " onChangeFunction={(e) => setEmail(e.target.value)}/>
                <InputStandard name="Username: " onChangeFunction={(e) => setUsername(e.target.value)}/>
                <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)}/>
                <InputPassword name="Confirm Password: " onChangeFunction={(e) => setPasswordConfirm(e.target.value)}/>
                <ButtonImportant text="Sign Up" onClickFunction={SignUpCall} />
            </div>
        </div>
    );

    // TODO: This is called when the sign-up button is pressed
    function SignUpCall() {
        if (password === passwordConfirm) {
            console.log("Signing up " + firstName + " " + lastName + " with email " + email + " as " + username + " with password " + password);

            // After everything is done, return to the login page
            redirect("/Login");
        } else {
            console.log("Passwords are different");
            // This will probably make a popup or change the UI, so I can help with this later - Andy
        }
    }
}
