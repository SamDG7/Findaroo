import {useEffect} from "react";
import './PersonInfo.css';
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";

// Treat as a string
export async function TimeZoneHelper(time){
    return await GetUserTime().then(timeZoneString => {return TimeZoneFormat(time, timeZoneString);})
}

async function GetUserTime(){
    return await fetch(GlobalVariables.backendURL + "/User?user_id=" + GlobalVariables.userCredential.uid)
        .then(response => response.json())
        .then(data => {
            return data.time_zone;
        }).catch(error => console.log(error)).then(
    );
}

function TimeZoneFormat(time, timeZoneString){
    return time.toLocaleString(timeZoneString && {timeZone: timeZoneString}) + (timeZoneString ? " " + timeZoneString : " Local Time");
}