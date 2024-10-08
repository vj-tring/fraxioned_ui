import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './addamenity.module.css';
import Loader from '@/components/loader';
import { AiOutlinePlus, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { addAmenity, resetAddAmenityState } from '@/store/slice/auth/addamenitySlice';
import { 
    addAmenityGroup, 
    resetAmenityGroupState, 
    fetchAmenityGroups 
} from '@/store/slice/auth/amenityGroups';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

interface AmenityGroup {
    id: number;
    name: string;
}

interface NewAmenityFormProps {
    onClose: () => void;
    onAmenityAdded: () => void;
}

const NewAmenityForm: React.FC<NewAmenityFormProps> = ({ onClose, onAmenityAdded }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading: addAmenityLoading, error: addAmenityError, success: addAmenitySuccess } = useSelector((state: RootState) => state.addAmenity);
    const { 
        loading: amenityGroupLoading, 
        error: amenityGroupError, 
        success: amenityGroupSuccess,
        data: amenityGroups,
        addSuccess: addAmenityGroupSuccess 
    } = useSelector((state: RootState) => state.amenityGroups);

    const [selectedAmenityGroup, setSelectedAmenityGroup] = useState<AmenityGroup | null>(null);
    const [customAmenityType, setCustomAmenityType] = useState('');
    const [showCustomAmenityInput, setShowCustomAmenityInput] = useState(false);
    const [amenityName, setAmenityName] = useState('');
    const [amenityDescription, setAmenityDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        dispatch(fetchAmenityGroups());
    }, [dispatch, addAmenityGroupSuccess]);

    useEffect(() => {
        if (addAmenitySuccess) {
            onAmenityAdded();
            onClose();
            dispatch(resetAddAmenityState());
        }
    }, [addAmenitySuccess, onAmenityAdded, onClose, dispatch]);

    useEffect(() => {
        if (addAmenityGroupSuccess) {
            dispatch(resetAmenityGroupState());
        }
    }, [addAmenityGroupSuccess, dispatch]);

    useEffect(() => {
        if (addAmenityError) {
            setError(addAmenityError);
        }
        if (amenityGroupError) {
            setError(amenityGroupError);
        }
    }, [addAmenityError, amenityGroupError]);

    const handleAddCustomAmenityType = async () => {
        if (customAmenityType && !amenityGroups?.some(group => group.name === customAmenityType)) {
            const data = {
                createdBy: {
                    id: 1
                },
                name: customAmenityType
            };
            await dispatch(addAmenityGroup(data));
            setShowCustomAmenityInput(false);
            setCustomAmenityType('');
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

        dispatch(addAmenity(data));
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                {(amenityGroupLoading || addAmenityLoading) && (
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
                                    const selected = amenityGroups?.find(group => group.id === Number(e.target.value));
                                    setSelectedAmenityGroup(selected || null);
                                }}
                                className={styles.selectInput}
                                required
                            >
                                <option value="">Select Amenity Group</option>
                                {amenityGroups?.map((group) => (
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