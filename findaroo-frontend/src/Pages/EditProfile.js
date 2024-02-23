import "./Page.css"
import Navbar from "../Components/Navbar";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";
import GlobalVariables from "../Utils/GlobalVariables";
import SchoolLookup from "../Components/SchoolLookup";
import schoolLookup from "../Components/SchoolLookup";

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
    // These two are not stored on the user right now
    const [interests, setInterests] = useState();
    const [biography, setBiography] = useState();

    const [saveText, setSaveText] = useState(null);

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.first_name) setFirstName(data.first_name);
                if (data.last_name) setLastName(data.last_name);
                if (data.age) setAge(data.age);
                if (data.country) setCountry(data.country);
                if (data.state) setState(data.state);
                if (data.address) setAddress(data.address);
                if (data.zip_code) setZip(data.zip_code);
                if (data.phone) setPhone(data.phone);
                if (data.occupation) setOccupation(data.occupation);
                if (data.company) setCompany(data.company);
                if (data.school) setSchool(data.school);
            }).catch(error => console.error(error));

    }, []);

    const SaveInfoCall = async () => {
        const regex = /[0-9]/g;
        const numbers = firstName.match(regex);
        if (numbers != null && numbers.length > 0) {
            setSaveText("Save Failed - Name includes numbers");
            return
        }
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                first_name: firstName,
                last_name: lastName,
                country: country,
                state: state,
                address: address,
                zip_code: zip,
                phone: phone,
                occupation: occupation,
                company: company,
                school: school
            }
            await fetch('http://localhost:5019/User', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form)
            }).then(response => {
                setSaveText("Save Successful!");
                return response.text()
            });
        }catch (err) {
            console.log(err)
            setSaveText("Save Failed");
        }
    }

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
                        <SchoolLookup name="School" defaultValue={school} onChangeFunction={setSchool} />
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
                        {saveText && <h3>
                            {saveText}
                        </h3>}
                    </div>
                </div>
            </div>
        </div>
    );

}