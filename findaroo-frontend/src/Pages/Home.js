import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Popup from "../Components/Popup";

export default function Home() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [status, setStatus] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        console.log("GET Call")
        if (GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
        }
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStatus(data.status);
            })
            .catch(error => console.error(error));
    }, []);

    

    const reactivateAccount = () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                status: true
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
        } catch (err) {
            console.log(err)
        } finally {
            navigate("/Profile");
        }
    }

    return (
        <div className="Page">
            <Navbar />

            <Popup isOpen={!status} closePopup={togglePopup}>
                <h2>Reactivate Account?</h2>
                <p>Your account is currently deactivated. Would you like to reactivate it?</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={reactivateAccount}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={() => {GlobalVariables.authenticated = false; navigate("/Login");}}>Close Browser</button>
                </div>
            </Popup>

            <h3>
                This is the home page! Click on the buttons on the Navbar to move to a different page!
            </h3>
        </div>
    );

}
