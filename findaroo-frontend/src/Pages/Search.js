import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import {PersonInfoSmall} from "../Components/PersonInfo";
import Selector from "../Components/Selector";

export default function Search() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [sortType, setSortType] = useState("Default");
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User/All')
            .then(response => response.json())
            .then(data => {console.log(data); setAllUsers(data);})
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <div className="Column Start" >
                        <Selector name="Sort By" values={["Score", "A-Z", "Z-A"]} onChangeFunction={(e) => setSortType(e.target.value)} />
                    </div>
                    {
                        GetSortedPersons(allUsers, sortType)
                    }
                </div>
            </div>
        </div>
    );

    function GetSortedPersons(data, sortTypeName) {
        const sortFunction = GetSort(sortTypeName);
        const sortedData = data.sort(sortFunction);

        return (
            sortedData.map((person, index) => (
                <PersonInfoSmall key={index} personDict={person}/>
            ))
        );
    }

    function GetSort(sortTypeName) {
        switch (sortTypeName) {
            default:
            case "Score":
                return function(a,b) {return b.rating - a.rating}
            case "A-Z":
                return function(a,b) {return a.first_name === b.first_name ? a.last_name.localeCompare(b.last_name) : a.first_name.localeCompare(b.first_name)};
            case "Z-A":
                return function(a,b) {return a.first_name === b.first_name ? b.last_name.localeCompare(a.last_name) : b.first_name.localeCompare(a.first_name)};
        }
    }
}