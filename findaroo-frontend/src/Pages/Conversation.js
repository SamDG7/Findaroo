import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import ConversationInfo from "../Components/ConversationInfo";
import Selector from "../Components/Selector";

export default function Conversations() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    const [conversationData, setConversationData] = useState(null);
    const { cid } = useParams();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {

        console.log("GET Call")
        fetch('http://localhost:5019/Conversation?conversation_id=' + cid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setConversationData(data);
            }).catch(error => console.error(error));

    }, []);

    return (
        <div className="Page">
            <Navbar />

            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <ConversationInfo conversationDict={conversationData} />
                </div>
            </div>
        </div>
    );
}