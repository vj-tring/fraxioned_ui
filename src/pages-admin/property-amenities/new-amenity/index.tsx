import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlus, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import styles from './addamenity.module.css';
import Loader from '@/components/loader';
import { createAmenity, resetAmenitiesState } from '@/store/slice/amenity';
import {
    addAmenityGroup,
    resetAmenityGroupState,
    fetchAmenityGroups
} from '@/store/slice/amenity/group';
import { AppDispatch } from '@/store';
import { RootState } from '@/store/reducers';
import { AmenityGroup, NewAmenityFormProps } from '../property-amenity.types';


const NewAmenityForm: React.FC<NewAmenityFormProps> = ({ onClose, onAmenityAdded }) => {
    const [isUploading, setIsUploading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const {
        loading: addAmenityLoading,
        error: addAmenityError,
        success: addAmenitySuccess
    } = useSelector((state: RootState) => state.amenities);
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
        imageFile: null as File | null,
    });
    const [error, setError] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);


    useEffect(() => {
        dispatch(fetchAmenityGroups());
    }, [dispatch, addAmenityGroupSuccess]);

    useEffect(() => {
        if (addAmenitySuccess) {
            onAmenityAdded();
            onClose();
            dispatch(resetAmenitiesState());
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

    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setFormData(prev => ({ ...prev, imageFile: file }));

            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                }
            }, 100);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleRemoveFile = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setPreviewUrl(null);
        setFormData(prev => ({ ...prev, imageFile: null }));
        setUploadProgress(0);
    }, []);

    const FileUploadPreview = () => (
        <div className={styles.fileUploadPreview}>
            {previewUrl ? (
                <div className={styles.previewContainer}>
                    <div className={styles.imagePreview}>
                        <img src={previewUrl} alt="Preview" />
                        <button className={styles.removeButton} onClick={handleRemoveFile}>
                            <AiOutlineClose />
                        </button>
                    </div>
                    <div className={styles.fileInfo}>
                        <span className={styles.fileName}>
                            {formData.imageFile?.name}
                        </span>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <label className={styles.uploadLabel}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                    <span>Choose file or drag here</span>
                </label>
            )}
        </div>
    );

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

        const { selectedAmenityGroup, amenityName, amenityDescription, imageFile } = formData;
        if (!selectedAmenityGroup || !amenityName) {
            setError('Amenity Group and Name are required.');
            return;
        }

        dispatch(createAmenity({
            amenityGroup: { id: selectedAmenityGroup.id },
            createdBy: { id: 1 },
            amenityName,
            amenityDescription,
            imageFile
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
                        <label className={styles.label}>Icon Upload</label>
                        <FileUploadPreview />
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
