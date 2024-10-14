import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { amenitiesapi } from '@/store/service';
import styles from './editamenityform.module.css';

interface Amenity {
    id: number;
    amenityName: string;
    amenityType: string;
}

const EditAmenityForm: React.FC = () => {
    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const response = await amenitiesapi();
                const groupedAmenities = response.data.data.reduce((acc: any, amenity: Amenity) => {
                    if (!acc[amenity.amenityType]) {
                        acc[amenity.amenityType] = [];
                    }
                    acc[amenity.amenityType].push(amenity);
                    return acc;
                }, {});
                setAmenities(groupedAmenities);
            } catch (err) {
                console.error('Error fetching amenities:', err);
            }
        };

        fetchAmenities();
    }, []);

    const handleClose = () => {
        navigate(`/property/${id}/amenities`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Edit Amenities</h2>
                <button className={styles.closeButton} onClick={handleClose}>Close</button>
            </div>
            <div className={styles.content}>
                {Object.keys(amenities).map((type) => (
                    <div key={type} className={styles.amenityGroup}>
                        <h3 className={styles.amenityType}>{type}</h3>
                        {amenities[type].map((amenity) => (
                            <label key={amenity.id} className={styles.amenityItem}>
                                <input type="checkbox" />
                                {amenity.amenityName}
                            </label>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.footer}>
                <button className={styles.saveButton} onClick={handleClose}>Save Changes</button>
            </div>
        </div>
    );
};

export default EditAmenityForm;