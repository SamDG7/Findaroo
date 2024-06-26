import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputBox} from "../Components/InputFields";
import GlobalVariables from "../Utils/GlobalVariables";
import Selector from "../Components/Selector";

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
    const [currencyCode, setCurrencyCode] = useState(null);
    const [currencyCodes, setCurrencyCodes] = useState();
    const [priceLow, setPriceLow] = useState();
    const [priceHigh, setPriceHigh] = useState();
    const [timeZone, setTimeZone] = useState(null);
    const timeZones = Intl.supportedValuesOf('timeZone');

    const [roommatePreferences, setRoommatePreferences] = useState()

    const [saveText, setSaveText] = useState(null);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
        .then(response => response.json())
        .then(data => {console.log(data);
            if (data.min_price) setPriceLow(data.min_price);
            if (data.max_price) setPriceHigh(data.max_price);
            if (data.room_type) setRoomType(data.room_type);
            if (data.currency_code) setCurrencyCode(data.currency_code);
            if (data.time_zone) setTimeZone(data.time_zone);
            if (data.preferences) setRoommatePreferences(data.preferences)
        }).then(
            fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json')
                .then(response => response.json())
                .then(data => {console.log(data);
                    setCurrencyCodes(data);
                }).catch(error => console.error(error))
        ).catch(error => console.error(error));

    }, []);

    const SavePreferencesCall = async () => {
        console.log("PUT Call")
        try {
            const form = {
                user_id: GlobalVariables.userCredential.uid,
                min_price: priceLow,
                max_price: priceHigh,
                currency_Code: currencyCode,
                time_zone: timeZone,
                preferences: roommatePreferences,
                room_type: roomType
            }
            console.log(form)
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
        } catch (err) {
            console.log(err)
            setSaveText("Save Failed");
        }
    }

    function priceExchange(value){
        // Get the transfer rate from the old currency to the new one
        fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/'+ (currencyCode ? currencyCode : "USD").toLowerCase() +'.json')
            .then(response => response.json())
            .then(data => {
                const transferRate = (currencyCode ? data[currencyCode] : data["usd"])[value.toLowerCase()]
                console.log("Transfer rate:")
                console.log(transferRate);
                setPriceLow((priceLow * transferRate))
                setPriceHigh((priceHigh * transferRate))
                setCurrencyCode(value)
            }).catch(error => console.error(error))
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
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
                            <Selector name="Select Time Zone" values={timeZones}
                                      defaultValue={timeZone != null ? timeZone : "No time zone selected"} onChangeFunction={(e) => {
                                setTimeZone(e.target.value);
                            }}/>
                            <InputStandard name="Room Type" defaultValue={roomType}
                                           onChangeFunction={(e) => setRoomType(e.target.value)}/>
                        </div>
                        <div className="Row Start">
                            {currencyCodes && <Selector name="Select Currency" values={Object.values(currencyCodes)}
                                                        defaultValue={currencyCode != null ? currencyCodes[currencyCode] : "US Dollar"}
                                                        onChangeFunction={(e) => {
                                                            priceExchange(getKeyByValue(currencyCodes, e.target.value))
                                                        }}/>}
                            <InputStandard name="Min Price" defaultValue={priceLow}
                                           onChangeFunction={(e) => setPriceLow(e.target.value)}/>
                            <InputStandard name="Max Price" defaultValue={priceHigh}
                                           onChangeFunction={(e) => setPriceHigh(e.target.value)}/>
                        </div>
                        <h2>Roommate Preferences</h2>
                        <div className="Row Start">
                            <InputBox name="Roommate Preference" defaultValue={roommatePreferences}
                                      onChangeFunction={(e) => setRoommatePreferences(e.target.value)}/>
                        </div>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Save" onClickFunction={SavePreferencesCall}/>
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