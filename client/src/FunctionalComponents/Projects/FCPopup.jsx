import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../../firebase';
import firebase from 'firebase/compat/app';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function FCPopup({ photos,
    onClose,
    getPhotosFromStorage }) {
    const [hoveredImage, setHoveredImage] = useState(null);
    const [setPhotos] = useState([]);

    const handleImageHover = (imageUrl) => {
        setHoveredImage(imageUrl);
    };

    const handleImageLeave = () => {
        setHoveredImage(null);
    };

    const deleteImage = async (imageUrl, event) => {
        event.preventDefault();
        try {
            // Delete the image from Firebase storage
            const imageRef = storage.refFromURL(imageUrl);
            await imageRef.delete();

            // Remove the image from the state
            setPhotos((prevPhotos) => prevPhotos.filter((url) => url !== imageUrl));
        } catch (error) {
            console.log("Error deleting image:", error);
        }
    };

    return (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-button" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <div className="gallery">
                    {photos.map((url) => (
                        <div
                            key={url}
                            className="image-container"
                            onMouseEnter={() => handleImageHover(url)}
                            onMouseLeave={handleImageLeave}
                        >
                            <img src={url} alt="Photo" className="photo" />
                            {hoveredImage === url && (
                                <button
                                    className="delete-button"
                                    onClick={(event) => deleteImage(url, event)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}