import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import InputStandard from "../Components/InputFields";
import ButtonStandard, { ButtonImportant } from "../Components/Buttons";
import { PersonInfoSmall } from "../Components/PersonInfo";
import Selector from "../Components/Selector";

export default function Search() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();
    const [blockedUsers, setBlockedUsers] = useState([])
    const [sortType, setSortType] = useState("Default");
    const [allUsers, setAllUsers] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }


    }, []);

    useEffect(() => {
        //REPLACE THIS WITH USER_ID
        console.log("GET Call")
        fetch('http://localhost:5019/User/All')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setAllUsers(data);
                setBlockedUsers(data[data.findIndex(obj => obj.user_id == GlobalVariables.userCredential.uid)].blocked_users);

            })
            .catch(error => console.error(error));

    }, []);

    useEffect(() => {
        console.log("GET Call for new added user in search")
        fetch('http://localhost:5019/User?user_id=' + GlobalVariables.userCredential.uid)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUserData(data);
            }).catch(error => console.error(error));
    }, []);

    return (
        <div className="Page">
            <Navbar />
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Column">
                    <div className="Column Start" >
                        <Selector name="Sort By" values={["Lifestyle Compatibility", "Situation Compatibility", "A-Z", "Z-A", "Rating (Descending)", "Rating (Ascending)", "Random", "Average Price (Ascending)", "Average Price (Descending)", "Min Price (Ascending)", "Min Price (Descending)", "Max Price (Ascending)", "Max Price (Descending)"]} onChangeFunction={(e) => setSortType(e.target.value)} />

                    </div>
                    <div className="Column End">
                        <p>Showing {allUsers.length} Potential Roomates</p>
                    </div>
                    {
                        allUsers != null && GetSortedPersons(allUsers, sortType)

                    }
                </div>
            </div>
        </div>
    );

    function filterBlockedUsers(data) {
        if (blockedUsers == null) {
            return data
        }
        for (let i = 0; i < data.length; i++) {

            console.log("profile visible: " + data[i].visible);

            if (blockedUsers.includes(data[i].user_id)) {
                data.splice(i, 1)
                i--
            } else if (data[i].visible == false) {
                data.splice(i, 1)
                i--
            }
        }

        return data
    }

    function filterPrivateUsers(data) {

        for (let i = 0; i < data.length; i++) {
            if (data[i].visible == false) {
                data.splice(i, 1)
                i--
            }
        }

        return data
    }

    function GetSortedPersons(data, sortTypeName) {
        data = filterBlockedUsers(data)
        data = filterPrivateUsers(data)

        const sortFunction = GetSort(sortTypeName);
        const sortedData = data.sort(sortFunction);


        return (
            sortedData.map((person, index) => (
                //Potentially calculate compatibility here
                <PersonInfoSmall key={index} personDict={person} similarityOutput={calculateLifestyleSimilarity(person)} />
            ))
        );
    }

    function calculateSituationSimilarity(personDict) {
        var total_sim = 5;
        if (userData != null) {

            // if (userData.min_price == null && userData.max_price == null) {
            //     return "Please fill out preferences to view similarity";
            // }

            // if (personDict.min_price == null && personDict.max_price == null) {
            //     return "This user has not filled out their preferences";
            // }

            if (personDict.age != null && userData.age != null) {
                if (Math.abs(personDict.min_price - userData.min_price) > 5) {
                    total_sim -= 0.35;
                }
            }

            if (personDict.min_price != null && userData.min_price != null) {
                if (Math.abs(personDict.min_price - userData.min_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.max_price != null && userData.max_price != null) {
                if (Math.abs(personDict.max_price - userData.max_price) > 500) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.school != null && userData.school != null) {
                if (personDict.school != userData.school) {
                    total_sim -= 1;
                }
            }
            if (personDict.state != null && userData.state != null) {
                if (personDict.state != userData.state) {
                    total_sim -= 0.5;
                }
            }
            if (personDict.rating) {
                if (personDict.rating < 3) {
                    total_sim -= 0.5;
                }
            }
        }

        if (total_sim < 0) {
            total_sim = 0;
        }

        total_sim *= 20;
        total_sim = Math.round(total_sim * 100) / 100;

        return total_sim;
    }
    
    function calculateLifestyleSimilarity(personDict) {
        if (userData != null) {
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

        console.log("Lifestyle Sim between " + personDict.first_name + " and " + userData.first_name + ": " + lifestyle_sim);

        return lifestyle_sim;
    }

    function GetSort(sortTypeName) {
        switch (sortTypeName) {
            default:
            case "Situation Compatibility":
                return function (a, b) {
                    if (typeof calculateSituationSimilarity(a) === 'string' || typeof calculateSituationSimilarity(b) === 'string') {
                        return calculateSituationSimilarity(a) - calculateSituationSimilarity(b)
                    }
                    return calculateSituationSimilarity(b) - calculateSituationSimilarity(a)
                };
            case "Lifestyle Compatibility":
                return function (a, b) { return calculateLifestyleSimilarity(b) - calculateLifestyleSimilarity(a) };
            case "A-Z":
                return function (a, b) { return a.first_name === b.first_name ? a.last_name.localeCompare(b.last_name) : a.first_name.localeCompare(b.first_name) };
            case "Z-A":
                return function (a, b) { return a.first_name === b.first_name ? b.last_name.localeCompare(a.last_name) : b.first_name.localeCompare(a.first_name) };
            case "Rating (Descending)":
                return function (a, b) { return b.rating - a.rating };
            case "Rating (Ascending)":
                return function (a, b) { return a.rating - b.rating };
            case "Random":
                return function (a, b) { return 0.5 - Math.random() };
            case "Average Price (Ascending)":
                return function (a, b) { return a.min_price + a.max_price - b.min_price - b.max_price };
            case "Average Price (Descending)":
                return function (a, b) { return b.min_price + b.max_price - a.min_price - a.max_price };
            case "Min Price (Ascending)":
                return function (a, b) { return a.min_price - b.min_price };
            case "Min Price (Descending)":
                return function (a, b) { return b.min_price - a.min_price };
            case "Max Price (Ascending)":
                return function (a, b) { return a.max_price - b.max_price };
            case "Max Price (Descending)":
                return function (a, b) { return b.max_price - a.max_price };
        }
    }
}
