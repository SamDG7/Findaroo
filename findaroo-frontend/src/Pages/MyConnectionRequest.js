import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import { getAuth} from "firebase/auth";
import {ConnectionRequestInfo} from "../Components/ConnectionRequestInfo";

export default function MyConnectionRequests() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const auth = getAuth();
    const [data, setData] = useState();

    useEffect(() => {
        if (!GlobalVariables.authenticated || auth.currentUser == null) {
            navigate("/Login");
        }
    }, []);

    useEffect(() => {
        getReceivedConnectionRequests();
    }, []);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Grid">
                    {
                        data && data.map((data, index) => (
                            <ConnectionRequestInfo connectionDict={data}/>
                        ))
                    }
                </div>
            </div>
        </div>
    );

    async function getReceivedConnectionRequests() {
        const response = await fetch(GlobalVariables.backendURL + "/ConnectionRequest/received?user_id=" + auth.currentUser.uid);
        const connections = await response.json();

        if (connections.length == 0) {
            //setData({});
            return;
        }

        var idList = [];
        connections.forEach(element => {
            idList.push(element["sender_id"])
        });

        var imageList = [];

        for (const id of idList) {
            var imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
            var blob = await imageResponse.blob();
            imageList.push(URL.createObjectURL(blob))
        }

        var nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            body: JSON.stringify({"ids": idList}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json());

        var nameImageList = nameList.map((name, i) => ({'name':name, 'image':imageList[i], 'user_id':idList[i]}));
        console.log(nameImageList)
        setData(nameImageList);
    }
}