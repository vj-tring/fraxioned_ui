import React, { useEffect, useState } from 'react';
import styles from './addamenity.module.css';
import { addamenity, getamenitygroup, addamenitygroup } from '@/api';
import Loader from '@/components/loader';
import { AiOutlinePlus, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';

interface AmenityGroup {
    id: number;
    name: string;
}

interface NewAmenityFormProps {
    onClose: () => void;
    onAmenityAdded: () => void;
}

const NewAmenityForm: React.FC<NewAmenityFormProps> = ({ onClose, onAmenityAdded }) => {
    const [selectedAmenityGroup, setSelectedAmenityGroup] = useState<AmenityGroup | null>(null);
    const [customAmenityType, setCustomAmenityType] = useState('');
    const [showCustomAmenityInput, setShowCustomAmenityInput] = useState(false);
    const [amenityName, setAmenityName] = useState('');
    const [amenityDescription, setAmenityDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [amenityGroups, setAmenityGroups] = useState<AmenityGroup[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAmenityGroups = async () => {
            try {
                const response = await getamenitygroup();
                if (response.data && response.data.data) {
                    setAmenityGroups(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching amenity groups:', error);
                setError('Failed to load amenity groups. Please try again.');
            }
        };
        fetchAmenityGroups();
    }, []);

    const handleAddCustomAmenityType = async () => {
        if (customAmenityType && !amenityGroups.some(group => group.name === customAmenityType)) {
            setIsLoading(true);
            try {
                const data = {
                    createdBy: {
                        id: 1
                    },
                    name: customAmenityType
                };
                const response = await addamenitygroup(data);
                if (response.data && response.data.data) {
                    const newGroup: AmenityGroup = response.data.data;
                    setAmenityGroups([...amenityGroups, newGroup]);
                    setSelectedAmenityGroup(newGroup);
                }
                setShowCustomAmenityInput(false);
                setCustomAmenityType('');
            } catch (error) {
                console.error('Failed to add new amenity group:', error);
                setError('Failed to add new amenity group. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowCustomAmenityInput(false);
            setCustomAmenityType('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!selectedAmenityGroup || !amenityName) {
            setError('Amenity Group and Name are required.');
            return;
        }
        setIsLoading(true);

        try {
            const data = {
                amenityGroup: {
                    id: selectedAmenityGroup.id
                },
                createdBy: {
                    id: 1
                },
                amenityName,
                amenityDescription
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
                        <label htmlFor="amenityGroup" className={styles.label}>Amenity Group*</label>
                        <div className={styles.amenityTypeContainer}>
                            <select
                                id="amenityGroup"
                                value={selectedAmenityGroup?.id || ''}
                                onChange={(e) => {
                                    const selected = amenityGroups.find(group => group.id === Number(e.target.value));
                                    setSelectedAmenityGroup(selected || null);
                                }}
                                className={styles.selectInput}
                                required
                            >
                                <option value="">Select Amenity Group</option>
                                {amenityGroups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
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
                                    placeholder="Enter new amenity group"
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