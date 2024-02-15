import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, {useState} from "react";
import {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputPassword} from "../Components/InputFields";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function SignUp() {
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    // Basic account info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[32vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <h1>Welcome To</h1>
                <img src={logo} alt="Findaroo" className="mx-auto pb-[4vh]"/>
                <InputStandard name="First Name: " onChangeFunction={(e) => setFirstName(e.target.value)}/>
                <InputStandard name="Last Name: " onChangeFunction={(e) => setLastName(e.target.value)}/>
                <InputStandard name="Email: " onChangeFunction={(e) => setEmail(e.target.value)}/>
                <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)}/>
                <InputPassword name="Confirm Password: " onChangeFunction={(e) => setPasswordConfirm(e.target.value)}/>
                <div className="Row my-[1vh]">
                    <ButtonImportant text="Sign Up" onClickFunction={SignUpCall}/>
                    <div className="p-[1vw]"/>
                    <ButtonImportant text="Sign Up With Google" onClickFunction={SignUpWithGoogle}/>
                </div>
                <h3>
                    Already have an account?&nbsp;&nbsp;
                    <span className="TextLink">
                        <Link to="/Login">
                            Login
                        </Link>
                    </span>
                </h3>
            </div>
        </div>
    );

    // TODO: This is called when the sign-up button is pressed
    function SignUpCall() {
        if (password === passwordConfirm) {
            console.log("Signing up " + firstName + " " + lastName + " with email " + email + " and password " + password);
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                console.log("User signed up: " + user.email);
                //TODO: Add notification of email verification sent
                userCredential.user.sendEmailVerification().then(() => {
                    navigate("/Login");
                });
            }).catch((error) =>{    
                const errorCode = error.code; 
                const errorMessage = error.message; 
                console.log(errorCode + " " + errorMessage);
            })
            
            
        } else {
            console.log("Passwords are different");
            // This will probably make a popup or change the UI, so I can help with this later - Andy
        }
    }

    function SignUpWithGoogle() {
        const auth = getAuth();
        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;

            // TODO: I think we may have to change it so to sign up passwords are not
            // TODO: required if a google account is used and probably make a field to
            // TODO: track if that is the case - Andy
            createUserWithEmailAndPassword(auth, user.email, null).then((userCredential) => {
                const user = userCredential.user;
                console.log("User signed up: " + user.email);
                // After everything is done, return to the login page
                navigate("/Login");
            }).catch((error) =>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " " + errorMessage);
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;

            console.log(errorCode + " " + errorMessage + " " + email);
        });
    }
}
