import React, { useEffect, useState } from 'react';
import styles from './addamenity.module.css';
import { addamenity, amenitiesapi } from '@/api';
import Loader from '@/components/loader';
import { AiOutlinePlus, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';

interface Amenity {
    amenityType: string;
}

interface NewAmenityFormProps {
    onClose: () => void;
    onAmenityAdded: () => void;
}

const NewAmenityForm: React.FC<NewAmenityFormProps> = ({ onClose, onAmenityAdded }) => {
    const [amenityType, setAmenityType] = useState('');
    const [customAmenityType, setCustomAmenityType] = useState('');
    const [showCustomAmenityInput, setShowCustomAmenityInput] = useState(false);
    const [amenityName, setAmenityName] = useState('');
    const [amenityDescription, setAmenityDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [amenityTypes, setAmenityTypes] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAmenityTypes = async () => {
            try {
                const response = await amenitiesapi();
                const distinctAmenityTypes = Array.from(new Set(
                    (response.data.data as Amenity[]).map((item: Amenity) => item.amenityType)
                ));
                setAmenityTypes(distinctAmenityTypes);
            } catch (error) {
                console.error('Error fetching amenity types:', error);
                setError('Failed to load amenity types. Please try again.');
            }
        };
        fetchAmenityTypes();
    }, []);

    const handleAddCustomAmenityType = () => {
        if (customAmenityType && !amenityTypes.includes(customAmenityType)) {
            setAmenityTypes([...amenityTypes, customAmenityType]);
            setAmenityType(customAmenityType);
        }
        setShowCustomAmenityInput(false);
        setCustomAmenityType('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!amenityType || !amenityName) {
            setError('Amenity Type and Name are required.');
            return;
        }
        setIsLoading(true);

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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                {isLoading && (
                    <div className={styles.loaderOverlay}>
                        <Loader />
                    </div>
                )}
                <div className={styles.formHeader}>
                    <h2 className={styles.formTitle}>Add New Amenity</h2>
                    <button onClick={onClose} className={styles.closeButton}>
                        <AiOutlineClose />
                    </button>
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="amenityType" className={styles.label}>Amenity Type*</label>
                        <div className={styles.amenityTypeContainer}>
                            <select
                                id="amenityType"
                                value={amenityType}
                                onChange={(e) => setAmenityType(e.target.value)}
                                className={styles.selectInput}
                                required
                            >
                                <option value="">Select Amenity Type</option>
                                {amenityTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {!showCustomAmenityInput && (
                                <button
                                    type="button"
                                    className={styles.addButton}
                                    onClick={() => setShowCustomAmenityInput(true)}
                                >
                                    <AiOutlinePlus /> Add New
                                </button>
                            )}
                        </div>
                        {showCustomAmenityInput && (
                            <div className={styles.customAmenityContainer}>
                                <input
                                    type="text"
                                    value={customAmenityType}
                                    onChange={(e) => setCustomAmenityType(e.target.value)}
                                    placeholder="Enter new amenity type"
                                    className={styles.customAmenityInput}
                                />
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={handleAddCustomAmenityType}
                                >
                                    <AiOutlineSave />
                                </button>
                                <button
                                    type="button"
                                    className={styles.iconButton}
                                    onClick={() => setShowCustomAmenityInput(false)}
                                >
                                    <AiOutlineClose />
                                </button>
                            </div>
                        )}
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
                            placeholder="Enter amenity name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amenityDescription" className={styles.label}>Description (Optional)</label>
                        <textarea
                            id="amenityDescription"
                            value={amenityDescription}
                            onChange={(e) => setAmenityDescription(e.target.value)}
                            className={styles.textarea}
                            placeholder="Enter amenity description"
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
                        <button type="submit" className={styles.submitButton}>Add Amenity</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAmenityForm;