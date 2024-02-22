import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link, useNavigate } from "react-router-dom";
import { ButtonImportant } from "../Components/Buttons";
import { useEffect } from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import Popup from "../Components/Popup";
import { useState } from "react";


export default function Questions() {
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

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);


    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data = data.lifestyle_answers;
                setStatus(data[0]);
                setRoommatePreferences(data[1]);
                setSmoke(data[2]);
                setRoommateSmoke(data[3]);
                setVisitors(data[4]);
                setRoommateVisitors(data[5]);
                setPets(data[6]);
                setRoommatePets(data[7]);
                setFocus(data[8]);
                setGamingTime(data[9]);
                setTidiness(data[10]);
                setCleaningFrequency(data[11]);
                setNoiseSensitivity(data[12]);
                setSocializingFrequency(data[13]);
                setAlcoholConsumption(data[14]);
                setDrugUse(data[15]);
                setBorrowingFrequency(data[16]);
            })
            .catch(error => console.error(error));

    }, []);

    const submitQuestions = async () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                lifestyle_answers: [
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
            }
            console.log(form);
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
        } finally {
            navigate("/Profile");
        }
    }

    return (
        <div className="Page">
            <Navbar />

            <Popup isOpen={isPopupOpen} closePopup={togglePopup}>
                <h2>Submit Answers?</h2>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={submitQuestions}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={togglePopup}>Cancel</button>
                </div>
            </Popup>

            <h1>
                Lifestyle questions to ensure the best matches!
            </h1>

            <Form>
                <h3>I am currently:</h3>
                <input type="radio" id="student" name="status" value="0" className="radio-option" defaultChecked={status === 0} onChange={(e) => setStatus(e.target.value)} />
                <label htmlFor="student">a Student</label>

                <input type="radio" id="working" name="status" value="1" className="radio-option" defaultChecked={status === 1} onChange={(e) => setStatus(e.target.value)} />
                <label htmlFor="working">Working</label>

                <input type="radio" id="other" name="status" value="2" className="radio-option" onChange={(e) => setStatus(e.target.value)} />
                <label htmlFor="other">Other</label>

                <h3>Do you want your roommate(s) to be the same?</h3>
                <input type="radio" id="roommatePreferences" name="roommatePreferences" value="0" className="radio-option" defaultChecked={status === 0} onChange={(e) => setRoommatePreferences(e.target.value)} />
                <label htmlFor="roommatePreferences">Yes</label>

                <input type="radio" id="roommatePreferences" name="roommatePreferences" value="1" className="radio-option" defaultChecked={status === 1} onChange={(e) => setRoommatePreferences(e.target.value)} />
                <label htmlFor="roommatePreferences">No</label>

                <h3>Do you smoke/vape?</h3>
                <select id="smoke" name="smoke" value={smoke} onChange={(e) => setSmoke(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>Is it okay if your roommate is a smoker and/or vapes:</h3>
                <select id="roommateSmoke" name="roommateSmoke" value={roommateSmoke} onChange={(e) => setRoommateSmoke(e.target.value)}>
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>How often do you have visitors (friends, family, relationships) over?</h3>
                <select id="visitors" name="visitors" value={visitors} onChange={(e) => setVisitors(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>Is it okay if your roommate has visitors over, and if so how often?</h3>
                <select id="roommateVisitors" name="roommateVisitors" value={roommateVisitors} onChange={(e) => setRoommateVisitors(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>Do you have any pets?</h3>
                <select id="0" name="pets" value={pets} onChange={(e) => setPets(e.target.value)}>
                    <option value="1">No</option>
                    <option value="2">Yes</option>
                </select>

                <h3>Is it okay if your roommate has pets?</h3>
                <select id="roommatePets" name="roommatePets" value={roommatePets} onChange={(e) => setRoommatePets(e.target.value)}>
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>What is your primary focus?</h3>
                <select id="focus" name="focus" value={focus} onChange={(e) => setFocus(e.target.value)}>
                    <option value="0">Studies</option>
                    <option value="0">Work</option>
                    <option value="1">Social Life</option>
                    <option value="1">Hobbies</option>
                </select>

                <h3>How much time do you spend playing video games per week:</h3>
                <select id="gamingTime" name="gamingTime" value={gamingTime} onChange={(e) => setGamingTime(e.target.value)}>
                    <option value="0">None</option>
                    <option value="1">Less than 5 hours</option>
                    <option value="2">5 to 10 hours</option>
                    <option value="3">More than 10 hours</option>
                </select>

                <h3>How tidy of a person are you:</h3>
                <select id="tidiness" name="tidiness" value={tidiness} onChange={(e) => setTidiness(e.target.value)}>
                    <option value="0">Very Tidy</option>
                    <option value="1">Average</option>
                    <option value="2">Not Tidy</option>
                </select>

                <h3>How often do you clean your living space:</h3>
                <select id="cleaningFrequency" name="cleaningFrequency" value={cleaningFrequency} onChange={(e) => setCleaningFrequency(e.target.value)}>
                    <option value="0">Daily</option>
                    <option value="1">Weekly</option>
                    <option value="2">Monthly</option>
                </select>

                <h3>How much does noise bother you while studying/working:</h3>
                <select id="noiseSensitivity" name="noiseSensitivity" value={noiseSensitivity} onChange={(e) => setNoiseSensitivity(e.target.value)}>
                    <option value="0">A lot</option>
                    <option value="1">A little</option>
                    <option value="2">Not at all</option>
                </select>

                <h3>How often do you go out to socialize:</h3>
                <select id="socializingFrequency" name="socializingFrequency" value={socializingFrequency} onChange={(e) => setSocializingFrequency(e.target.value)}>
                    <option value="0">Rarely</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                <h3>How often do you drink alcohol:</h3>
                <select id="alcoholConsumption" name="alcoholConsumption" value={alcoholConsumption} onChange={(e) => setAlcoholConsumption(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>How often do you use recreational drugs:</h3>
                <select id="drugUse" name="drugUse" value={drugUse} onChange={(e) => setDrugUse(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>How often do you borrow your friend's or sibling's personal items?</h3>
                <select id="borrowingFrequency" name="borrowingFrequency" value={borrowingFrequency} onChange={(e) => setBorrowingFrequency(e.target.value)}>
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                <ButtonImportant text="Submit" onClickFunction={togglePopup} />
            </Form>
            <p> </p>
        </div>
    );

}

