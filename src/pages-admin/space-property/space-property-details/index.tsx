import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import { MdKeyboardArrowRight, MdDelete } from "react-icons/md";
import { IoIosClose, IoIosImages } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import styles from './spacepropertydetails.module.css';
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { uploadPropertySpaceImages } from "@/api";
import { VscTrash } from "react-icons/vsc";




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

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);

        // Reuse the handlePhotoUpload function
        handlePhotoUpload({ target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>);
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
            await uploadPropertySpaceImages(formData);
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
                    <h2>{space?.space.name || "Space Name"} {space?.instanceNumber}</h2>
                    <Button variant="outlined" size="small" startIcon={<FaPlus />} onClick={() => setIsDialogOpen(true)}>
                        Add Photos
                    </Button>
                </div>
                {/* Second Section: Images */}
                <div className={styles.imageContainer} onClick={() => setIsDialogOpen(true)}>
                    <div className={styles.uploadContent}>
                        <img src="https://fraxionedportal.s3.us-west-2.amazonaws.com/properties/1/coverImages/Paradise+Shores+%28eighths%29-coverImage.jpg" />
                    </div>
                    <div className={styles.uploadLabel} >
                        <span>Add Photo</span>
                    </div>
                </div>


                {/* Third Section: Amenities */}
                <div className={styles.amenitiescontainer}>
                    <div className={styles.amenitiesheader}>
                        <h3>Amenities</h3>
                        <span><MdKeyboardArrowRight style={{ fontSize: '1.6rem' }} /></span>
                    </div>
                    <div className={styles.amenitiesname}>
                        Displaying the selected amenities
                    </div>
                </div>


                {/* Display List of Added Amenities */}
                {/* <div>
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
                </div> */}
                <hr />

                {/* Fourth Section: Delete Room or Space */}
                <div className={styles.deletecontainer}>
                    <FaTrash style={{ fontSize: '.7rem' }} />
                    <h3>Delete room or space</h3>
                </div>
            </div>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="xs" fullWidth>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>

                    <DialogTitle sx={{
                        height: '44px',
                        letterSpacing: '.02rem',
                        fontSize: 15,
                        paddingX: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                        backgroundColor: '#fff'
                    }}>
                        <IconButton sx={{ padding: 0 }}>
                            <IoIosClose size={24} onClick={() => setIsDialogOpen(false)} />
                        </IconButton>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                                Upload Photos
                            </Typography>
                            <Typography sx={{ fontSize: 9 }}>
                                {photoPreviews.length === 0 ? 'No Photos Selected' : `${photoPreviews.length} photo selected`}
                            </Typography>
                        </div>
                        <Button sx={{ padding: .4, minWidth: 0, borderRadius: '50%' }} size="small" component="label">
                            <GoPlus size={20} color="#666" />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={handlePhotoUpload}
                            />
                        </Button>
                    </DialogTitle>

                    <DialogContent sx={{ paddingBottom: 0 }}>
                        {/* Conditionally Render Upload Container or Previews */}
                        {photoPreviews.length === 0 ? (
                            <div
                                className={styles.uploadContainer}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                            >
                                <div className={styles.dragDropArea}>
                                    <IoIosImages className={styles.icon} />
                                    <p className={styles.dragDropText}>Drag and drop</p>
                                    <p className={styles.orText}>or browse for photos</p>
                                    <Button variant="contained" size="small" component="label" className={styles.browseButton}>
                                        Browse
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            hidden
                                            onChange={handlePhotoUpload}
                                        />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.photoPreviewContainer}>
                                {/* Preview Uploaded Images */}
                                <div className={styles.photoGrid}>
                                    {photoPreviews.map((preview, index) => (
                                        <div key={index} className={styles.photoItem}>
                                            <img
                                                src={preview}
                                                alt={`Uploaded Preview ${index}`}
                                                className={styles.previewImage}
                                            />
                                            <button
                                                onClick={() => handleDeletePhoto(index)}
                                                className={styles.deleteButton}
                                            >
                                                <VscTrash size={12} style={{ padding: .2 }} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </DialogContent>

                    <DialogActions sx={{
                        paddingTop: 1, display: 'flex', justifyContent: 'space-between', borderTop: 1, borderTopColor: '#ddd', position: 'sticky',
                        bottom: 0,
                        zIndex: 2,
                        backgroundColor: '#fff'
                    }}>
                        <Button onClick={() => setPhotoPreviews([])} size="small" sx={{ color: '#00636d' }} disabled={photoPreviews.length === 0}>Reset</Button>
                        <Button onClick={handleUploadImages} size="small" variant="contained" sx={{ backgroundColor: '#066670', color: '#fff' }} disabled={!photoPreviews.length}>
                            Upload
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>


        </div>
    );
};

export default SpacePropertyDetails;
