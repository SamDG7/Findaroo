import "./Page.css"
import Navbar from "../Components/Navbar";
import { Form, Link } from "react-router-dom";
import { ButtonImportant } from "../Components/Buttons";

export default function Questions() {
    return (
        <div className="Page">
            <Navbar />
            <h1>
                Lifestyle questions to ensure the best matches!
            </h1>

            <Form>
                <h3>I am currently:</h3>
                <input type="radio" id="student" name="status" value="student" />
                <label for="student">a Student</label>

                <input type="radio" id="working" name="status" value="working" />
                <label for="working">Working</label>

                <input type="radio" id="other" name="status" value="other" />
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

                <h3>How often do you borrow your friend's or sibling's personal items</h3>
                <select id="borrowingFrequency" name="borrowingFrequency">
                    <option value="never">Never</option>
                    <option value="occasionally">Occasionally</option>
                    <option value="frequently">Frequently</option>
                </select>


                <Link to="/Profile">
                    <ButtonImportant>Submit</ButtonImportant>
                </Link>
            </Form>
        </div>
    );
}