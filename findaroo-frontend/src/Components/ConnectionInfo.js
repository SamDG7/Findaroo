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
            const form = {
            reviewer_id: auth.currentUser.uid, // Assuming this is the ID of the reviewer
            reviewed_id: connectionDict.user_id, // ID of the person being reviewed
            roomed: reviewData.roomed === 'yes',
            positive_remarks: reviewData.positiveRemarks,
            criticisms: reviewData.criticisms,
            };
            console.log('form:', form);

            const response = await fetch(GlobalVariables.backendURL + "/Review", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(form)
            });
    
            if (response.ok) {
                console.log('Review submitted successfully.');
                setModalOpen(false);
                alert("Your review was succesfully submitted!")
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
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
            </div>
            <h3 className="Column End">
                <ButtonImportant text="Review" onClickFunction={review} />
                <div className="my-3">
                <ButtonImportant text="Unfriend" onClickFunction={unfriend} />
                </div>
            </h3>
            {/* {isModalOpen && (
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
            )} */}
            {isModalOpen && (
    <div className=" inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
        <div className="modal-content bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-auto my-8">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Roommate Review Form</h2>
                <button className="close-btn text-gray-600 hover:text-gray-800" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <form className="mt-4">
                <p className="font-medium">Did you room with this person?</p>
                <div className="mb-4">
                    <label className="inline-flex items-center mr-4">
                        <input type="radio" name="roomed" value="yes" onChange={handleInputChange} className="text-blue-600 form-radio" />
                        <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" name="roomed" value="no" onChange={handleInputChange} className="text-blue-600 form-radio" />
                        <span className="ml-2">No</span>
                    </label>
                </div>
                <p className="font-medium">Positive remarks:</p>
                <textarea name="positiveRemarks" rows="4" onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md"></textarea>
                <p className="font-medium mt-4">Criticisms:</p>
                <textarea name="criticisms" rows="4" onChange={handleInputChange} className="mt-1 p-2 w-full border rounded-md"></textarea>
                <button type="button" onClick={submitReview} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Submit Review
                </button>
            </form>
        </div>
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