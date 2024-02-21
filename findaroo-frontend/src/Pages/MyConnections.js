import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import { getAuth} from "firebase/auth";

export default function MyConnections() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        if (!GlobalVariables.authenticated || auth.currentUser == null) {
            navigate("/Login");
        }
    }, []);

    getConnections();

    return (
        <div className="Page">
            <Navbar/>
            <div class="Row space-x-[2vw]">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"></img>
                <h2>Name</h2>
                <ButtonStandard text={"Unfriend"}></ButtonStandard>
            </div>
        </div>
    );

    async function getConnections() {
        const response = await fetch(GlobalVariables.backendURL + "/Connection?user_id=" + auth.currentUser.uid);
        const data = await response.json();

        var idList = [];
        data.forEach(element => {
            if (element['user_1_id'] == auth.currentUser.uid) {
                idList.push(element['user_2_id'])
            } else {
                idList.push(element['user_1_id'])
            }
        });

        var imageList = [];
        idList.forEach(element => {
            fetch(GlobalVariables.backendURL + "/Image?user_id=" + element)
            .then(response => response.blob())
            .then(blob => {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(blob);
                imageList.push(img);
            });
        })

        var nameList = await fetch(GlobalVariables.backendURL + "/User/idsFromNames", {
            method: 'POST',
            body: JSON.stringify({"ids": idList}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => response.json());

        console.log(nameList);
    }
}