import React, { useState } from 'react';
import styles from './addamenity.module.css';
import { addamenity } from '@/api';

interface NewAmenityFormProps {
    onClose: () => void;
    onAmenityAdded: () => void;
}

const NewAmenityForm: React.FC<NewAmenityFormProps> = ({ onClose, onAmenityAdded }) => {
    const [amenityType, setAmenityType] = useState('');
    const [amenityName, setAmenityName] = useState('');
    const [amenityDescription, setAmenityDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amenityType || !amenityName) {
            setError('Amenity Type and Name are required.');
            return;
        }

        try {
            const data = {
                createdBy: {
                    id: 1
                },
                amenityName,
                amenityDescription,
                amenityType
            };
            await addamenity(data);
            onAmenityAdded();
            onClose();
        } catch (error) {
            console.error('Failed to add amenity:', error);
            setError('Failed to add amenity. Please try again.');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h2 className={styles.formTitle}>Add Amenity</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="amenityType" className={styles.label}>Amenity Type*</label>
                        <input
                            type="text"
                            id="amenityType"
                            value={amenityType}
                            onChange={(e) => setAmenityType(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="amenityName" className={styles.label}>Amenity Name*</label>
                        <input
                            type="text"
                            id="amenityName"
                            value={amenityName}
                            onChange={(e) => setAmenityName(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="amenityDescription" className={styles.label}>Description (Optional)</label>
                        <textarea
                            id="amenityDescription"
                            value={amenityDescription}
                            onChange={(e) => setAmenityDescription(e.target.value)}
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.submitButton}>Add</button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAmenityForm;