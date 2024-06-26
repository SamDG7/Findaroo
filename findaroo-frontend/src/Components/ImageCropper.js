// Copied from https://img.ly/blog/how-to-crop-an-image-in-react-with-react-image-crop/

import React, {useState} from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import WhiteSquare from '../WhiteSquare.png'

function ImageCropper(props) {
    const {imageToCrop, onImageCropped} = props;

    const [cropConfig, setCropConfig] = useState(
        // default crop config
        {
            unit: '%',
            width: 50,
            x: 25,
            y: 25,
            aspect: 1,
        }
    );

    const [imageRef, setImageRef] = useState();

    async function cropImage(crop) {
        if (imageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImage(
                imageRef,
                crop,
                'croppedImage.jpeg' // destination filename
            );

            // calling the props function to expose
            // croppedImage to the parent component
            onImageCropped(croppedImage);
        }
    }

    function getCroppedImage(sourceImage, cropConfig, fileName) {
        // creating the cropped image from the source image
        const canvas = document.createElement('canvas');
        const scaleX = sourceImage.naturalWidth / sourceImage.width;
        const scaleY = sourceImage.naturalHeight / sourceImage.height;

        canvas.width = cropConfig.width;
        canvas.height = cropConfig.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            sourceImage,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            cropConfig.width,
            cropConfig.height
        );

        return canvas.toDataURL('image/png');
    }

    return (
        <ReactCrop
            src={imageToCrop || WhiteSquare}
            imageStyle={{
                resizeMode: 'stretch',
                height: '60vh',
            }}
            crop={cropConfig}
            aspect={1}
            ruleOfThirds
            onImageLoaded={(imageRef) => setImageRef(imageRef)}
            onComplete={(cropConfig) => cropImage(cropConfig)}
            onChange={(cropConfig) => setCropConfig(cropConfig)}
            crossorigin="anonymous" // to avoid CORS-related problems
        />
    );
}

ImageCropper.defaultProps = {
    onImageCropped: () => {}
}

export default ImageCropper;
