import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import ButtonStandard, { ButtonImportant } from "../Components/Buttons";
import {RoomAndRoommates} from "../Components/RoomAndRoommates"
import InputStandard from "../Components/InputFields";

export default function ExpenseTracker() {
    const { rid } = useParams();
    const navigate = useNavigate();
    const auth = getAuth();
    const [roomData, setRoomData] = useState();
    const [expenseCount, setExpenseCount] = useState(0);
    const [expenseData, setExpenseData] = useState([]);

    useEffect(() => {

        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        GetRoomData();
    }, []);

    useEffect(() => {
        //GetRoommateData();
        GetExpenses();
    }, [roomData]);

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h1>{roomData && roomData.room_name}</h1>
                        <h3>{`Created on: ${roomData && 
                            roomData.date_created.substring(0, roomData.date_created.indexOf('T'))}`}</h3>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Settle Debt"/>
                    </div>
                </div>
                <div className="Column Start">
                    <h2>Add New Expense</h2>
                </div>
                <div className="Row Start">
                    <div className="Row Start">
                        <InputStandard name="Description"></InputStandard>
                        <InputStandard name="Amount"></InputStandard>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Add Expense"></ButtonImportant>
                    </div>
                </div>
            </div>
        </div>
    );

    async function GetRoomData() {
        const response = await fetch(`${GlobalVariables.backendURL}/Room/byRoomId?room_id=${rid}`, {
            method: 'GET',
            credentials: 'include',
        })
        const responseBody = await response.json();
        setRoomData(responseBody);
    }

    async function GetRoommateData() {
        //const idList = roomData.
    }

    async function GetExpenses() {
        if (roomData == null) {
            return;
        }
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateTransaction?room_id=${roomData.room_id}&offset=${expenseCount}`, {
            method: 'GET',
            credentials: 'include',
        }).catch(error => {
            console.log(error);
        });
        const responseBody = await response.json().catch(error => {
            console.log(error);
        });
        if (responseBody.roommateTransactionList.length == 0) {
            return;
        }
        setExpenseData([...expenseData, ...responseBody.roommateTransactionList]);
        setExpenseCount(expenseCount + 10);
    }

    function renderExpenses() {
        if (expenseData.length == 0) {
            return;
        }
        return (
            <div className="Grid">

            </div>
        );
    }
}