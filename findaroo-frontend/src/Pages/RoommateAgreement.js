import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link, useLocation, useNavigate } from "react-router-dom";
import ButtonStandard, { ButtonImportant } from "../Components/Buttons";
import { useEffect } from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import Popup from "../Components/Popup";
import { useState } from "react";
import { getAuth } from "firebase/auth";


export default function RoommateAgreement() {
    const [status, setStatus] = useState(0);
    const [roommatePreferences, setRoommatePreferences] = useState(0);
    const [smoke, setSmoke] = useState(0);
    const [roommateSmoke, setRoommateSmoke] = useState(0);
    const [visitors, setVisitors] = useState(0);
    const [roommateVisitors, setRoommateVisitors] = useState(0);
    const [pets, setPets] = useState(0);
    const [roommatePets, setRoommatePets] = useState(0);
    const [focus, setFocus] = useState(0);
    const [gamingTime, setGamingTime] = useState(0);
    const [tidiness, setTidiness] = useState(0);
    const [cleaningFrequency, setCleaningFrequency] = useState(0);
    const [noiseSensitivity, setNoiseSensitivity] = useState(0);
    const [socializingFrequency, setSocializingFrequency] = useState(0);
    const [alcoholConsumption, setAlcoholConsumption] = useState(0);
    const [drugUse, setDrugUse] = useState(0);
    const [borrowingFrequency, setBorrowingFrequency] = useState(0);

    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const location = useLocation();
    const auth = getAuth();
    //console.log(location.state);
    
    const [receiver_name, setReceiverName] = useState("");
    const [receiver_id, setReceiverId] = useState("");
    const [room_id, setRoomId] = useState("");
    const [is_sender, setIsSender] = useState(true);
    const [sender_id, setSenderId] = useState("");
    const [agreement_form, setAgreementForm] = useState(null);
    const [is_review, setIsReview] = useState(false);
    const [sender_name, setSenderName] = useState("");

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
        if (location == null || location.state == null) {
            navigate("/Profile/MyRooms");
        } else {
            setReceiverName(location.state.name);
            setReceiverId(location.state.receiver_id);
            setRoomId(location.state.room_id);
            setIsSender(location.state.is_sender);
            setSenderName(location.state.sender_name);
            setSenderId(location.state.sender_id);
            if (location.state.agreement_form == null) {
                fetch('http://localhost:5019/User?user_id=' + auth.currentUser.uid)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        populateAgreementForm(data.lifestyle_answers);
                    })
                    .catch(error => console.error(error));
            } else {
                setAgreementForm(location.state.agreement_form);
            }
            
        }
        
    }, []);

    useEffect(() => {
        if (agreement_form != null) {
            setIsReview(true);
            populateAgreementForm(agreement_form);
        }
    }, [agreement_form]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <div className="Page">
            <Navbar />

            <h1>
                Review your roommate agreement with {receiver_name}
            </h1>
            <h5>
                Agreement form has been auto-filled with your lifestyle preferences.
            </h5>

            <Form>
                <h3>{is_sender ? 
                    'Do you smoke/vape?': 
                    `${sender_name} smoke/vape`}</h3>
                <select id="smoke" name="smoke" value={smoke} onChange={(e) => setSmoke(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>{is_sender ? 
                    `Is it okay if ${receiver_name} is a smoker and/or vapes:`:
                    `${sender_name} preference on you vaping/smoking:`}</h3>
                <select id="roommateSmoke" name="roommateSmoke" value={roommateSmoke} onChange={(e) => setRoommateSmoke(e.target.value)}>
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you have visitors (friends, family, relationships) over?`:
                    `How often ${sender_name} have visitors (friends, family, relationships) over:`}</h3>
                <select id="visitors" name="visitors" value={visitors} onChange={(e) => setVisitors(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>{is_sender ? 
                    `Is it okay if ${receiver_name} has visitors over, and if so how often?`:
                    `${sender_name} preference on you having visitors over:`}</h3>
                <select id="roommateVisitors" name="roommateVisitors" value={roommateVisitors} onChange={(e) => setRoommateVisitors(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>{is_sender ? 
                    `Do you have any pets?`: 
                    `Can ${sender_name} have pets?`}</h3>
                <select id="0" name="pets" value={pets} onChange={(e) => setPets(e.target.value)}>
                    <option value="1">No</option>
                    <option value="2">Yes</option>
                </select>

                <h3>{is_sender ? 
                    `Is it okay if ${receiver_name} has pets?`: 
                    `${sender_name} preference on you having pets:`}</h3>
                <select id="roommatePets" name="roommatePets" value={roommatePets} onChange={(e) => setRoommatePets(e.target.value)}>
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>{is_sender ?
                    `What is your primary focus?`: 
                    `${sender_name} primary focus:`}</h3>
                <select id="focus" name="focus" value={focus} onChange={(e) => setFocus(e.target.value)}>
                    <option value="0">Studies</option>
                    <option value="0">Work</option>
                    <option value="1">Social Life</option>
                    <option value="1">Hobbies</option>
                </select>

                <h3>{is_sender ? 
                    `How much time do you spend playing video games per week:`: 
                    `How much time ${sender_name} spends playing video games per week:`}</h3>
                <select id="gamingTime" name="gamingTime" value={gamingTime} onChange={(e) => setGamingTime(e.target.value)}>
                    <option value="0">None</option>
                    <option value="1">Less than 5 hours</option>
                    <option value="2">5 to 10 hours</option>
                    <option value="3">More than 10 hours</option>
                </select>

                <h3>{is_sender ? 
                    `How tidy of a person are you:`: 
                    `${sender_name} tidyness:`}</h3>
                <select id="tidiness" name="tidiness" value={tidiness} onChange={(e) => setTidiness(e.target.value)}>
                    <option value="0">Very Tidy</option>
                    <option value="1">Average</option>
                    <option value="2">Not Tidy</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you clean your living space:`: 
                    `How often ${sender_name} cleans their living space:`}</h3>
                <select id="cleaningFrequency" name="cleaningFrequency" value={cleaningFrequency} onChange={(e) => setCleaningFrequency(e.target.value)}>
                    <option value="0">Daily</option>
                    <option value="1">Weekly</option>
                    <option value="2">Monthly</option>
                </select>

                <h3>{is_sender ? 
                    `How much does noise bother you while studying/working:`: 
                    `How much does noise bother ${sender_name} while studying/working:`}</h3>
                <select id="noiseSensitivity" name="noiseSensitivity" value={noiseSensitivity} onChange={(e) => setNoiseSensitivity(e.target.value)}>
                    <option value="0">A lot</option>
                    <option value="1">A little</option>
                    <option value="2">Not at all</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you go out to socialize:`:
                    `How often ${sender_name} goes out to socialize:`}</h3>
                <select id="socializingFrequency" name="socializingFrequency" value={socializingFrequency} onChange={(e) => setSocializingFrequency(e.target.value)}>
                    <option value="0">Rarely</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you drink alcohol:`: 
                    `How often ${sender_name} drinks alcohol:`}</h3>
                <select id="alcoholConsumption" name="alcoholConsumption" value={alcoholConsumption} onChange={(e) => setAlcoholConsumption(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you use recreational drugs:`: 
                    `How often ${sender_name} uses recreational drugs:`}</h3>
                <select id="drugUse" name="drugUse" value={drugUse} onChange={(e) => setDrugUse(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>{is_sender ? 
                    `How often do you borrow your friend's or sibling's personal items?`: 
                    `How often ${sender_name} borrows personal items:`}</h3>
                <select id="borrowingFrequency" name="borrowingFrequency" value={borrowingFrequency} onChange={(e) => setBorrowingFrequency(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                {is_review ? 
                    <div>
                        <ButtonStandard text="Update Agreement Form" onClickFunction={updateRoommateInvitation}/>
                        <ButtonImportant text="Accept Invitation" onClickFunction={acceptRoommateInvitation}/>
                        <ButtonStandard text="Delete Invitation" onClickFunction={deleteRoommateInvitation}/>
                    </div>
                    :
                    <ButtonImportant text="Submit" onClickFunction={sendRoommateInvitation} />
                }
            </Form>
            <p> </p>
        </div>
    );
    
    async function sendRoommateInvitation() {
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateInvitation/send`, {
            method:"POST",
            credentials:"include",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "room_id": room_id, 
                "receiver_id": receiver_id,
                "roommate_agreement": [
                    status,
                    roommatePreferences,
                    smoke,
                    roommateSmoke,
                    visitors,
                    roommateVisitors,
                    pets,
                    roommatePets,
                    focus,
                    gamingTime,
                    tidiness,
                    cleaningFrequency,
                    noiseSensitivity,
                    socializingFrequency,
                    alcoholConsumption,
                    drugUse,
                    borrowingFrequency
                ]
            })
        });
        navigate("/Profile/MyRooms");
    }

    async function updateRoommateInvitation() {
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateInvitation/update`, {
            method:"PUT",
            credentials:"include",
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "room_id": room_id,
                "sender_id": sender_id, 
                "receiver_id": receiver_id,
                "roommate_agreement": [
                    status,
                    roommatePreferences,
                    smoke,
                    roommateSmoke,
                    visitors,
                    roommateVisitors,
                    pets,
                    roommatePets,
                    focus,
                    gamingTime,
                    tidiness,
                    cleaningFrequency,
                    noiseSensitivity,
                    socializingFrequency,
                    alcoholConsumption,
                    drugUse,
                    borrowingFrequency
                ]
            })
        });
    }

    async function acceptRoommateInvitation() {
        console.log(receiver_id);
        console.log(sender_id);
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateInvitation/accept`, {
            method:'POST',
            credentials:'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "room_id": room_id
            })
        })
        navigate("/Profile/MyRooms/RoommateInvitations");
    }

    async function deleteRoommateInvitation() {
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateInvitation`, {
            method:'DELETE',
            credentials:'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                "sender_id": sender_id,
                "receiver_id": receiver_id,
                "room_id": room_id
            })
        })
        navigate("/Profile/MyRooms/RoommateInvitations");
    }

    function populateAgreementForm(agreement_form) {
        setStatus(agreement_form[0]);
        setRoommatePreferences(agreement_form[1]);
        setSmoke(agreement_form[2]);
        setRoommateSmoke(agreement_form[3]);
        setVisitors(agreement_form[4]);
        setRoommateVisitors(agreement_form[5]);
        setPets(agreement_form[6]);
        setRoommatePets(agreement_form[7]);
        setFocus(agreement_form[8]);
        setGamingTime(agreement_form[9]);
        setTidiness(agreement_form[10]);
        setCleaningFrequency(agreement_form[11]);
        setNoiseSensitivity(agreement_form[12]);
        setSocializingFrequency(agreement_form[13]);
        setAlcoholConsumption(agreement_form[14]);
        setDrugUse(agreement_form[15]);
        setBorrowingFrequency(agreement_form[16]);
    }
}

