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
    //const [firstName, setFirstName] = useState();
    //const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    const [message, setMessage] = useState("");

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[32vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <h1>Welcome To</h1>
                <img src={logo} alt="Findaroo" className="mx-auto pb-[4vh]"/>
                <div className="Column Start">
                    <InputStandard name="Email: " onChangeFunction={(e) => setEmail(e.target.value)}/>
                    <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)}/>
                </div>
                <h4>
                    Password Strength: {PasswordStrengthTextSwitch(PasswordStrength(password)[0])}
                </h4>
                {PasswordStrength(password)[1] !== "" ?
                    <h4 className="TextError p-0 m-0">
                        {PasswordStrength(password)[1]}
                    </h4> : ""
                }
                <div className="Column Start">
                    <InputPassword name="Confirm Password: "
                                   onChangeFunction={(e) => setPasswordConfirm(e.target.value)}/>
                </div>
                {message !== "" ?
                    <h4 className="TextError p-0 m-0">
                        {message}
                    </h4> : ""
                }
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

    function PasswordStrengthTextSwitch(passwordStrengthNum) {
        var strengthDict = {0: "Vulnerable", 1: "Susceptible", 2: "Weak", 3: "Moderate", 4: "Intermediate", 5: "Strong"}
        return strengthDict[passwordStrengthNum] + " (" + passwordStrengthNum + "/5)";
    }

    // Decides how strong a password is
    // Want total length >= 8, as well as >= 1 for lowercase, uppercase, numbers, and symbols
    // Strength is out of 5 for matching all criteria.
    // Should return an array containing the strength and text to explain it. (EX: Password is not 8 characters long)
    function PasswordStrength(testPassword) {
        const strength = 0;
        const outMessage = '';
        // TODO: Write this function
        return [strength, outMessage];
    }

    // TODO: This is called when the sign-up button is pressed
    function SignUpCall() {
        if (password === passwordConfirm) {
            if (PasswordStrength(password)[0] === 5) {
                console.log("Signing up " + email + " with password " + password);
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    const user = userCredential.user;
                    console.log("User signed up: " + user.email);
                    //TODO: Add notification of email verification sent
                    userCredential.user.sendEmailVerification().then(() => {
                        navigate("/Login");
                    });
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " " + errorMessage);
                    setMessage("Unable to sign up as " + email);
                })
            } else {
                console.log("Password is not strong enough");
                setMessage("Password is not strong enough");
            }
        } else {
            console.log("Passwords are different");
            setMessage("Passwords are different");
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
                const createdUser = userCredential.user;
                console.log("User signed up: " + createdUser.email);
                // After everything is done, return to the login page
                navigate("/Login");
            }).catch((error) =>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + " " + errorMessage);
                setMessage("Unable to sign up as " + user.email);
            })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;

            console.log(errorCode + " " + errorMessage + " " + email);
            setMessage("Unable to sign up with Google");
        });
    }
}
