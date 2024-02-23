import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, {useState} from "react";
import {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputPassword} from "../Components/InputFields";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GlobalVariables from "../Utils/GlobalVariables";
import { initializeApp } from "firebase/app";
import Popup from "../Components/Popup";
import zxcvbn from "zxcvbn";

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

    const firebaseConfig = {
        apiKey: "AIzaSyC02A6JRXCWfrfw63_S0cRz0uPBhmJlmOI",
        authDomain: "findaroo-19063.firebaseapp.com",
        projectId: "findaroo-19063",
        storageBucket: "findaroo-19063.appspot.com",
        messagingSenderId: "606372407306",
        appId: "1:606372407306:web:d75f3e34a095d643df97f3",
        measurementId: "G-L1K080NSWL"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    return (
        <div className="Page">
            <Navbar/>

            <div className="Panel mx-[32vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column Centered">
                    <h1>Welcome To</h1>
                    <img src={logo} alt="Findaroo" className="mx-auto pb-[4vh]"/>
                    <div className="Column End">
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
                    <div className="Column End">
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
        </div>
    );

    function PasswordStrengthTextSwitch(passwordStrengthNum) {
        var strengthDict = {1: "Very Weak", 2: "Weak", 3: "Moderate", 4: "Strong", 5: "Very Strong"}
        return strengthDict[passwordStrengthNum] + " (" + passwordStrengthNum + "/5)";
    }

    // function EmailVerification() {
    //     return new Promise((resolve) => {
    //         const IntervalId = setInterval(() => {
    //             console.log("Awaiting Email Verification");
    //            if (GlobalVariables.userCredential.auth.emailVerified) {
    //             clearInterval(IntervalId);
    //             console.log("Email Verified");
    //             resolve(true);
    //            } 
    //         }, 300);
    //     });
    // }

    // Decides how strong a password is
    // Want total length >= 8, as well as >= 1 for lowercase, uppercase, numbers, and symbols
    // Strength is out of 5 for matching all criteria.
    // Should return an array containing the strength and text to explain it. (EX: Password is not 8 characters long)
    function PasswordStrength(testPassword) {

        var strength = 1;
        try {
            strength = zxcvbn(testPassword).score + 1;
        } catch (e) {
            strength = 1;
        }

        const outMessage = '';

        return [strength, outMessage];
    }

    // TODO: This is called when the sign-up button is pressed
    async function SignUpCall() {
        if (password === passwordConfirm) {
            if (PasswordStrength(password)[0] >= 3) {
                console.log("Signing up " + email + " with password " + password);
                
                createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    console.log(userCredential)
                    GlobalVariables.email = email;
                    GlobalVariables.userCredential = userCredential.user;

                    //TODO: This seems to be giving an error
                    sendEmailVerification(auth.currentUser);
                    setMessage("Sent Verification Email to "+ email);
                    const checkEmailVerified = setInterval(() => {
                        // Reload the user's latest status
                        auth.currentUser.reload().then(() => {
                          if (auth.currentUser.emailVerified) {
                            // Email is verified, clear the interval and navigate to a new page
                            clearInterval(checkEmailVerified);
                            
                            console.log("User signed up: " + GlobalVariables.userCredential.email);
                            GlobalVariables.authenticated = true;
                            navigate("/AccountSetup");
                          } else {
                            // Email not verified yet, continue checking
                            console.log('Email not verified yet.');
                          }
                        });
                      }, 5000); // Check every 5000 milliseconds (5 seconds)

                    
                        
                }).catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode + " " + errorMessage);
                    setMessage("Unable to sign up as " + email);
                });
                

            } else {
                console.log("Password not strong enough (Requires score of 3 or more)");
                setMessage("Password is not strong enough (Requires score of 3 or more)");
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
            const user = result.user;
                GlobalVariables.email = user.email;
                GlobalVariables.userCredential = user;
                console.log("User signed up: " + GlobalVariables.userCredential.email);
                GlobalVariables.authenticated = true;
                navigate("/AccountSetup");
            // TODO: I think we may have to change it so to sign up passwords are not
            // TODO: required if a google account is used and probably make a field to
            // TODO: track if that is the case - Andy
            // createUserWithEmailAndPassword(auth, user.email, null).then((userCredential) => {
            //     GlobalVariables.email = user.email;
            //     GlobalVariables.userCredential = userCredential.user;
            //     console.log("User signed up: " + GlobalVariables.userCredential.email);
            //     navigate("/AccountSetup");
            // }).catch((error) =>{
            //     const errorCode = error.code;
            //     const errorMessage = error.message;
            //     console.log(errorCode + " " + errorMessage);
            //     setMessage("Unable to sign up as " + user.email);
            // })
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;

            console.log(errorCode + " " + errorMessage + " " + email);
            setMessage("Unable to sign up with Google");
        });
    }

}
