import "./Page.css"
import 'react-image-crop/dist/ReactCrop.css'
import Navbar from "../Components/Navbar";
import GlobalVariables from "../Utils/GlobalVariables";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
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

    function SavePhotoCall() {
        SavePhotoAsync();
    }

    function dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        var ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        var blob = new Blob([ab], {type: mimeString});
        return blob;

    }

    async function SavePhotoAsync() {
        console.log("POST Call");
        try {
            // croppedImage is a data URL
            // convert it to a file
            const imageData = atob(croppedImage.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(imageData.length);
            const uint8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < imageData.length; i++) {
                uint8Array[i] = imageData.charCodeAt(i);
            }
            const blob = new Blob([arrayBuffer], { type: 'image/png' });
            const file = new File([blob], 'canvas_image.png', { type: 'image/png' });
            console.log(file);

            // Setup the form
            const form = new FormData();
            form.append("user_id", GlobalVariables.userCredential.uid)
            form.append("image_name", "Profile.png")
            form.append("form_file", file)

            await fetch('http://localhost:5019/Image', {
                method: "POST",
                body: form
            }).then(response => {
                return response.text()
            });
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
                                onImageCropped={(crop) => setCroppedImage(crop)}
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