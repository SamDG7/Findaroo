import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {ConversationInfoSmall} from "../Components/ConversationInfo";

export default function Conversations() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [conversationsData, setConversationsData] = useState(null);

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch(GlobalVariables.backendURL+ '/Conversation/all?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {console.log(data); setConversationsData(data);})
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    {
                        conversationsData && GetSortedConversations(conversationsData)
                    }
                </div>
            </div>
        </div>
    );

    function GetSortedConversations(data) {
        const sortedData = data//.sort(TimeSort);

        return (
            sortedData.map((conversation, index) => (
                <ConversationInfoSmall key={index} conversationDict={conversation}/>
            ))
        );
    }
}