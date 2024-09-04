import React, { useState, useEffect } from 'react';
import { amenitiesapi } from '@/api';
import styles from './editamenityform.module.css';
import CloseIcon from '@mui/icons-material/Close';

interface Amenity {
    id: number;
    amenityName: string;
    amenityType: string;
}

interface EditAmenityFormProps {
    onClose: () => void;
}

const EditAmenityForm: React.FC<EditAmenityFormProps> = ({ onClose }) => {
    const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});

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

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Edit Amenities</h2>
                    <CloseIcon className={styles.closeIcon} onClick={onClose} />
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
            </div>
        </div>
    );
};

export default EditAmenityForm;
