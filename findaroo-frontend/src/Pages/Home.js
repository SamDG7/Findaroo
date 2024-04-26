import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Popup from "../Components/Popup";
import {forEach} from "react-bootstrap/ElementChildren";
import {PersonInfoSmall} from "../Components/PersonInfo";
import {RoomAndRoommates} from "../Components/RoomAndRoommates";

export default function Home() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const [status, setStatus] = useState(true);
    const [userArr, setUserArr] = useState();
    const [roomArr, setRoomArr] = useState();
    const [combinedArr, setCombinedArr] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!GlobalVariables.authenticated || GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
            return;
        }

        console.log("GET Call")
        if (GlobalVariables.userCredential.uid === undefined) {
            navigate("/Login");
        }
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStatus(data.status);
            })
            .catch(error => console.error(error));
    }, [navigate]);

    useEffect(() => {
        if (!GlobalVariables.userCredential) {
            return;
        }
        console.log("GET Call for new added user in search")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5019/User/all')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserArr(data);
            })
            .catch(error => console.error(error));
        fetch('http://localhost:5019/Room/all')
            .then(response => response.json())
            .then(data => {
                console.log(data["rooms"]);
                setRoomArr(data["rooms"]);
            })
            .catch(error => console.error(error));
    }, [])

    useEffect(() => {
        // this merges arrays
        let newArr = [];
        if (roomArr) {
            newArr = [...roomArr, ...newArr];
        }
        if (userArr) {
            newArr = [...userArr, ...newArr];
        }
        const sortFunction = FeaturedSort();
        const sortedArr = newArr.sort(sortFunction);
        console.log("Combined Arr:")
        console.log(sortedArr)
        setCombinedArr(sortedArr);
    }, [roomArr, userArr])

    return (
        <div className="Page">
            <Navbar />
            <div className="Column">
                {combinedArr && combinedArr.map((data, index) => {
                    return PickStyle(data, index);
                })}
            </div>
        </div>
    );

    function PickStyle(data, index){
        if (data["user_id"] != null) {
            return <PersonInfoSmall key={index} personDict={data} similarityOutput={calculateLifestyleSimilarity(data)} />;
        } else {
            return <RoomAndRoommates key={index} roomDict={data} similarityOutput={calculateRoomLifestyleSimilarity(data)} />;
        }
    }

    function FeaturedSort(){
        return function (a, b) { return calculateSimilarity(b) - calculateSimilarity(a) };
    }

    function calculateSimilarity(dataDict) {
        if (dataDict["user_id"] != null) {
            return calculateLifestyleSimilarity(dataDict);
        } else {
            return calculateRoomLifestyleSimilarity(dataDict);
        }
    }

    function calculateRoomLifestyleSimilarity(roomDict) {
        if (roomDict != null && roomDict.length > 0){
            let totalSimilarity = 0;
            roomDict.roommate_id.forEach((value, index, array) => {
                    totalSimilarity += calculateLifestyleSimilarity(value);
                }
            );
            totalSimilarity /= roomDict.length;
            return totalSimilarity;
        } else {
            return 0;
        }
    }

    function calculateLifestyleSimilarity(personDict) {
        if (userData != null && personDict != null) {
            var questions = personDict.lifestyle_answers;
            var userQuestions = userData.lifestyle_answers;

            var lifestyle_sim = 0;

            if (questions != null && userQuestions != null) {
                lifestyle_sim += 10 - Math.abs(questions[0] - userQuestions[0]) * 5;

                if (questions[1] == 1 || userQuestions[1] == 1) {
                    if (questions[0] != userQuestions[0]) {
                        lifestyle_sim *= 0;
                    }
                }

                lifestyle_sim += 10 - Math.abs(questions[2] - userQuestions[2]) * 5;

                if (questions[3] == 1 || userQuestions[3] == 1) {
                    if (questions[2] != userQuestions[2]) {
                        lifestyle_sim *= 0;
                    }
                }

                lifestyle_sim += 10 - Math.abs(questions[4] - userQuestions[4]) * 5;

                if (questions[5] == 1 || userQuestions[5] == 1) {
                    if (questions[4] != userQuestions[4]) {
                        lifestyle_sim *= 0;
                    }
                }

                if (questions[6] == userQuestions[6]) {
                    lifestyle_sim += 5;
                }

                if (questions[7] == 1) {
                    if (userQuestions[6] == 0) {
                        lifestyle_sim *= 0;
                    }
                }
                if (userQuestions[7] == 1) {
                    if (questions[6] == 0) {
                        lifestyle_sim *= 0;
                    }
                }

                if (questions[8] == userQuestions[8]) {
                    lifestyle_sim += 5;
                }

                lifestyle_sim += 10 - Math.abs(questions[9] - userQuestions[9]) * 3.33;

                lifestyle_sim += 20 - Math.abs(questions[10] - userQuestions[10]) * 10;

                lifestyle_sim += 10 - Math.abs(questions[11] - userQuestions[11]) * 5;

                lifestyle_sim += 20 - Math.abs(questions[12] - userQuestions[12]) * 10;

                lifestyle_sim += 10 - Math.abs(questions[13] - userQuestions[13]) * 5;

                lifestyle_sim += 20 - Math.abs(questions[14] - userQuestions[14]) * 10;

                lifestyle_sim += 20 - Math.abs(questions[15] - userQuestions[15]) * 10;

                lifestyle_sim += 20 - Math.abs(questions[16] - userQuestions[16]) * 10;

            }
        }

        lifestyle_sim *= (100 / 170);
        lifestyle_sim = Math.round(lifestyle_sim * 100) / 100;

        if (userData != null && personDict != null){
            console.log("Lifestyle Sim between " + personDict.first_name + " and " + userData.first_name + ": " + lifestyle_sim);
        }

        return lifestyle_sim;
    }

}
