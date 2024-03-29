import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonDelete, ButtonImportant } from "../Components/Buttons";
import 'react-confirm-alert/src/react-confirm-alert.css';
import PersonInfo from "../Components/PersonInfo";
import InputStandard from "../Components/InputFields";
import emailjs from "emailjs-com";

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
    const [compScore, setCompScore] = useState(0)   

    useEffect(() => {
        console.log(GlobalVariables.isMod)
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
                    if(data[i].user_id === GlobalVariables.userCredential.uid) {
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

        calculateSimilarity();
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
            await fetch('http://localhost:5019/User', {
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
        setReviewed(true)
        updateRating();
    }

    const updateRating = async () => {
        try {
            console.log("updating rating of user" + uid)
            const form = {
                user_id: uid,
                rating: avgRating
            }
            await fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                console.log("SUCCESS")
                return response.text()
            });
        } catch (err) {
            console.log(err)
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

    const DeleteAccount = async () => {
        let answer = window.confirm("This record will be removed from Findaroo. Are you sure?");
        if (!answer) return;
        await fetch(GlobalVariables.backendURL + "/User", {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({"user_id": uid})
        })
        .catch(error => console.error(error));
    }
    const DeleteBiography = async () => {
        let answer = window.confirm("This biography will be removed from Findaroo. Are you sure?");
        if (!answer) return;
        var copy = userData;
        copy.preferences = ""
        
        setUserData(copy)
        await fetch(GlobalVariables.backendURL + "/User", {
            mode: 'cors',
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({"user_id": uid, "preferences": ""})
        })
        .catch(error => console.error(error));
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

                    {/* <h2>Compatibility Score: {calculateSimilarity} </h2> */}
                    
                    <div className="Row space-x-[2vw]">
                                     

                        <ButtonImportant text="Block User" onClickFunction={BlockUser}/>
                        <ButtonImportant text="Rate User" onClickFunction={() => {setShow(!show)}}/>
                        <ButtonDelete text="Report User" onClickFunction={openReportingMenu}/>
                        {GlobalVariables.isMod ? <ButtonDelete text="Delete Account" onClickFunction={DeleteAccount}/>: ""}
                        {GlobalVariables.isMod ? <ButtonDelete text="Delete Biography" onClickFunction={DeleteBiography}/>: ""}

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

    function calculateSimilarity() {
        var total_sim = 5;
        if (userData != null) {

            // if (userData.min_price == null && userData.max_price == null) {
            //     return "Please fill out preferences to view similarity";
            // }

            // if (loggedInUser.min_price == null && loggedInUser.max_price == null) {
            //     return "This user has not filled out their preferences";
            // }

            if (loggedInUser.age != null && userData.age != null) {
                if (Math.abs(loggedInUser.min_price - userData.min_price) > 5) {
                    total_sim -= 0.35;
                }
            }

            if (loggedInUser.min_price != null && userData.min_price != null) {
                if (Math.abs(loggedInUser.min_price - userData.min_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (loggedInUser.max_price != null && userData.max_price != null) {
                if (Math.abs(loggedInUser.max_price - userData.max_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (loggedInUser.school != null && userData.school != null) {
                if (loggedInUser.school !== userData.school) {
                    total_sim -= 1;
                }
            }
            if (loggedInUser.state != null && userData.state != null) {
                if (loggedInUser.state !== userData.state) {
                    total_sim -= 0.5;
                }
            }
            if (loggedInUser.rating) {
                if (loggedInUser.rating < 3) {
                    total_sim -= 0.5;
                }
            }

            var questions = loggedInUser.lifestyle_answers;
            var userQuestions = userData.lifestyle_answers;

            var lifestyle_sim = 0;

            if (questions != null && userQuestions != null) {
                lifestyle_sim += 10 - Math.abs(questions[0] - userQuestions[0]) * 5;

                if (questions[1] === 1 || userQuestions[1] === 1) {
                    if (questions[0] !== userQuestions[0]) {
                        lifestyle_sim *= 0;
                    }
                }

                lifestyle_sim += 10 - Math.abs(questions[2] - userQuestions[2]) * 5;

                if (questions[3] === 1 || userQuestions[3] === 1) {
                    if (questions[2] !== userQuestions[2]) {
                        lifestyle_sim *= 0;
                    }
                }

                lifestyle_sim += 10 - Math.abs(questions[4] - userQuestions[4]) * 5;

                if (questions[5] === 1 || userQuestions[5] === 1) {
                    if (questions[4] !== userQuestions[4]) {
                        lifestyle_sim *= 0;
                    }
                }

                if (questions[6] === userQuestions[6]) {
                    lifestyle_sim += 5;
                }

                if (questions[7] === 1) {
                    if (userQuestions[6] === 0) {
                        lifestyle_sim *= 0;
                    }
                }
                if (userQuestions[7] === 1) {
                    if (questions[6] === 0) {
                        lifestyle_sim *= 0;
                    }
                }

                if (questions[8] === userQuestions[8]) {
                    lifestyle_sim += 5;
                }

                lifestyle_sim += 10 - Math.abs(questions[9] - userQuestions[9]) * 3.33;

                lifestyle_sim += 20 - Math.abs(questions[10] - userQuestions[10]) * 10;

                lifestyle_sim += 10 - Math.abs(questions[11] - userQuestions[11]) * 5;

                lifestyle_sim += 20 - Math.abs(questions[12] - userQuestions[12]) * 10;

                lifestyle_sim += 10 - Math.abs(questions[13] - userQuestions[13]) * 5;

                lifestyle_sim += 20 - Math.abs(questions[14] - userQuestions[14]) * 10;

                lifestyle_sim += 20 - Math.abs(questions[15] - userQuestions[15]) * 10;

                lifestyle_sim += 20 - Math.abs(questions[16] - userQuestions[16]) * 10;

            }
        }

        //TODO: set total_sim as person rating
        if (lifestyle_sim + total_sim < 0) {
            total_sim = 0;
        }

        total_sim *= 10;
        total_sim = Math.round(total_sim * 100) / 100;

        lifestyle_sim *= (50 / 170);
        lifestyle_sim = Math.round(lifestyle_sim * 100) / 100;

        setCompScore(total_sim + lifestyle_sim);
        return total_sim + lifestyle_sim;
    }


}