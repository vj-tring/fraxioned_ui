import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa"; // Import the plus and trash icons
import axios from 'axios'; // Import axios for API call
import styles from './spacepropertydetails.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { propertySpaceImageuploadapi } from "@/api";


const SpacePropertyDetails: React.FC = () => {
    const location = useLocation();
    const { space } = location.state || {};
    const userId = useSelector((state: RootState) => state.auth.user?.id);


    // State for the uploaded photos (multiple)
    const [photos, setPhotos] = useState<File[]>([]);
    // State for photo previews
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    // State for the amenities input and list
    const [amenities, setAmenities] = useState<string>("");
    const [amenitiesList, setAmenitiesList] = useState<string[]>([]);
    // State for the description
    const [description, setDescription] = useState<string>("");

    // Dialog open/close state for image uploading
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Handles adding multiple photo uploads and generating previews
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);

            // Update photos state
            setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);

            // Generate previews
            const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
            setPhotoPreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
        }
    };

    // Handles deleting individual photos and their previews
    const handleDeletePhoto = (index: number) => {
        setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
        setPhotoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    };

    // Handles adding an amenity to the list
    const handleAddAmenity = () => {
        if (amenities.trim() !== "") {
            setAmenitiesList((prevList) => [...prevList, amenities]);
            setAmenities(""); // Clear input field
        }
    };

    // Handles deleting an amenity from the list
    const handleDeleteAmenity = (index: number) => {
        setAmenitiesList(amenitiesList.filter((_, i) => i !== index));
    };

    // Handle the image upload API call
    const handleUploadImages = async () => {
        const formData = new FormData();

        // Prepare metadata for each image
        const propertySpaceImages = photos.map((photo, index) => ({
            description: photo.name,
            displayOrder: index + 1,
            propertySpace: { id: space.id },
            createdBy: { id: userId }
        }));

        // Append metadata as text field
        formData.append('propertySpaceImages', JSON.stringify(propertySpaceImages));

        // Append each photo to formData
        photos.forEach((photo) => {
            formData.append('imageFiles', photo); // Make sure 'files' matches the backend expectations
        });

        try {
            // Call the upload API
            await propertySpaceImageuploadapi(formData);
            console.log('Images uploaded successfully');
            setIsDialogOpen(false); // Close dialog after successful upload
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    return (
        <div className={styles.fullContainer}>
            <div className={styles.maincontainer}>
                {/* First Section: Name and Add Button */}
                <div className={styles.headersection}>
                    <h2>{space?.space.name || "Space Name"}</h2>
                    <Button variant="outlined" startIcon={<FaPlus />} onClick={() => setIsDialogOpen(true)}>
                        Add Photos
                    </Button>
                </div>

                {/* Second Section: Amenities */}
                <div className={styles.amenitiescontainer}>
                    <h3>Amenities</h3>
                    <TextField
                        label="Add an Amenity"
                        value={amenities}
                        onChange={(e) => setAmenities(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <Button variant="outlined" startIcon={<FaPlus />} onClick={handleAddAmenity}>
                        Add
                    </Button>
                </div>

                {/* Display List of Added Amenities */}
                <div>
                    {amenitiesList.length > 0 && (
                        <ul>
                            {amenitiesList.map((amenity, index) => (
                                <li key={index} className={styles.amenityItem}>
                                    {amenity}
                                    <Button
                                        variant="text"
                                        startIcon={<FaTrash />}
                                        onClick={() => handleDeleteAmenity(index)}
                                    >
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <hr />

                {/* Fourth Section: Delete Room or Space */}
                <div className={styles.deletecontainer}>
                    <FaTrash style={{ fontSize: '.7rem' }} />
                    <h3>Delete room or space</h3>
                </div>
            </div>

            {/* Image Upload Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Upload Photos</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        style={{ marginBottom: '10px' }}
                    />

                    {/* Preview Uploaded Images */}
                    <div className={styles.photoPreviewContainer}>
                        {photoPreviews.length > 0 && (
                            <div className={styles.photoGrid}>
                                {photoPreviews.map((preview, index) => (
                                    <div key={index} className={styles.photoItem}>
                                        <img
                                            src={preview}
                                            alt={`Uploaded Preview ${index}`}
                                            className={styles.previewImage}
                                        />
                                        <Button
                                            variant="text"
                                            startIcon={<FaTrash />}
                                            onClick={() => handleDeletePhoto(index)}
                                            className={styles.deleteButton}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">Close</Button>
                    <Button onClick={handleUploadImages} color="primary">Upload</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SpacePropertyDetails;
