import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState, useRef} from "react";
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
    const [roommateData, setRoommateData] = useState();
    const [amountOwedData, setAmountOwedData] = useState({});
    const expenseDescription = useRef();
    const expenseAmount = useRef();

    useEffect(() => {
        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        getRoomData();
    }, []);

    useEffect(() => {
        getRoommateData(); 
        getAmountOwed();
        getExpenses();
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
                        <AmountOwedList/>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Settle Up" onClickFunction={settleUp}/>
                    </div>
                </div>
                <div className="Column Start">
                    <h2>Add New Expense</h2>
                </div>
                <div className="Row Start">
                    <div className="Row Start">
                        <div className="Row">
                            <h3 style={{width: "10vw", textAlign: "right"}}>
                                Description
                            </h3>
                            <input
                                className="InputStandard"
                                placeholder="..."
                                ref={expenseDescription}
                            />
                        </div>
                        <div className="Row">
                            <h3 style={{width: "10vw", textAlign: "right"}}>
                                Amount
                            </h3>
                            <input
                                className="InputStandard"
                                placeholder="..."
                                ref={expenseAmount}
                            />
                        </div>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Add Expense" onClickFunction={createNewExpense}></ButtonImportant>
                    </div>
                </div>
                <ExpenseList></ExpenseList>
                <ButtonStandard text="Load More"/>
            </div>
        </div>
    );

    async function refreshData() {
        setExpenseCount(0);
        getAmountOwed();
        getExpenses(true);
    }

    async function getRoomData() {
        const response = await fetch(`${GlobalVariables.backendURL}/Room/byRoomId?room_id=${rid}`, {
            method: 'GET',
            credentials: 'include',
        })
        const responseBody = await response.json();
        setRoomData(responseBody);
    }

    async function getRoommateData() {
        if (roomData == null) return;
        const idList = roomData.roommate_id;

        const response = await fetch(`${GlobalVariables.backendURL}/User/idsFromNames`, {
            method: 'POST',
            crednetials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({"ids":idList})
        }).catch(error => {
            console.log(error);
        });

        const nameList = await response.json().catch(error => {
            console.log(error);
        })

        if (nameList == null) return;
        
        var imageList = [];

        for (const id of idList) {
            var imageResponse = await fetch(GlobalVariables.backendURL + "/Image?user_id=" + id);
            var blob = await imageResponse.blob();
            imageList.push(URL.createObjectURL(blob));
        }

        var roommateDataHelper = {};
        idList.forEach((id, i) => {
            roommateDataHelper[id] = {
                'name': nameList[i], 
                'image': imageList[i]
            }
        });
        setRoommateData(roommateDataHelper);
    }

    async function getExpenses(refresh = false) {
        if (roomData == null) return;

        const response = await fetch(`${GlobalVariables.backendURL}/RoommateTransaction?room_id=${roomData.room_id}&offset=${refresh ? 0 : expenseCount}`, {
            method: 'GET',
            credentials: 'include',
        }).catch(error => {
            console.log(error);
        });
        const responseBody = await response.json().catch(error => {
            console.log(error);
        });
        if (responseBody.roommateTransactionList.length == 0) {
            setExpenseData([]);
            return;
        }
        
        if (!refresh) {
            setExpenseCount(expenseCount + 10);
            setExpenseData([...expenseData, ...responseBody.roommateTransactionList]);
        } else {
            setExpenseData(responseBody.roommateTransactionList);
        }
    }

    async function getAmountOwed() {
        if (roomData == null) {
            return;
        }
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateTransaction/amountOwed?room_id=${roomData.room_id}`, {
            method: 'GET',
            credentials: 'include',
        }).catch(error => {
            console.log(error);
        });
        const data = await response.json().catch(error => {
            console.log(error);
        });

        setAmountOwedData(data);
    }

    async function settleUp() {
        await fetch(`${GlobalVariables.backendURL}/RoommateTransaction/settleUp`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'roomId': roomData.room_id
            })
        })
        refreshData();
    }

    async function createNewExpense() {
        var description = expenseDescription.current.value;
        var amount = parseFloat(expenseAmount.current.value);
        if (description == null || amount == null) {
            return;
        }
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateTransaction`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                'roomId': roomData.room_id,
                'receiverId': roomData.roommate_id,
                'name': description,
                'amount': amount
            })
        });
        refreshData();
    }

    async function deleteExpense(transactionId) {
        const response = await fetch(`${GlobalVariables.backendURL}/RoommateTransaction`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({"transactionId": transactionId})
        }).catch(error => {
            console.log(error);
        })
        refreshData();
    }

    function ExpenseList() {
        if (expenseData == null || expenseData.length == 0) return;
        if (roomData == null || roommateData == null) return;
    
        return (
            <div className="Grid">
                {expenseData.map((expense, i) => (
                    <ExpenseItem expense={expense} roommate={roommateData[expense.payer_id]}/>
                ))}
            </div>
        );
    }

    function ExpenseItem({expense, roommate}) {
        console.log(expense);
        console.log(roommate);
        const [expenseId] = useState(expense.transaction_id);
        return (
            <div className="Row Start bg-gray-200 drop-shadow-xl my-[1.5vh]">
                <img 
                    className="object-scale-down w-24 h-24" 
                    src={roommate.image} 
                    alt={"Profile picture"} 
                />
                <div className="Column Start">
                    <h2>{expense.name}</h2>
                    <h3>{`Paid by ${roommate.name}`}</h3>
                    <h4>{expense.date_created
                        .substring(0, expense.date_created.indexOf('T'))}</h4>
                </div>
                <div className="Column End">
                    <h2>{`$${expense.amount}`}</h2>
                    {
                        expense.payer_id == GlobalVariables.userCredential.uid ? 
                        <ButtonImportant text="Delete Expense" onClickFunction={() => deleteExpense(expenseId)}/>
                        :
                        <div/>
                    }
                </div>
            </div>
        );
    }

    function AmountOwedList() {
        if (amountOwedData == null || amountOwedData.user_id == null) return;
        if (roomData == null || roommateData == null) return;

        return (
            <div className="Column Start">
                {amountOwedData.user_id.map((userId, i) => (
                    amountOwedData.amount_owed[i] < 0 ? 
                        <h2 style={{"color": "green"}}>
                            {`${roommateData[userId].name} owes you $${Math.abs(amountOwedData.amount_owed[i])}`}
                        </h2>
                    :
                    amountOwedData.amount_owed[i] > 0 ?
                        <h2 style={{"color": "red"}}>
                            {`You owe ${roommateData[userId].name} $${amountOwedData.amount_owed[i]}`}
                        </h2>
                    :
                    <div/>
                ))}
            </div>
        );
    }
}