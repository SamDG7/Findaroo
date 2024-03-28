import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant, ButtonWithNotification} from "../Components/Buttons";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getAuth, deleteUser } from "firebase/auth";
import PersonInfo from "../Components/PersonInfo";
import Popup from "../Components/Popup";
import { signOut } from "firebase/auth";
import SettingsButton from "../Components/SettingsButton";
import emailjs from 'emailjs-com';

export default function Profile() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const auth = getAuth();

    const [requestCount, setData] = useState(1)


    const [userData, setUserData] = useState(null);

    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);
    const openSettingsMenu = () => setIsSettingsMenuOpen(true);
    const closeSettingsMenu = () => setIsSettingsMenuOpen(false);

    const openReportForm = () => {
        setIsSettingsMenuOpen(false); // Close settings menu
        setIsReportFormOpen(true); // Open report form
      };

    const closeReportForm = () => setIsReportFormOpen(false);

    useEffect(() => {

        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                //console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));

        ConnectionRequestsCount();
    }, []);

    const deactivateAccount = () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                status: false
            }
            console.log(form);
            fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                return response.text()
            });
        }catch (err) {
            console.log(err)
        } finally {
            GlobalVariables.authenticated = false;
            const auth = getAuth();
            signOut(auth);
            navigate("/Login");
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const subject = formData.get('subject');
        const message = formData.get('message');
        const from_name = formData.get('from_name');


        const templateParams = {
            subject, 
            message, 
            from_name,
        };
        try {
            const response = await emailjs.send('service_ch4bzfr', 'template_s92oqad', templateParams, '5olGsbDDVqcfNCftk');
            console.log('Email successfully sent!', response.status, response.text);
            alert("Issue reported. Thank you!");
            closeReportForm();
          } catch (error) {
            console.error('Failed to send email. Error: ', error);
            alert("Failed to send the report. Please try again.");
          }
      };

      const menuStyle = {
        position: 'fixed',
        top: '50%',
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
            <Navbar/>

            <Popup isOpen={isPopupOpen} closePopup={togglePopup}>
                <h2>Deactivate Account</h2>
                <p>Are you sure you want to deactivate your account?</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={deactivateAccount}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={togglePopup}>Cancel</button>
                </div>
            </Popup>

            
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <PersonInfo personDict={userData}/>
                    <div className="Column Start">
                        <div className="Row space-x-[2vw]">
                            <Link to="/Profile/Edit">
                                <ButtonImportant text="Edit Profile"/>
                            </Link>
                            <Link to="/Profile/Photo">
                                <ButtonImportant text="Change Photo"/>
                            </Link>
                            <Link to="/Profile/Preferences">
                                <ButtonImportant text="Edit Preferences"/>
                            </Link>
                            <Link to="/Profile/Questions">
                                <ButtonImportant text="Compatibility Questions"/>
                            </Link>
                        </div>
                        <div className="Row space-x-[2vw]">
                            <Link to="/Profile/MyRooms">
                                <ButtonStandard text="My Rooms"/>
                            </Link>
                            <ButtonStandard text="My Connections" onClickFunction={() => {navigate("/Profile/MyConnections");}}/>
                            <ButtonWithNotification text="Connection Requests" count={requestCount} onClickFunction={() => {navigate("/Profile/MyConnectionRequests");}}/>
                            <ButtonStandard text="Blocked Users" onClickFunction={() => {navigate("/Profile/BlockedUsers");}}/>
                            <ButtonStandard text="My Reviews"/>
                        </div>
                        <div className="Row space-x-[2vw]">
                            <ButtonDelete text="Disable Account" onClickFunction={togglePopup}/>
                            <ButtonDelete text="Delete Account" onClickFunction={DeleteAccountCall}/>
                            <div>
                                <SettingsButton onClick={openSettingsMenu}/>
                                {isSettingsMenuOpen && (
                                    <div style={{
                                    position: 'fixed',
                                    top: '20%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: '#fff',
                                    padding: '30px',
                                    borderRadius: '5px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    zIndex: 1000, // Ensure the menu is above other content
                                    }}>
                                    <button onClick={closeSettingsMenu} style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'none',
                                        fontSize: '24px',
                                    }}>×</button>
                                        <ButtonStandard text="Report an Issue" onClickFunction={openReportForm}/>
                                    </div>
                                )}
                                {isReportFormOpen && (
                                    <div style={menuStyle}>
                                    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
                                        <button onClick={closeReportForm} style={closeButtonStyle}>×</button>
                                        <input type="text" name="from_name" placeholder="Email" required style={inputStyle} />
                                        <input type="text" name="subject" placeholder="Subject" required style={inputStyle} />
                                        <textarea name="message" placeholder="Message" required style={{...inputStyle, height: '100px'}}></textarea>
                                        <button type="submit" style={submitStyle}>Submit</button>
                                    </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    

    async function ConnectionRequestsCount() {
        const response = await fetch(GlobalVariables.backendURL + "/ConnectionRequest/received?user_id=" + auth.currentUser.uid);
        const connections = await response.json();
        setData(connections.length);
    } 

    async function DeleteAccountCall() {
        let answer = window.confirm("Your record will be removed from Findaroo. Are you sure?");
        if (!answer) return;
        const auth = getAuth();
        var toBeDeleted = auth.currentUser;
        var user_id = auth.currentUser.uid;

        deleteUser(toBeDeleted).catch((error) => {
            console.log(error)
        })

        await fetch(GlobalVariables.backendURL + "/User", {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({"user_id": user_id})
        })
        .catch(error => console.error(error));

        GlobalVariables.authenticated = false;
        navigate("/Login");
    }

}