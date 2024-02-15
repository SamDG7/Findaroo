import "./Page.css"
import Navbar from "../Components/Navbar";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function EditProfile() {
    const navigate = useNavigate();

    // Basic account info
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
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
        <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
            <Navbar/>
            <h1>
                Edit Profile page!
            </h1>
        </div>
    );
}