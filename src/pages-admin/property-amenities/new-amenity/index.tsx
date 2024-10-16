import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlus, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import styles from './addamenity.module.css';
import Loader from '@/components/loader';
import { addAmenity, resetAddAmenityState } from '@/store/slice/auth/addamenitySlice';
import {
    addAmenityGroup,
    resetAmenityGroupState,
    fetchAmenityGroups
} from '@/store/slice/auth/amenityGroups';
import { AppDispatch } from '@/store';
import { RootState } from '@/store/reducers';

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
    const {
        loading: addAmenityLoading,
        error: addAmenityError,
        success: addAmenitySuccess
    } = useSelector((state: RootState) => state.addAmenity);
    const {
        loading: amenityGroupLoading,
        error: amenityGroupError,
        success: amenityGroupSuccess,
        data: amenityGroups,
        addSuccess: addAmenityGroupSuccess
    } = useSelector((state: RootState) => state.amenityGroups);

    const [formData, setFormData] = useState({
        selectedAmenityGroup: null as AmenityGroup | null,
        customAmenityType: '',
        showCustomAmenityInput: false,
        amenityName: '',
        amenityDescription: '',
    });
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
        setError(addAmenityError || amenityGroupError || '');
    }, [addAmenityError, amenityGroupError]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleAddCustomAmenityType = useCallback(async () => {
        const { customAmenityType } = formData;
        if (customAmenityType && !amenityGroups?.some(group => group.name === customAmenityType)) {
            await dispatch(addAmenityGroup({ createdBy: { id: 1 }, name: customAmenityType }));
        }
        setFormData(prev => ({ ...prev, showCustomAmenityInput: false, customAmenityType: '' }));
    }, [formData, amenityGroups, dispatch]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const { selectedAmenityGroup, amenityName, amenityDescription } = formData;
        if (!selectedAmenityGroup || !amenityName) {
            setError('Amenity Group and Name are required.');
            return;
        }

        dispatch(addAmenity({
            amenityGroup: { id: selectedAmenityGroup.id },
            createdBy: { id: 1 },
            amenityName,
            amenityDescription
        }));
    }, [formData, dispatch]);

    const renderAmenityGroupSelect = () => (
        <div className={styles.amenityTypeContainer}>
            <select
                id="amenityGroup"
                name="selectedAmenityGroup"
                value={formData.selectedAmenityGroup?.id || ''}
                onChange={(e) => {
                    const selected = amenityGroups?.find(group => group.id === Number(e.target.value));
                    setFormData(prev => ({ ...prev, selectedAmenityGroup: selected || null }));
                }}
                className={styles.selectInput}
                required
            >
                <option value="">Select Amenity Group</option>
                {amenityGroups?.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                ))}
            </select>
            {!formData.showCustomAmenityInput && (
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => setFormData(prev => ({ ...prev, showCustomAmenityInput: true }))}
                >
                    <AiOutlinePlus /> Add New
                </button>
            )}
        </div>
    );

    const renderCustomAmenityInput = () => (
        <div className={styles.customAmenityContainer}>
            <input
                type="text"
                name="customAmenityType"
                value={formData.customAmenityType}
                onChange={handleInputChange}
                placeholder="Enter new amenity group"
                className={styles.customAmenityInput}
            />
            <button type="button" className={styles.iconButton} onClick={handleAddCustomAmenityType}>
                <AiOutlineSave />
            </button>
            <button
                type="button"
                className={styles.iconButton}
                onClick={() => setFormData(prev => ({ ...prev, showCustomAmenityInput: false }))}
            >
                <AiOutlineClose />
            </button>
        </div>
    );

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
                        {renderAmenityGroupSelect()}
                        {formData.showCustomAmenityInput && renderCustomAmenityInput()}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amenityName" className={styles.label}>Amenity Name*</label>
                        <input
                            type="text"
                            id="amenityName"
                            name="amenityName"
                            value={formData.amenityName}
                            onChange={handleInputChange}
                            required
                            className={styles.input}
                            placeholder="Enter amenity name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="amenityDescription" className={styles.label}>Description (Optional)</label>
                        <textarea
                            id="amenityDescription"
                            name="amenityDescription"
                            value={formData.amenityDescription}
                            onChange={handleInputChange}
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