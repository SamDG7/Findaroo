import React from "react";
import './PersonInfo.css';
import ButtonStandard, { ButtonImportant, ButtonTransparent } from "./Buttons";
import {getAuth} from 'firebase/auth';
import {useState, useEffect} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import { PersonInfoSmall } from "./PersonInfo";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import InputStandard from "./InputFields";
import Popup from "../Components/Popup";

export function RoomAndRoommates({roomDict, connectionDict}) {
    const navigate = useNavigate();
    const auth = getAuth();
    const [showRoommate, setShowRoommate] = useState(false);
    const [roommateDict, setRoommateDict] = useState(null);
    const [showAddRoommate, setShowAddRoommate] = useState(false);

    const [showRent, setShowRent] = useState(false);

    const [visible, setVisible] = useState(true);

    const [rentCost, setRentCost] = useState();
    const [rentDate, setRentDate] = useState();
    const [rentSplit, setRentSplit] = useState();

    const [defDict, setDefDict] = useState(null)

    if (!visible) {
        return;
    }

    const handleRentUpdate = ({ cost, date, split }) => {
        var desc = "You pay: $";
        desc += (cost / split);

        const newEvent = {
            id: GlobalVariables.events.length + 1,
            name: "Rent Due",
            description: desc,
            imageUrl: 'https://via.placeholder.com/256',
            startDatetime: date,
            endDatetime: date,
        };
        GlobalVariables.events = [...GlobalVariables.events, newEvent];
        console.log(GlobalVariables.events);
    };

    function UpdateRentForm({ onSubmit }) {

        const [isEditing, setEditing] = useState(true);
        const [cost, setCost] = useState('');
        const [date, setDate] = useState('');
        const [split, setSplit] = useState('');
    
        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit({ cost, date, split });
            setCost('');
            setDate('');
            setSplit('');
        };
    
        const toggleAdding = () => {
            setEditing(!isEditing);
        };
    
        return (
            <div>
                <Popup isOpen={isEditing} closePopup={toggleAdding}>
                    <h2>Rent Management</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="Column Center">
                            <input
                            type="number"
                            placeholder="Cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            />
                            <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                            type="number"
                            placeholder="Split"
                            value={split}
                            onChange={(e) => setSplit(e.target.value)}
                            />
                            <button type="submit">Confirm</button>
                        </div>
                    </form>
                </Popup>
            </div>
        );
    }

    return (
        <div>
            <div className="Row Start">
                <div className="Column Start">
                    <h1>{roomDict.room_name}</h1>
                    <h2>{`Created on: ${roomDict.date_created.substring(0, roomDict["date_created"].indexOf('T'))}`}</h2>
                    
                </div>
                <div className="Column End">
                    <div className="Row Start">
                        <ButtonStandard text="Expense Tracker" onClickFunction={() => navigate(`/Profile/ExpenseTracker/${roomDict.room_id}`)}/>
                        <div className="p-[0.25vw]"/>
                        <ButtonStandard text="Add Roommates" onClickFunction={displayAddRoommate}></ButtonStandard>
                        <div className="p-[0.25vw]"/>
                        <ButtonStandard text="View Roommates" onClickFunction={displayRoommates}/>
                        <div className="p-[0.25vw]"/>
                        
                        <ButtonStandard text="Manage Rent" onClickFunction={displayRent}/>
                        {showRoommate && (<ButtonStandard text="Default View" onClickFunction={() => setRoommateDict([...defDict])}/>)}

                        <div className="p-[0.25vw]"/>
                        <ButtonImportant text="Leave" onClickFunction={removeFromGroup}></ButtonImportant>
                    </div>
                </div>
            </div>
            {showAddRoommate && <div className="Row Start">
                <AddRoommate connectionDict={connectionDict} roomId={roomDict.room_id}/>
                
            </div>}

            <div className="Panel">
                {
                    showRoommate && roommateDict.map((rm, i) => (
                        <RoommateInfo roommate={rm} room_id={roomDict.room_id}/>
                    ))
                }
            </div>
            {showRent && <UpdateRentForm onSubmit={handleRentUpdate} />}
        </div>
    );

    async function removeFromGroup() {
        setVisible(false);
        const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
            method:'DELETE',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"roomId": roomDict.room_id, "userIdToRemove": auth.currentUser.uid})
        })
    }

    async function displayRoommates() {
        if (!showRoommate) {
            console.log("debug")
            const userResponse = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"ids": roomDict["roommate_id"]})
            })
            const userData = await userResponse.json();
            setRoommateDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })))
            setDefDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })));
        }
        setShowRoommate(!showRoommate);
    }

    async function displayRent() {
        if (!showRent) {
            
            /*
            const userResponse = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"ids": roomDict["roommate_id"]})
            })
            const userData = await userResponse.json();
            setRoommateDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })));
            */
        }
        setShowRent(!showRent);
    }

    function displayAddRoommate() {
        setShowAddRoommate(!showAddRoommate);
    }
    function moveUp(input) {
        console.log(input)    
        for(var i = 0; i < roommateDict.length; i++) {         
            if(roommateDict[i].id === input){
                console.log(i)
                if(i === 0) return
                var copy = [...roommateDict]
                var temp = copy[i-1]               
                copy[i-1] = copy[i]               
                copy[i] = temp              
                setRoommateDict(copy)
            }
        }
        
    }
    function moveDown(input) {
        console.log(input)    
        for(var i = 0; i < roommateDict.length-1; i++) {
            
            if(roommateDict[i].id === input){
                console.log("HERE")
                var copy = [...roommateDict]
                var temp = copy[i+1]
                copy[i+1] = copy[i]
                copy[i] = temp
                console.log(copy)
                setRoommateDict(copy)
                
                
                
            }
        }
        
    }
    function RoommateInfo({roommate, room_id}) {
        const navigate = useNavigate();
        const [image, setImage] = useState(null);
        const [visible, setVisible] = useState(true);
    
        useEffect(() => {
            if (roommate["id"] != null && image == null) {
                GetImage(roommate["id"]);
            }
        }, [roommate['id']]);
    
        const GetImage = async function() {
            console.log(roommate["id"])
            const imageResponse = await fetch("http://localhost:5019/Image?user_id=" + roommate["id"]);
            const blob = await imageResponse.blob();
            const source = URL.createObjectURL(blob);
            setImage(source);
        }
    
        if (!roommate['id'] || !visible) {
            return;
        }
        return (
            <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]" >
                <img className="object-scale-down w-24 h-24" src={image}
                    alt={roommate['name'] + "'s profile picture"} />
                <div className="Column Start" onClick={() => navigate("/User/" + roommate["id"])}>
                    <Link to="/User" params={roommate["id"]}>
                        <h2>
                            {roommate['name']}
                        </h2>
                    </Link>
                    <h3>
                        Date joined: {roommate['date_joined']}
                    </h3>
                </div>
                <h3 className="Column End">
                    <ButtonImportant text={"Remove from group"} onClickFunction={removeFromGroup}></ButtonImportant>
                    <ButtonTransparent text={"Move Up"} onClickFunction={() => moveUp(roommate["id"])}></ButtonTransparent>
                    <ButtonTransparent text={"Move Down"} onClickFunction={() => moveDown(roommate["id"])}></ButtonTransparent>
                </h3>
            </div>
        );
        
        
    
        async function removeFromGroup() {
            setVisible(false);
            const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
                method:'DELETE',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"roomId": room_id, "userIdToRemove": roommate.id})
            })
        }
    }
}

function AddRoommate({connectionDict, roomId}) {
    const auth = getAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [addRoommateInput, setAddRoommateInput] = useState("");
    const [roommateToAddId, setRoommateToAddId] = useState("");
    const [filteredConnectionDict, setFilteredConnectionDict] = useState(connectionDict);

    //console.log(connectionDict);
    useEffect(() => {
        setFilteredConnectionDict(connectionDict.filter(connection => 
            connection.name.toLowerCase().includes(addRoommateInput.toLowerCase())));
    }, [addRoommateInput]);

    return (
        <div style={{display: "flex", padding: "0.5vw"}}>
            <div className="Row Start">
                <input
                    type="text"
                    placeholder="Add your connections as roommates"
                    className="InputStandard"
                    style={{width: "500px"}}
                    value={addRoommateInput}
                    onChange={(e) => onChangeHelper(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                />
                <Link
                    to={{
                        pathname: `/Profile/MyRooms/RoommateAgreement`,
                    }}
                    state={
                        {
                            'name': addRoommateInput, 
                            'receiver_id': roommateToAddId,
                            'sender_id': auth.currentUser.uid,
                            'room_id': roomId,
                            'is_sender': true,
                            'agreement_form': null
                        }
                    }
                >
                    <ButtonImportant text="Add Roommate"/>
                </Link>
            </div>
            
            {showDropdown && (
                <ul
                    style={{
                        position: 'absolute',
                        listStyleType: 'none',
                        padding: 0,
                        margin: 0,
                        marginTop: '40px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        maxHeight: '400px', // Adjust this value as needed
                        overflowY: 'auto',
                        width: '350px',
                        maxWidth: '0.5hw',
                        zIndex: 1000,
                    }}
                >
                    {filteredConnectionDict.map((connection, index) => (
                        <li
                            //key={}
                            className="connection"
                            onMouseDown={() => { setShowDropdown(false); setRoommateToAddId(connection.user_id); setAddRoommateInput(connection.name); }}
                        >
                            <div className="Row Start">
                                <img className="w-5 h-5 inset-y-0 left-0" src={connection.image}></img>
                                {connection.name}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

    function onChangeHelper(value) {
        setAddRoommateInput(value);
        if (roommateToAddId != "") {
            setRoommateToAddId("");
        }
    }
}


export function SimpleRoom({roomDict, connectionDict}) {
    const navigate = useNavigate();
    const auth = getAuth();
    const [showRoommate, setShowRoommate] = useState(false);
    const [roommateDict, setRoommateDict] = useState(null);
    const [showAddRoommate, setShowAddRoommate] = useState(false);

    const [showRent, setShowRent] = useState(false);

    const [visible, setVisible] = useState(true);

    const [rentCost, setRentCost] = useState();
    const [rentDate, setRentDate] = useState();
    const [rentSplit, setRentSplit] = useState();

    const [defDict, setDefDict] = useState(null)

    if (!visible) {
        return;
    }

    const handleRentUpdate = ({ cost, date, split }) => {
        var desc = "You pay: $";
        desc += (cost / split);

        const newEvent = {
            id: GlobalVariables.events.length + 1,
            name: "Rent Due",
            description: desc,
            imageUrl: 'https://via.placeholder.com/256',
            startDatetime: date,
            endDatetime: date,
        };
        GlobalVariables.events = [...GlobalVariables.events, newEvent];
        console.log(GlobalVariables.events);
    };

    function UpdateRentForm({ onSubmit }) {

        const [isEditing, setEditing] = useState(true);
        const [cost, setCost] = useState('');
        const [date, setDate] = useState('');
        const [split, setSplit] = useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit({ cost, date, split });
            setCost('');
            setDate('');
            setSplit('');
        };

        const toggleAdding = () => {
            setEditing(!isEditing);
        };

        return (
            <div>
                <Popup isOpen={isEditing} closePopup={toggleAdding}>
                    <h2>Rent Management</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="Column Center">
                            <input
                                type="number"
                                placeholder="Cost"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Split"
                                value={split}
                                onChange={(e) => setSplit(e.target.value)}
                            />
                            <button type="submit">Confirm</button>
                        </div>
                    </form>
                </Popup>
            </div>
        );
    }

    return (
        <div>
            <div className="Row Start">
                <div className="Column Start">
                    <h1>{roomDict.room_name}</h1>
                    <h2>{`Created on: ${roomDict.date_created.substring(0, roomDict["date_created"].indexOf('T'))}`}</h2>

                </div>
            </div>
            {showAddRoommate && <div className="Row Start">
                <AddRoommate connectionDict={connectionDict} roomId={roomDict.room_id}/>

            </div>}

            <div className="Panel">
                {
                    showRoommate && roommateDict.map((rm, i) => (
                        <RoommateInfo roommate={rm} room_id={roomDict.room_id}/>
                    ))
                }
            </div>
            {showRent && <UpdateRentForm onSubmit={handleRentUpdate} />}
        </div>
    );

    async function removeFromGroup() {
        setVisible(false);
        const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
            method:'DELETE',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"roomId": roomDict.room_id, "userIdToRemove": auth.currentUser.uid})
        })
    }

    async function displayRoommates() {
        if (!showRoommate) {
            console.log("debug")
            const userResponse = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"ids": roomDict["roommate_id"]})
            })
            const userData = await userResponse.json();
            setRoommateDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })))
            setDefDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })));
        }
        setShowRoommate(!showRoommate);
    }

    async function displayRent() {
        if (!showRent) {

            /*
            const userResponse = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"ids": roomDict["roommate_id"]})
            })
            const userData = await userResponse.json();
            setRoommateDict(userData.map((name, i) => ({
                'name': name,
                'id': roomDict["roommate_id"][i],
                'date_joined': roomDict["date_joined"][i].substring(0, roomDict["date_joined"][i].indexOf('T'))
            })));
            */
        }
        setShowRent(!showRent);
    }

    function displayAddRoommate() {
        setShowAddRoommate(!showAddRoommate);
    }
    function moveUp(input) {
        console.log(input)
        for(var i = 0; i < roommateDict.length; i++) {
            if(roommateDict[i].id === input){
                console.log(i)
                if(i === 0) return
                var copy = [...roommateDict]
                var temp = copy[i-1]
                copy[i-1] = copy[i]
                copy[i] = temp
                setRoommateDict(copy)
            }
        }

    }
    function moveDown(input) {
        console.log(input)
        for(var i = 0; i < roommateDict.length-1; i++) {

            if(roommateDict[i].id === input){
                console.log("HERE")
                var copy = [...roommateDict]
                var temp = copy[i+1]
                copy[i+1] = copy[i]
                copy[i] = temp
                console.log(copy)
                setRoommateDict(copy)



            }
        }

    }
    function RoommateInfo({roommate, room_id}) {
        const navigate = useNavigate();
        const [image, setImage] = useState(null);
        const [visible, setVisible] = useState(true);

        useEffect(() => {
            if (roommate["id"] != null && image == null) {
                GetImage(roommate["id"]);
            }
        }, [roommate['id']]);

        const GetImage = async function() {
            console.log(roommate["id"])
            const imageResponse = await fetch("http://localhost:5019/Image?user_id=" + roommate["id"]);
            const blob = await imageResponse.blob();
            const source = URL.createObjectURL(blob);
            setImage(source);
        }

        if (!roommate['id'] || !visible) {
            return;
        }
        return (
            <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]" >
                <img className="object-scale-down w-24 h-24" src={image}
                     alt={roommate['name'] + "'s profile picture"} />
                <div className="Column Start" onClick={() => navigate("/User/" + roommate["id"])}>
                    <Link to="/User" params={roommate["id"]}>
                        <h2>
                            {roommate['name']}
                        </h2>
                    </Link>
                    <h3>
                        Date joined: {roommate['date_joined']}
                    </h3>
                </div>
                <h3 className="Column End">
                    <ButtonImportant text={"Remove from group"} onClickFunction={removeFromGroup}></ButtonImportant>
                    <ButtonTransparent text={"Move Up"} onClickFunction={() => moveUp(roommate["id"])}></ButtonTransparent>
                    <ButtonTransparent text={"Move Down"} onClickFunction={() => moveDown(roommate["id"])}></ButtonTransparent>
                </h3>
            </div>
        );



        async function removeFromGroup() {
            setVisible(false);
            const response = await fetch(GlobalVariables.backendURL + "/Roommate", {
                method:'DELETE',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({"roomId": room_id, "userIdToRemove": roommate.id})
            })
        }
    }
}
