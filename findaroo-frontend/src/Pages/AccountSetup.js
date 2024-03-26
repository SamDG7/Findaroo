import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ButtonImportant} from "../Components/Buttons";
import InputStandard from "../Components/InputFields";
import Popup from "../Components/Popup";
import GlobalVariables from "../Utils/GlobalVariables";

export default function AccountSetup() {
    const navigate = useNavigate();

    // Personal Info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [age, setAge] = useState();
    const [country, setCountry] = useState();
    const [address, setAddress] = useState();
    const [occupation, setOccupation] = useState();
    const [company, setCompany] = useState();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    // Preferences

    const AccountSetupCall = async () => {
        console.log("POST Call")
        console.log(GlobalVariables.userCredential)
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                email: GlobalVariables.email,
                first_name: firstName,
                last_name: lastName,
                age: age,
                address: address,
                country: country,
                occupation: occupation,
                company: company
            }
            await fetch('http://localhost:5019/User', {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form)
			}).then(response => {
                console.log("HERE")
				return response.text()
			  });
        }catch (err) {
            console.log(err)
        }
        

        togglePopup();
    }

    return (
        <div className="Page">
            <Navbar/>

            <Popup isOpen={isPopupOpen} closePopup={togglePopup}>
                <h2>Answer Lifestyle Questions?</h2>
                <p>Answering these questions will help us personalize your experience to find you the most compatible roommates!</p>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button style={{ background: '#007AFF', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={() => navigate("/Profile/Questions")}>Yes</button>
                    <button style={{ background: '#808080', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }} onClick={() => navigate("/Profile")}>Skip For Now</button>
                </div>
            </Popup>

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
                    <ButtonImportant text="Save" onClickFunction={AccountSetupCall}/>
                </div>
            </div>
        </div>
    );

}