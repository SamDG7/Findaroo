import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, {useState} from "react";
import {ButtonImportant, ButtonTransparent} from "../Components/Buttons";
import InputStandard, {InputPassword} from "../Components/InputFields";
import {Link} from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel">
                <h1>Welcome To</h1>
                <img src={logo} alt="Findaroo" align="left"/>
                <InputStandard name="Username/Email: " onChangeFunction={(e) => setUsername(e.target.value)}/>
                <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)}/>
                <Link to="/ForgotPassword">
                    <h3 className="TextLink">
                        Forgot password?
                    </h3>
                </Link>
                <ButtonImportant text="Sign In" onClickFunction={LoginCall}/>
                <h3>
                    Don't have an account?
                </h3>
                <Link to="/SignUp">
                    <h3 className="TextLink">
                        Sign up
                    </h3>
                </Link>
            </div>
        </div>
    );

    // TODO: This is called when the sign-in button is pressed
    function LoginCall() {
        console.log("Logging in as " + username + " with password " + password);
    }
}

