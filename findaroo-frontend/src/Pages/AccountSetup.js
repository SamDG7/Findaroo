import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";

export default function AccountSetup() {
    const navigate = useNavigate();

    // Personal Info
    const [priceLow, setPriceLow] = useState();
    const [priceHigh, setPriceHigh] = useState();

    // Preferences

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[32vw] my-[4vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <h2>Account Setup</h2>
                <div className="Column Start">
                    <InputStandard name="First Name" defaultValue={priceLow}
                                   onChangeFunction={(e) => setPriceLow(e.target.value)}/>
                    <InputStandard name="Last Name" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                    <InputStandard name="Age" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                    <InputStandard name="Address" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                    <InputStandard name="Country" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                    <InputStandard name="Occupation" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                    <InputStandard name="Company" defaultValue={priceHigh}
                                   onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                </div>
                <ButtonImportant text="Save" onClickFunction={AccountSetupCall}/>
            </div>
        </div>
    );

    //TODO: Save the preferences
    function AccountSetupCall() {

    }
}