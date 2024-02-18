import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link } from "react-router-dom";
import { ButtonImportant } from "../Components/Buttons";
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

    // const [isPopupOpen, setIsPopupOpen] = useState(false);

    // const togglePopup = () => {
    //     setIsPopupOpen(!isPopupOpen);
    // };

    return (
        <div className="Page">
            <Navbar />
            {/* <button onClick={togglePopup}>Toggle Popup</button>

            <Popup isOpen={isPopupOpen} closePopup={togglePopup} yesText={"Yes"} noText={"Skip For Now"}>
                <h2>Answer Lifestyle Questions?</h2>
                <p>Answering these questions will help us personalize your experience to find you the most compatible roommates!</p>
            </Popup> */}
            <h1>
                Lifestyle questions to ensure the best matches!
            </h1>

            <Form>
                <h3>I am currently:</h3>
                <input type="radio" id="student" name="status" value="student" class="radio-option" />
                <label for="student">a Student</label>



                <input type="radio" id="working" name="status" value="working" class="radio-option" />
                <label for="working">Working</label>

                <input type="radio" id="other" name="status" value="other" class="radio-option" />
                <label for="other">Other</label>

                <h3>Do you smoke/vape?</h3>
                <select id="smoke" name="smoke">
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="regularly">Regularly</option>
                </select>

                <h3>Is it okay if your roommate is a smoker and/or vapes:</h3>
                <select id="roommateSmoke" name="roommateSmoke">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="indifferent">Indifferent</option>
                </select>

                <h3>How often do you have visitors (friends, family, relationships) over?</h3>
                <select id="visitors" name="visitors">
                    <option value="never">Never</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="often">Often</option>
                </select>

                <h3>Is it okay if your roommate has visitors over, and if so how often?</h3>
                <select id="roommateVisitors" name="roommateVisitors">
                    <option value="never">Never</option>
                    <option value="sometimes">Sometimes</option>
                    <option value="often">Often</option>
                </select>

                <h3>Do you have any pets?</h3>
                <select id="pets" name="pets">
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>

                <h3>Is it okay if your roommate has pets?</h3>
                <select id="roommatePets" name="roommatePets">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="indifferent">Indifferent</option>
                </select>

                <h3>What is your primary focus?</h3>
                <select id="focus" name="focus">
                    <option value="studies">Studies</option>
                    <option value="work">Work</option>
                    <option value="socialLife">Social Life</option>
                    <option value="hobbies">Hobbies</option>
                </select>

                <h3>How much time do you spend playing video games per week:</h3>
                <select id="gamingTime" name="gamingTime">
                    <option value="none">None</option>
                    <option value="lessThan5">Less than 5 hours</option>
                    <option value="5to10">5 to 10 hours</option>
                    <option value="moreThan10">More than 10 hours</option>
                </select>

                <h3>How tidy of a person are you:</h3>
                <select id="tidiness" name="tidiness">
                    <option value="veryTidy">Very Tidy</option>
                    <option value="average">Average</option>
                    <option value="notTidy">Not Tidy</option>
                </select>

                <h3>How often do you clean your living space:</h3>
                <select id="cleaningFrequency" name="cleaningFrequency">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                </select>

                <h3>How much does noise bother you while studying/working:</h3>
                <select id="noiseSensitivity" name="noiseSensitivity">
                    <option value="aLot">A lot</option>
                    <option value="aLittle">A little</option>
                    <option value="notAtAll">Not at all</option>
                </select>

                <h3>How often do you go out to socialize:</h3>
                <select id="socializingFrequency" name="socializingFrequency">
                    <option value="rarely">Rarely</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="frequently">Frequently</option>
                </select>

                <h3>How often do you drink alcohol:</h3>
                <select id="alcoholConsumption" name="alcoholConsumption">
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="regularly">Regularly</option>
                </select>

                <h3>How often do you use recreational drugs:</h3>
                <select id="drugUse" name="drugUse">
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="regularly">Regularly</option>
                </select>

                <h3>How often do you borrow your friend's or sibling's personal items?</h3>
                <select id="borrowingFrequency" name="borrowingFrequency">
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="frequently">Frequently</option>
                </select>

                <ButtonImportant text="Submit" onClickFunction={submitQuestions} />
            </Form>
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


    function submitQuestions() {
        storeAnswers();
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

        //Backend call to submit questions
    }

    // function closePopup() {
    //     setIsPopupOpen(false);
    // }
}

