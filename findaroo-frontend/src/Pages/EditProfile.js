import "./Page.css"
import Navbar from "../Components/Navbar";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";
import GlobalVariables from "../Utils/GlobalVariables";
import SchoolLookup from "../Components/SchoolLookup";

export default function EditProfile() {
    const navigate = useNavigate();

    // Personal Info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [age, setAge] = useState();
    const [country, setCountry] = useState();
    const [state, setState] = useState();
    const [address, setAddress] = useState();
    const [zip, setZip] = useState();
    const [phone, setPhone] = useState();
    const [occupation, setOccupation] = useState();
    const [company, setCompany] = useState();
    const [school, setSchool] = useState();
    const [interests, setInterests] = useState();
    const [biography, setBiography] = useState();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    // Preferences

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h2>Personal Information</h2>
                        <InputStandard name="First Name" defaultValue={firstName} onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Last Name" defaultValue={lastName} onChangeFunction={(e) => setLastName(e.target.value)}/>
                        <InputStandard name="Age" defaultValue={age} onChangeFunction={(e) => setAge(e.target.value)}/>
                        <InputStandard name="Phone Number" defaultValue={phone} onChangeFunction={(e) => setPhone(e.target.value)}/>
                        <h2 className="pt-[4vh]">About Me</h2>
                        <InputBox name="Interests" defaultValue={interests} onChangeFunction={(e) => setInterests(e.target.value)}/>
                        <InputBox name="Biography" defaultValue={biography} onChangeFunction={(e) => setBiography(e.target.value)}/>
                    </div>
                    <div className="Column Start">
                        <h2>Work/School</h2>
                        <SchoolLookup name="School" onChangeFunction={setSchool} />
                        <InputStandard name="Occupation" defaultValue={occupation} onChangeFunction={(e) => setOccupation(e.target.value)}/>
                        <InputStandard name="Company" defaultValue={company} onChangeFunction={(e) => setCompany(e.target.value)}/>
                        <h2 className="pt-[4vh]">Location</h2>
                        <InputStandard name="Country" defaultValue={country} onChangeFunction={(e) => setCountry(e.target.value)}/>
                        <InputStandard name="State" defaultValue={state} onChangeFunction={(e) => setState(e.target.value)}/>
                        <InputStandard name="Address" defaultValue={address} onChangeFunction={(e) => setAddress(e.target.value)}/>
                        <InputStandard name="Zip Code" defaultValue={zip} onChangeFunction={(e) => setZip(e.target.value)}/>
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
    // function SaveInfoCall(){

    // }
}