import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";

export default function EditProfile() {
    const navigate = useNavigate();

    // Basic account info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    // Personal info
    const [age, setAge] = useState();
    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [address, setAddress] = useState();
    const [zip, setZip] = useState();
    const [phone, setPhone] = useState();
    const [occupation, setOccupation] = useState();
    const [company, setCompany] = useState();
    const [school, setSchool] = useState();

    // Preferences

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h2>Personal Information</h2>
                        <InputStandard name="First Name" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Last Name" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Age" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Phone Number" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <h2>About Me</h2>
                        <InputBox name="Interests" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputBox name="Biography" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className="Column Start">
                        <h2>Work/School</h2>
                        <InputStandard name="School" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Occupation" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Company" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <h2>Location</h2>
                        <InputStandard name="Country" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="State" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Address" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Zip Code" onChangeFunction={(e) => setFirstName(e.target.value)}/>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Save" onClickFunction={SaveInfoCall}/>
                        <div className="p-[1vh]"/>
                        <Link to="/Profile">
                            <ButtonStandard text="Back"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    //TODO: Save the personal information
    function SaveInfoCall(){

    }
}