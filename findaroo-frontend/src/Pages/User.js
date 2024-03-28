import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ButtonStandard, { ButtonDelete, ButtonImportant } from "../Components/Buttons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAuth, deleteUser } from "firebase/auth";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";
import { signOut } from "firebase/auth";
import InputStandard from "../Components/InputFields";
import emailjs from "emailjs-com";
import SettingsButton from "../Components/SettingsButton";

export default function User() {
    // This redirects to the login page if not logged in
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [userData, setUserData] = useState(null);
    const [show, setShow] = useState(false)
    const [rating, setRating] = useState()
    const [avgRating, setAvgRating] = useState(null)
    const [message, setMessage] = useState()
    const [reviewed, setReviewed] = useState(false)
    const { uid } = useParams();

    useEffect(() => {

        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLoggedInUser(data);
            }).catch(error => console.error(error));

        fetch('http://localhost:5019/User?user_id=' + uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));
        
        fetch('http://localhost:5019/Ratings/all?to_user=' + uid)
            .then(response => response.json())
            .then(data => {
                for(let i = 0; i < data.length; i++) {
                    if(data[i].user_id == GlobalVariables.userCredential.uid) {
                        setReviewed(true)
                    }
                }
            })
        fetch('http://localhost:5019/Ratings/avg?user=' + uid)
            .then(response => response.json())
            .then(data => {
                setAvgRating(data)
                console.log(data)
            })

    }, []);
    useEffect(() => {
        fetch('http://localhost:5019/Ratings/avg?user=' + uid)
            .then(response => response.json())
            .then(data => {
                setAvgRating(data)
                console.log(data)
            })
    }, [rating])
    const BlockUser = async () => {
        console.log(loggedInUser.blocked_users)
        console.log("PUT Call")
        var copy = null
        
        if(loggedInUser.blocked_users == null) {
            // loggedInUser.blocked_users = [userData.user_id]
            copy = [userData.user_id]
        } else {
            copy = loggedInUser.blocked_users
            copy.push(userData.user_id)
        }
        console.log(copy)
        
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                blocked_users: copy
            }
            await fetch('http://localhost:5019/Ratings?user_id='+GlobalVariables.userCredential.uid +'&to_user='+uid, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form)
			}).then(response => {
				return response.text()
			  });
        } catch (err) {
            console.log(err)
            
        }
    }
    const SubmitRating = async () => {
        if(rating == null || isNaN(rating)  ) {
            setMessage("Enter a Number 0-5")
            return
        } else if(Number(rating) >5 || Number(rating) < 0) {
            setMessage("Enter a Number 0-5")
            return
        }
        setMessage()
        if(!reviewed) {
            try {
                const form = {
                    user_id: GlobalVariables.userCredential.uid,
                    to_user: uid,
                    rating: rating
                }
                await fetch('http://localhost:5019/Ratings', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form)
                }).then(response => {
                    console.log("SUCCESS")
                    setRating("")
                    return response.text()
                  });
            } catch (err) {
                console.log(err)
                
            }
        } else {
            try {
                const form = {
                    user_id: GlobalVariables.userCredential.uid,
                    to_user: uid,
                    rating: rating
                }
                await fetch('http://localhost:5019/Ratings', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form)
                }).then(response => {
                    console.log("SUCCESS")
                    setRating("")
                    return response.text()
                  });
            } catch (err) {
                console.log(err)
                
            }
        }
    }
    function ShowForm() {
        if(show) {
            return (
                <div className="Column">
                    
                    <div className="Row space-x-[2vw]">
                            <InputStandard autofocus name="Rate User 0-5" defaultValue={rating} onChangeFunction={(e) => setRating(e.target.value)}/>
                            <ButtonImportant text="Submit" onClickFunction={SubmitRating} />
                            
                        
                    </div>  
                    {message !== "" ?
                                <h4 className="TextError p-0 m-0">
                                    {message}
                                </h4> : ""
                    }  
                </div>
            )
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const subject = formData.get('subject');
        const message = formData.get('message');
        const from_name = formData.get('from_name');
        const uid = GlobalVariables.userCredential.uid;

        const templateParams = {
            subject,
            message,
            from_name,
            uid,
        };
        try {
            const response = await emailjs.send('service_ch4bzfr', 'template_k36qghi', templateParams, '5olGsbDDVqcfNCftk');
            console.log('Email successfully sent!', response.status, response.text);
            alert("Issue reported. Thank you!");
            closeReportingMenu();
        } catch (error) {
            console.error('Failed to send email. Error: ', error);
            alert("Failed to send the report. Please try again.");
        }
    };
    const [isReporting, setIsReporting] = useState(false);
    const openReportingMenu = () => setIsReporting(true);
    const closeReportingMenu = () => setIsReporting(false);

    const menuStyle = {
        position: 'fixed',
        top: '75%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
    };
    const closeButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        fontSize: '24px',
    };
    const inputStyle = {
        marginBottom: '10px',
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ccc',
    };
    const submitStyle = {
        cursor: 'pointer',
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
    };

    return (
        <div className="Page">
            <Navbar />

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <PersonInfo personDict={userData} />
                    <h2>{(!(avgRating === null ) ? "User Average Rating: " + avgRating: "")}
                    </h2>
                    
                    <div className="Row space-x-[2vw]">
                    
                        <ButtonImportant text="Block User" onClickFunction={BlockUser}/>
                        <ButtonImportant text="Rate User" onClickFunction={() => {setShow(!show)}}/>
                        <ButtonDelete text="Report User" onClickFunction={openReportingMenu}/>
                        <div>
                            {isReporting && (
                                <div style={menuStyle}>
                                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
                                        <button onClick={closeReportingMenu} style={closeButtonStyle}>×</button>
                                        <input type="text" name="from_name" placeholder="Email" required style={inputStyle} />
                                        <input type="text" name="subject" placeholder="Reason" required style={inputStyle} />
                                        <textarea name="message" placeholder="Details" required style={{...inputStyle, height: '100px'}}></textarea>
                                        <button type="submit" style={submitStyle}>Submit</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                    <ShowForm />

                </div>
            </div>
        </div>
    );


}