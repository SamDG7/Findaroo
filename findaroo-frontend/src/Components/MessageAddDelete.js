import './PersonInfo.css';
import ButtonStandard, { ButtonImportant } from "./Buttons";
import {useState, useEffect, useCallback} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";

export function MessageAddDelete({conversationDict, connectionDict}) {
    const navigate = useNavigate();
    const [showAddUser, setShowAddUser] = useState(false);
    const [showRemoveUser, setShowRemoveUser] = useState(false);

    return (
        <div>
            <div className="Row Start">
                <ButtonStandard text="Add User to Conversation" onClickFunction={displayAddUser}></ButtonStandard>
                <div className="p-[0.25vw]"/>
                <ButtonStandard text="Remove User from Conversation" onClickFunction={displayRemoveUser}></ButtonStandard>
                <div className="p-[0.25vw]"/>
                <ButtonImportant text="Leave Conversation" onClickFunction={leaveGroup}></ButtonImportant>
            </div>
            {showAddUser && <div className="Row Start">
                <AddConversationUser connectionDict={connectionDict} conversationId={conversationDict.conversation_id}/>
                
            </div>}
            {showRemoveUser && <div className="Row Start">
                <RemoveConversationUser conversationDict={conversationDict} conversationId={conversationDict.conversation_id}/>

            </div>}
        </div>
    );

    async function leaveGroup() {
        await fetch(GlobalVariables.backendURL + "/Conversation/removeUser?conversationId="
            +conversationDict.conversation_id+"&removingUserId="+GlobalVariables.userCredential.uid, {method: "POST"})
            .catch(error => console.log(error));
        navigate("/Conversations")
    }

    function displayAddUser() {
        setShowAddUser(!showAddUser);
        if (!showAddUser) {
            setShowRemoveUser(showAddUser);
        }
    }

    function displayRemoveUser() {
        setShowRemoveUser(!showRemoveUser);
        if (!showRemoveUser) {
            setShowAddUser(showRemoveUser);
        }
    }
}

function AddConversationUser({connectionDict, conversationId}) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [addUserInput, setAddUserInput] = useState("");
    const [userToAddId, setUserToAddId] = useState("");
    const [filteredConnectionDict, setFilteredConnectionDict] = useState(connectionDict);

    //console.log(connectionDict);
    useEffect(() => {
        setFilteredConnectionDict(connectionDict.filter(connection =>
            connection.name.toLowerCase().includes(addUserInput.toLowerCase())));
    }, [addUserInput, connectionDict]);

    return (
        <div style={{display: "flex", padding: "0.5vw"}}>
            <div className="Row Start">
                <input
                    type="text"
                    placeholder="Add a connection to the conversation"
                    className="InputStandard"
                    style={{width: "500px"}}
                    value={addUserInput}
                    onChange={(e) => onChangeHelper(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                />
                <ButtonImportant text="Add User" onClickFunction={addUser}/>
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
                            key={index}
                            className="connection"
                            onMouseDown={() => {
                                setShowDropdown(false);
                                setUserToAddId(connection.user_id);
                                setAddUserInput(connection.name);
                            }}
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
        setAddUserInput(value);
        if (userToAddId !== "") {
            setUserToAddId("");
        }
    }

    async function addUser() {
        console.log(JSON.stringify({conversationId: conversationId, removingUserId: userToAddId}));
        await fetch(GlobalVariables.backendURL + "/Conversation/addUser?conversationId="
            +conversationId+"&newUserId="+userToAddId, {method: "POST"})
            .catch(error => console.log(error));
        navigate("/Conversations/" + conversationId)
    }
}

function RemoveConversationUser({conversationDict, conversationId}) {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [removeUserInput, setRemoveUserInput] = useState("");
    const [userToRemoveId, setUserToRemoveId] = useState("");
    const [filteredUserDict, setFilteredUserDict] = useState([]);
    const [usersArr, setUsersArr] = useState([]);

    //console.log(connectionDict);
    useEffect(() => {
        async function getInConversation() {
            let imageList = [];

            for (const id of conversationDict.user_ids) {
                let imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
                let blob = await imageResponse.blob();
                imageList.push(URL.createObjectURL(blob));
            }

            let nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
                method: 'POST',
                body: JSON.stringify({"ids": conversationDict.user_ids}),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(response => response.json());

            let nameIdImageList = nameList.map((name, i) => ({'name':name, 'image':imageList[i], 'user_id':conversationDict.user_ids[i]}));

            console.log(nameIdImageList)

            setUsersArr(nameIdImageList);
        }

        getInConversation();
    }, [conversationDict.user_ids]);

    useEffect(() => {
        setFilteredUserDict(usersArr.filter(connection =>
            connection.name.toLowerCase().includes(removeUserInput.toLowerCase())));
    }, [removeUserInput, usersArr]);
    
    return (
        <div style={{display: "flex", padding: "0.5vw"}}>
            <div className="Row Start">
                <input
                    type="text"
                    placeholder="Remove a user from the conversation"
                    className="InputStandard"
                    style={{width: "500px"}}
                    value={removeUserInput}
                    onChange={(e) => onChangeHelper(e.target.value)}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
                />
                <ButtonImportant text="Remove User" onClickFunction={removeUser}/>
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
                    {filteredUserDict.map((connection, index) => (
                        <li
                            key={index}
                            className="connection"
                            onMouseDown={() => {
                                setShowDropdown(false);
                                setUserToRemoveId(connection.user_id);
                                setRemoveUserInput(connection.name);
                            }}
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
        setRemoveUserInput(value);
        if (userToRemoveId !== "") {
            setUserToRemoveId("");
        }
    }

    async function removeUser() {
        console.log(JSON.stringify({conversationId: conversationId, removingUserId: userToRemoveId}));
        await fetch(GlobalVariables.backendURL + "/Conversation/removeUser?conversationId="
            +conversationId+"&removingUserId="+userToRemoveId, {method: "POST"})
        .catch(error => console.log(error));
        navigate("/Conversations/" + conversationId)
    }
}