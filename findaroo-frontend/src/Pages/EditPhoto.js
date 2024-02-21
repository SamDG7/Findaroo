import "./Page.css"
import 'react-image-crop/dist/ReactCrop.css'
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import ButtonStandard, {ButtonImportant} from "../Components/Buttons";
import {InputImage} from "../Components/InputFields";
import ImageCropper from "../Components/ImageCropper";

export default function EditPhoto() {
    // This redirects to the login page if not logged in
    const navigate = useNavigate();

    useEffect(() => {
        if (!GlobalVariables.authenticated) {
            navigate("/Login");
        }
    }, []);

    const [imageToCrop, setImageToCrop] = useState(undefined);
    const [croppedImage, setCroppedImage] = useState(undefined);

    const onUploadFile = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            const reader = new FileReader();

            reader.addEventListener("load", () => {
                const image = reader.result;

                setImageToCrop(image);
            });

            reader.readAsDataURL(event.target.files[0]);
        }
    };

    return (
        <div className="Page">
            <Navbar/>
            <div className="Panel mx-[2vw] my-[2vh] px-[1vw] py-[1vh] drop-shadow-xl">
                <div className="Row Start">
                    <div className="Column Start">
                        <h3>
                            Upload Photo
                        </h3>
                        <InputImage onChangeFunction={onUploadFile}/>
                    </div>
                    {imageToCrop && (<div className="Column Start">
                            <h3>
                                Crop Photo
                            </h3>
                            <ImageCropper
                                imageToCrop={imageToCrop}
                                onImageCropped={(croppedImage) => setCroppedImage(croppedImage)}
                            />
                    </div>)}
                    {croppedImage  && (<div className="Column Start">
                        <h3>
                            Final Photo
                        </h3>
                        <img
                            alt="Cropped Image"
                            src={croppedImage}
                        />
                    </div>)}
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

    // I think you should just be able to just send the croppedImage as a file, but if
    // not let me know and I can take a look at it - Andy
    function SavePhotoCall(userId) {

        navigate('/Profile');
    }
}