import "./Page.css"
import 'react-image-crop/dist/ReactCrop.css'
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import ReactCrop, {} from 'react-image-crop';
import {useEffect, useState} from "react";
import ButtonStandard, {ButtonDelete, ButtonImportant} from "../Components/Buttons";
import InputStandard, {InputImage} from "../Components/InputFields";
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

    const SavePhotoCall = async () => {
        console.log("PUT Call");
        try {
            let imageBlob = await fetch(croppedImage).then(r => r.blob());
            const imageFile = new File([imageBlob], "Profile.png", { type: imageBlob.type })
            var reader = new FileReader();

            reader.onload = async function(event) {
                const imageBinary = event.target.result
                console.log(imageBinary);
                const form = {
                    user_id: GlobalVariables.userCredential.uid,
                    image_name: "Profile",
                    form_file: imageBinary
                }
                await fetch('http://localhost:5019/Image', {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form)
                }).then(response => {
                    return response.text()
                });
            };
            reader.readAsArrayBuffer(imageBlob);
        }catch (err) {
            console.log(err)
        }
    }

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
}