import './PersonInfo.css';

export default function TimeZoneHelper(time, timeZoneString){
    if (time == null) {
        return
    }
    if (timeZoneString == null) {
        return
    }
    return convertTZ(time, timeZoneString);
}

function convertTZ(date, tzString) {
    return (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US",  {timeZone: tzString});
}