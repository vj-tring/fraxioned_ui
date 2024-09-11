import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './newphoto.module.css';
import { propertyImageuploadapi } from '@/api';
import Loader from '@/components/loader';

const spaceTypes = [
    { id: 1, name: 'Dining Room' },
    { id: 2, name: 'Exterior' },
    { id: 3, name: 'Family Room' },
    { id: 4, name: 'Garage' },
    { id: 5, name: 'Kitchen' },
    { id: 6, name: 'Living Room' },
    { id: 7, name: 'Other' },
    { id: 8, name: 'Patio' },
    { id: 9, name: 'Pool' },
    { id: 10, name: 'Theatre Room' },
];

const spaces = [
    { id: 1, name: 'General' },
    { id: 2, name: 'Bedroom' },
    { id: 3, name: 'Bathroom' },
];

const PhotoUpload: React.FC = () => {
    const [images, setImages] = useState<File[]>([]);
    const [name, setName] = useState('');
    const [spaceType, setSpaceType] = useState(spaceTypes[0].id);
    const [space, setSpace] = useState(spaces[0].id);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages([...images, ...Array.from(e.target.files)]);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const createdBy = 1;
        const propertyImagesData = images.map((image, index) => ({
            property: { id: parseInt(id || '0', 10) },
            createdBy: { id: createdBy },
            displayOrder: index + 1,
            name: name,
            spaceType: { id: spaceType },
            space: { id: space }
        }));
        console.log('data', propertyImagesData);
        const formData = new FormData();

        images.forEach((image, index) => {
            formData.append(`imageFiles`, image);
            console.log(`Appending image ${index}:`, image);
        });
        formData.append('propertyImages', JSON.stringify(propertyImagesData));
        console.log("images", images);

        console.log('from file', formData)

        try {
            await propertyImageuploadapi(formData);
            navigate(`/admin/property/${id}/photos`);
        } catch (error) {
            console.error('Error uploading images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.loaderOverlay}>
                    <Loader />
                </div>
            )}
            <h2 className={styles.title}>Upload Photos</h2>
            <div className={styles.content}>
                <div className={styles.formSection}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Name</label>
                        <input
                            id="name"
                            type="text"
                            className={styles.input}
                            placeholder="Enter name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="spaceType" className={styles.label}>Space Type</label>
                        <select
                            id="spaceType"
                            className={styles.select}
                            value={spaceType}
                            onChange={(e) => setSpaceType(parseInt(e.target.value))}
                        >
                            {spaceTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="space" className={styles.label}>Space</label>
                        <select
                            id="space"
                            className={styles.select}
                            value={space}
                            onChange={(e) => setSpace(parseInt(e.target.value))}
                        >
                            {spaces.map((space) => (
                                <option key={space.id} value={space.id}>
                                    {space.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.fileInputWrapper}>
                        <input
                            type="file"
                            multiple
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className={styles.fileInputLabel}>
                            Choose Image files
                        </label>
                    </div>
                </div>
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>Image Preview</h3>
                    <div className={styles.previewScroll}>
                        <div className={styles.previewGrid}>
                            {images.map((image, index) => (
                                <div key={index} className={styles.previewItem}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className={styles.previewImage}
                                    />
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.buttonGroup}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Submit
                </button>
                <button
                    className={styles.cancelButton}
                    onClick={() => navigate(`/admin/property/${id}/photos`)}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PhotoUpload;
