import React from "react";
import './PersonInfo.css';
import { ButtonImportant } from "./Buttons";
import {getAuth} from 'firebase/auth';
import {useState} from "react";
import GlobalVariables from "../Utils/GlobalVariables";
import './Modal.css';

export function ConnectionInfo({connectionDict}) {
    const auth = getAuth();
    const [on, setData] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState({
        roomed: '',
        positiveRemarks: '',
        criticisms: ''
    });
    if (connectionDict == null){
        return;
    }
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setReviewData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const submitReview = async () => {
        console.log('Review Data:', reviewData);
        try {
            const response = await fetch(GlobalVariables.backendURL + "/Review", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    reviewerId: auth.currentUser.uid, // Assuming this is the ID of the reviewer
                    reviewedId: connectionDict.user_id, // ID of the person being reviewed
                    roomed: reviewData.roomed === 'yes',
                    positiveRemarks: reviewData.positiveRemarks,
                    criticisms: reviewData.criticisms
                })
            });
    
            if (response.ok) {
                console.log('Review submitted successfully.');
                setModalOpen(false);
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
        // Implement additional logic to send data to server here
    };

    function review() {
        setModalOpen(true);
    }

    if (on) {
        return (
            <div className="Row Start">
            <img className="ProfileImageSmall" src={connectionDict.image}
                 alt={`${connectionDict.name}'s profile picture`}/>
            <div className="Column Start">
                <h3>
                    {connectionDict.name}
                </h3>
                <ButtonImportant text="Review" onClickFunction={review} />
            </div>
            <h3 className="Column End">
                <ButtonImportant text="Unfriend" onClickFunction={unfriend} />
            </h3>
            {isModalOpen && (
                <div className="modal-content">
                    <span className="close-btn" onClick={() => setModalOpen(false)}>&times;</span>
                    <h2>Roommate Review Form</h2>
                    <form>
                        <p>Did you room with this person?</p>
                        <label><input type="radio" name="roomed" value="yes" onChange={handleInputChange} /> Yes</label>
                        <label><input type="radio" name="roomed" value="no" onChange={handleInputChange} /> No</label>
                        <p>Positive remarks:</p>
                        <textarea name="positiveRemarks" rows="4" onChange={handleInputChange}></textarea>
                        <p>Criticisms:</p>
                        <textarea name="criticisms" rows="4" onChange={handleInputChange}></textarea>
                        <button type="button" onClick={submitReview}>Submit Review</button>
                    </form>
                </div>
            )}
        </div>
        );
    }
    else {
        return;
    }
    
    async function unfriend() {
        await fetch(GlobalVariables.backendURL + "/Connection", {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({"user_1_id": connectionDict.user_id, "user_2_id": auth.currentUser.uid})
        }).catch(error => console.log(error));
        setData(false);
    }
}