import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";

export default function EditPreferences() {
    const navigate = useNavigate();

    // Personal Info
    const [priceLow, setPriceLow] = useState();
    const [priceHigh, setPriceHigh] = useState();
    const [roommatePreferences, setRoomatePreferences] = useState()

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
    function SavePreferencesCall() {

    }
}