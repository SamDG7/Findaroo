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
    const [roomType, setRoomType] = useState();
    const [priceLow, setPriceLow] = useState();
    const [priceHigh, setPriceHigh] = useState();
    const [roommatePreferences, setRoommatePreferences] = useState()

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
        .then(response => response.json())
        .then(data => {console.log(data);
            if (data.min_price) setPriceLow(data.min_price);
            if (data.max_price) setPriceHigh(data.max_price);
            if (data.room_type) setRoomType(data.room_type);
            if (data.preferences) setRoommatePreferences(data.preferences)})
        .catch(error => console.error(error));
        
    }, []);

    const SavePreferencesCall = async () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                min_price: priceLow,
                max_price: priceHigh,
                preferences: roommatePreferences,
                room_type: roomType
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
        } catch (err) {
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
                            <InputStandard name="Room Type" defaultValue={roomType} onChangeFunction={(e) => setRoomType(e.target.value)}/>
                            
                        </div>
                        <h2>Roommate Preferences</h2>
                        <div className="Row Start">
                            <InputBox name="Roommate Preference" defaultValue={roommatePreferences} onChangeFunction={(e) => setRoommatePreferences(e.target.value)}/>
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
}