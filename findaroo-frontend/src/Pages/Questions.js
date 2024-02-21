import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link, useNavigate } from "react-router-dom";
import { ButtonImportant } from "../Components/Buttons";
import {useEffect} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import Popup from "../Components/Popup";
import { useState } from "react";

// Question answers
var status = document.querySelector('input[name="status"]:checked')?.value ?? "Not specified";
var smoke = document.getElementById("smoke")?.value ?? "Not specified";
var roommateSmoke = document.getElementById("roommateSmoke")?.value ?? "Not specified";
var visitors = document.getElementById("visitors")?.value ?? "Not specified";
var roommateVisitors = document.getElementById("roommateVisitors")?.value ?? "Not specified";
var pets = document.getElementById("pets")?.value ?? "Not specified";
var roommatePets = document.getElementById("roommatePets")?.value ?? "Not specified";
var focus = document.getElementById("focus")?.value ?? "Not specified";
var gamingTime = document.getElementById("gamingTime")?.value ?? "Not specified";
var tidiness = document.getElementById("tidiness")?.value ?? "Not specified";
var cleaningFrequency = document.getElementById("cleaningFrequency")?.value ?? "Not specified";
var noiseSensitivity = document.getElementById("noiseSensitivity")?.value ?? "Not specified";
var socializingFrequency = document.getElementById("socializingFrequency")?.value ?? "Not specified";
var alcoholConsumption = document.getElementById("alcoholConsumption")?.value ?? "Not specified";
var drugUse = document.getElementById("drugUse")?.value ?? "Not specified";
var borrowingFrequency = document.getElementById("borrowingFrequency")?.value ?? "Not specified";


export default function Questions() {
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
                <input type="radio" id="student" name="status" value="0" class="radio-option" />
                <label for="student">a Student</label>

                <input type="radio" id="working" name="status" value="1" class="radio-option" />
                <label for="working">Working</label>

                <input type="radio" id="other" name="status" value="2" class="radio-option" />
                <label for="other">Other</label>

                <h3>Do you smoke/vape?</h3>
                <select id="smoke" name="smoke">
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>Is it okay if your roommate is a smoker and/or vapes:</h3>
                <select id="roommateSmoke" name="roommateSmoke">
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>How often do you have visitors (friends, family, relationships) over?</h3>
                <select id="visitors" name="visitors">
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>Is it okay if your roommate has visitors over, and if so how often?</h3>
                <select id="roommateVisitors" name="roommateVisitors">
                    <option value="0">Never</option>
                    <option value="1">Sometimes</option>
                    <option value="2">Often</option>
                </select>

                <h3>Do you have any pets?</h3>
                <select id="0" name="pets">
                    <option value="1">No</option>
                    <option value="2">Yes</option>
                </select>

                <h3>Is it okay if your roommate has pets?</h3>
                <select id="roommatePets" name="roommatePets">
                    <option value="0">Yes</option>
                    <option value="1">No</option>
                    <option value="2">Indifferent</option>
                </select>

                <h3>What is your primary focus?</h3>
                <select id="focus" name="focus">
                    <option value="0">Studies</option>
                    <option value="0">Work</option>
                    <option value="1">Social Life</option>
                    <option value="1">Hobbies</option>
                </select>

                <h3>How much time do you spend playing video games per week:</h3>
                <select id="gamingTime" name="gamingTime">
                    <option value="0">None</option>
                    <option value="1">Less than 5 hours</option>
                    <option value="2">5 to 10 hours</option>
                    <option value="3">More than 10 hours</option>
                </select>

                <h3>How tidy of a person are you:</h3>
                <select id="tidiness" name="tidiness">
                    <option value="0">Very Tidy</option>
                    <option value="1">Average</option>
                    <option value="2">Not Tidy</option>
                </select>

                <h3>How often do you clean your living space:</h3>
                <select id="cleaningFrequency" name="cleaningFrequency">
                    <option value="0">Daily</option>
                    <option value="1">Weekly</option>
                    <option value="2">Monthly</option>
                </select>

                <h3>How much does noise bother you while studying/working:</h3>
                <select id="noiseSensitivity" name="noiseSensitivity">
                    <option value="0">A lot</option>
                    <option value="1">A little</option>
                    <option value="2">Not at all</option>
                </select>

                <h3>How often do you go out to socialize:</h3>
                <select id="socializingFrequency" name="socializingFrequency">
                    <option value="0">Rarely</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                <h3>How often do you drink alcohol:</h3>
                <select id="alcoholConsumption" name="alcoholConsumption">
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>How often do you use recreational drugs:</h3>
                <select id="drugUse" name="drugUse">
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Regularly</option>
                </select>

                <h3>How often do you borrow your friend's or sibling's personal items?</h3>
                <select id="borrowingFrequency" name="borrowingFrequency">
                    <option value="0">Never</option>
                    <option value="1">Occasionally</option>
                    <option value="2">Frequently</option>
                </select>

                <ButtonImportant text="Submit" onClickFunction={submit} />
            </Form>
            <p> </p>
        </div>
    );

    function storeAnswers() {
        // Using the nullish coalescing operator (??) to provide default values
        status = document.querySelector('input[name="status"]:checked')?.value ?? "Not specified";
        smoke = document.getElementById("smoke")?.value ?? "Not specified";
        roommateSmoke = document.getElementById("roommateSmoke")?.value ?? "Not specified";
        visitors = document.getElementById("visitors")?.value ?? "Not specified";
        roommateVisitors = document.getElementById("roommateVisitors")?.value ?? "Not specified";
        pets = document.getElementById("pets")?.value ?? "Not specified";
        roommatePets = document.getElementById("roommatePets")?.value ?? "Not specified";
        focus = document.getElementById("focus")?.value ?? "Not specified";
        gamingTime = document.getElementById("gamingTime")?.value ?? "Not specified";
        tidiness = document.getElementById("tidiness")?.value ?? "Not specified";
        cleaningFrequency = document.getElementById("cleaningFrequency")?.value ?? "Not specified";
        noiseSensitivity = document.getElementById("noiseSensitivity")?.value ?? "Not specified";
        socializingFrequency = document.getElementById("socializingFrequency")?.value ?? "Not specified";
        alcoholConsumption = document.getElementById("alcoholConsumption")?.value ?? "Not specified";
        drugUse = document.getElementById("drugUse")?.value ?? "Not specified";
        borrowingFrequency = document.getElementById("borrowingFrequency")?.value ?? "Not specified";

        // Log values to the console or store them as needed
        console.log("Status:", status);
        console.log("Smoke:", smoke);
        console.log("Roommate Smoke:", roommateSmoke);
        console.log("Visitors:", visitors);
        console.log("Roommate Visitors:", roommateVisitors);
        console.log("Pets:", pets);
        console.log("Roommate Pets:", roommatePets);
        console.log("Focus:", focus);
        console.log("Gaming Time:", gamingTime);
        console.log("Tidiness:", tidiness);
        console.log("Cleaning Frequency:", cleaningFrequency);
        console.log("Noise Sensitivity:", noiseSensitivity);
        console.log("Socializing Frequency:", socializingFrequency);
        console.log("Alcohol Consumption:", alcoholConsumption);
        console.log("Drug Use:", drugUse);
        console.log("Borrowing Frequency:", borrowingFrequency);
    }

    // Call storeAnswers function when appropriate, for example, after form submission


    function submit() {
        storeAnswers();
        togglePopup();
    }

    function submitQuestions() {
        //integer array of answers
        var answers = [status, smoke, roommateSmoke, visitors, roommateVisitors, pets, roommatePets, focus, gamingTime, tidiness, cleaningFrequency, noiseSensitivity, socializingFrequency, alcoholConsumption, drugUse, borrowingFrequency];

        console.log("Submitting questions");
        console.log("Status: " + status);
        console.log("Smoke: " + smoke);
        console.log("Roommate Smoke: " + roommateSmoke);
        console.log("Visitors: " + visitors);
        console.log("Roommate Visitors: " + roommateVisitors);
        console.log("Pets: " + pets);
        console.log("Roommate Pets: " + roommatePets);
        console.log("Focus: " + focus);
        console.log("Gaming Time: " + gamingTime);
        console.log("Tidiness: " + tidiness);
        console.log("Cleaning Frequency: " + cleaningFrequency);
        console.log("Noise Sensitivity: " + noiseSensitivity);
        console.log("Socializing Frequency: " + socializingFrequency);
        console.log("Alcohol Consumption: " + alcoholConsumption);
        console.log("Drug Use: " + drugUse);
        console.log("Borrowing Frequency: " + borrowingFrequency);

        //TODO: Backend call to submit questions
        sendAnswers(answers);
        navigate("/Profile");
    }

    // Function to send answers to the backend
    async function sendAnswers(answers) {
        // Send answers to the backend
        // For example, using fetch
        const response = await fetch("http://localhost:5019/User", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"sending": 1, "answers": answers}),
        });
    }
}

