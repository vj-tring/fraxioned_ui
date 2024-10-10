import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa"; // Import the plus icon
import styles from './spacepropertydetails.module.css';

const SpacePropertyDetails: React.FC = () => {
    const location = useLocation();
    const { space } = location.state || {};

    const [photo, setPhoto] = useState<File | null>(null); // State for the uploaded photo
    const [amenities, setAmenities] = useState<string>(""); // State for amenities input
    const [description, setDescription] = useState<string>(""); // State for the description

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setPhoto(event.target.files[0]); // Set the uploaded photo
        }
    };

    return (
        <>
            <div className={styles.fullContainer}>
                <div className={styles.maincontainer}>
                    <div className={styles.headersection}>
                        <h2>{space?.name || "Space Name"}</h2>
                        <Button variant="outlined" startIcon={<FaPlus />}>
                            Add
                        </Button>
                    </div>

                    <div className={styles.imagecontainer}>
                        <h3>Add Photo</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            style={{ marginRight: '10px' }}
                        />
                        {photo && <p>Uploaded: {photo.name}</p>} {/* Display uploaded photo name */}
                    </div>

                    {/* Third Row: Amenities Section */}
                    <div className={styles.amenitiescontainer}>
                        <h3>Amenities</h3>
                        <Button variant="outlined" startIcon={<FaPlus />}> Add Amenities</Button>
                    </div>

                    <hr />

                    {/* Fourth Row: Description Section */}
                    <div className={styles.deletecontainer}>
                        <FaTrash style={{ fontSize: '.7rem' }} /><h3>Delete room or space</h3>
                    </div>
                </div>

            </div>
        </>
    );
};

export default SpacePropertyDetails;
