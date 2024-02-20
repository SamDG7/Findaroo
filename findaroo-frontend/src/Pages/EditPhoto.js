import "./Page.css"
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import ReactCrop, {} from 'react-image-crop';
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputImage} from "../Components/InputFields";

export default function EditPhoto() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState();

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h3>
                            Upload Photo
                        </h3>
                        {image && (
                            <img src={URL.createObjectURL(image)} alt="Profile Photo"/>
                        )}
                        <InputImage onChangeFunction={(e) => setImage(e.target.files[0])}/>
                    </div>
                    <div className="Column Start">
                        <h3>
                            Crop Photo
                        </h3>
                        {image && (
                            <img src={URL.createObjectURL(image)} alt="Profile Photo"/>
                        )}
                        <InputStandard name="Crop Left" defaultValue={0}/>
                        <InputStandard name="Crop Right" defaultValue={0}/>
                        <InputStandard name="Crop Top" defaultValue={0}/>
                        <InputStandard name="Crop Bottom" defaultValue={0}/>
                    </div>
                    <div className="Column End">
                        <ButtonImportant text="Save" onClickFunction={SavePhotoCall}/>
                        <div className="p-[1vh]"/>
                        <Link to="/Profile">
                            <ButtonStandard text="Back"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    // I still need to work on this - Andy
    function OpenImage(file) {
        var input = file.target;
        var reader = new FileReader();
        reader.onload = function () {
            setImage(reader.result);
        };
    };

    function SavePhotoCall(userId) {

    }
}