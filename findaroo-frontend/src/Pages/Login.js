import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, {useState} from "react";
import {ButtonImportant, ButtonTransparent} from "../Components/Buttons";
import InputStandard, {InputPassword} from "../Components/InputFields";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link, redirect, useNavigate} from "react-router-dom";


export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel">
                <h1>Welcome To</h1>
                <img src={logo} alt="Findaroo" align="left"/>
                <InputStandard name="Email: " onChangeFunction={(e) => setEmail(e.target.value)}/>
                <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)}/>
                <ButtonImportant text="Sign In" onClickFunction={LoginCall}/>
                <Link to="/ForgotPassword">
                    <ButtonTransparent text="Forgot password?"/>
                </Link>
                <h3>
                    Don't have an account?
                </h3>
                <Link to="/SignUp">
                    <ButtonImportant text="Sign Up"/>
                </Link>
            </div>
        </div>
    );

    // TODO: This is called when the sign-in button is pressed
    function LoginCall() {
        console.log("Logging in as " + email + " with password " + password);
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Logged in as " + user.email);
            redirect('/');
         })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        });
    }
}

