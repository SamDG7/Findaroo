import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import InputStandard from "../Components/InputFields";

export default function AccountSetupOptional() {
    const navigate = useNavigate();

    // Personal Info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [age, setAge] = useState();
    const [country, setCountry] = useState();
    const [address, setAddress] = useState();
    const [occupation, setOccupation] = useState();
    const [company, setCompany] = useState();

    // Preferences

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[32vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column Centered">
                    <h2>Account Setup</h2>
                    <div className="Column End">
                        <InputStandard name="First Name"
                                       onChangeFunction={(e) => setFirstName(e.target.value)}/>
                        <InputStandard name="Last Name"
                                       onChangeFunction={(e) => setLastName(e.target.value)}/>
                        <InputStandard name="Age"
                                       onChangeFunction={(e) => setAge(e.target.value)}/>
                        <InputStandard name="Address"
                                       onChangeFunction={(e) => setAddress(e.target.value)}/>
                        <InputStandard name="Country"
                                       onChangeFunction={(e) => setCountry(e.target.value)}/>
                        <InputStandard name="Occupation"
                                       onChangeFunction={(e) => setOccupation(e.target.value)}/>
                        <InputStandard name="Company"
                                       onChangeFunction={(e) => setCompany(e.target.value)}/>
                    </div>
                    <Link to="/AccountSetup">
                        <ButtonStandard text="Back"/>
                    </Link>
                    <ButtonImportant text="Save" onClickFunction={AccountSetupOptionalCall}/>
                </div>
            </div>
        </div>
    );

    //TODO: Save the preferences
    function AccountSetupOptionalCall() {

        navigate("/Login");
    }
}