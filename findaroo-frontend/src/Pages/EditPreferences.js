import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";
import GlobalVariables from "../Utils/GlobalVariables";

export default function EditPreferences() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    // Personal Info
    const [priceLow, setPriceLow] = useState();
    const [priceHigh, setPriceHigh] = useState();
    const [roommatePreferences, setRoomatePreferences] = useState()

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=6f3aa8f5-f149-4c5c-8c87-99fb046868fe')
        .then(response => response.json())
        .then(data => {console.log(data); setPriceLow(data.min_price); setPriceHigh(data.max_price); setRoomatePreferences(data.preferences)})
        .catch(error => console.error(error));
        
    }, []);

    const SavePreferencesCall = async () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: '6f3aa8f5-f149-4c5c-8c87-99fb046868fe',
                min_price: priceLow,
                max_price: priceHigh,
                preferences: roommatePreferences
            }
            await fetch('http://localhost:5019/User', {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(form)
			}).then(response => {
				return response.text()
			  });
        }catch (err) {
            console.log(err)
        }
    }

    // Preferences

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h2>Preferences</h2>
                        <div className="Row Start">
                            <InputStandard name="Min Price" defaultValue={priceLow} onChangeFunction={(e) => setPriceLow(e.target.value)}/>
                            <InputStandard name="Max Price" defaultValue={priceHigh} onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                        </div>
                        <h2>Roomate Preferences</h2>
                        <div className="Row Start">
                            <InputBox name="Roomate Preference" defaultValue={roommatePreferences} onChangeFunction={(e) => setRoomatePreferences(e.target.value)}/>
                        </div>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Save" onClickFunction={SavePreferencesCall}/>
                        <div className="p-[1vh]"/>
                        <Link to="/Profile">
                            <ButtonStandard text="Back"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    //TODO: Save the preferences
    // function SavePreferencesCall() {

    // }
    
}