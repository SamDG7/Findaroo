import "./Page.css"
import Navbar from "../Components/Navbar";
import logo from '../Findaroo.png';
import React, { useState } from "react";
import { ButtonImportant, ButtonLink, ButtonTransparent } from "../Components/Buttons";
import InputStandard, { InputPassword } from "../Components/InputFields";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import GlobalVariables from "../Utils/GlobalVariables";
import Popup from "../Components/Popup";

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [message, setMessage] = useState("");

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const EnableAccountCall = async () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                status: false
            }
            await fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                navigate("/")
                return response.text()
            });
        }catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="Page">
            <Navbar />

            <Popup isOpen={isPopupOpen} closePopup={togglePopup}>
                <h2>Account is deactivated. Do you want to Reactivate?</h2>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={() => EnableAccountCall()}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={() => navigate("/")}>No</button>
                </div>
            </Popup>

            <div className="Panel mx-[34vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column Centered">
                    <h1>Welcome To</h1>
                    <img src={logo} alt="Findaroo" className="mx-auto pb-[4vh]" />
                    <div className="Column End">
                        <InputStandard name="Email: " onChangeFunction={(e) => setEmail(e.target.value)} />
                        <InputPassword name="Password: " onChangeFunction={(e) => setPassword(e.target.value)} />
                    </div>
                    <ButtonLink text="Forgot password" onClickFunction={ForgotPassword} />
                    {message !== "" ?
                        <h4 className="TextError p-0 m-0">
                            {message}
                        </h4> : ""
                    }
                    <div className="Row my-[1vh]">
                        <ButtonImportant text="Sign In" onClickFunction={LoginCall} />
                        <div className="p-[1vw]" />
                        <ButtonImportant text="Sign In With Google" onClickFunction={LogInWithGoogle} />
                    </div>
                    <h3>
                        Don't have an account?&nbsp;&nbsp;
                        <span className="TextLink">
                            <Link to="/SignUp">
                                Sign up
                            </Link>
                        </span>
                    </h3>
                </div>
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
                GlobalVariables.userCredential = userCredential.user;
                console.log("Logged in as " + GlobalVariables.userCredential.email + "with uid " + GlobalVariables.userCredential.uid);
                GlobalVariables.authenticated = true;
                // Get status
                fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid).then(response => response.json()).then((userData) => {
                    console.log(userData)
                    if (!userData.status) {
                        togglePopup();
                    } else {
                        navigate("/");
                    }
                }
                )
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + ": " + errorMessage);
                setMessage("Incorrect Login Credentials");
            });
    }

    function LogInWithGoogle() {
        const auth = getAuth();
        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            GlobalVariables.userCredential = result.user;
            console.log("Logged in as " + GlobalVariables.userCredential.email);
            GlobalVariables.authenticated = true;
            navigate("/");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;

            console.log(errorCode + " " + errorMessage + " " + email);
            setMessage("Failed to login with Google account");
        });
    }

    function ForgotPassword() {
        const auth = getAuth();

        sendPasswordResetEmail(auth, email).then(() => {
            console.log("Password reset email sent to" + email);
            setMessage("Password reset email sent to " + email);
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorCode + ": " + errorMessage);
        });
    }
}

