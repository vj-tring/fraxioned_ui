import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './editphoto.module.css';
import { getpropertyImageById, propertyImageeditapi } from '@/api';
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
    { id: 1, name: 'General' }
];

const EditPhoto: React.FC = () => {
    const [name, setName] = useState('');
    const [spaceType, setSpaceType] = useState(spaceTypes[0].id);
    const [space, setSpace] = useState(spaces[0].id);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [displayOrder, setDisplayOrder] = useState(1);
    const { id, imageId } = useParams<{ id: string; imageId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                const response = await getpropertyImageById(Number(imageId));
                const imageDetails = response.data.data;

                if (imageDetails) {
                    setName(imageDetails.imageName || '');
                    setSpaceType(imageDetails.spaceType?.id || spaceTypes[0].id);
                    setSpace(imageDetails.spaceType?.space?.id || spaces[0].id);
                    setCurrentImage(imageDetails.imageUrl || null);
                    setDisplayOrder(imageDetails.displayOrder || 1);
                } else {
                    console.error('Image details not found in the response');
                }
            } catch (error) {
                console.error('Error fetching image details:', error);
            }
        };

        if (imageId) {
            fetchImageDetails();
        }
    }, [imageId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setCurrentImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            const propertyImageData = {
                property: { id: Number(id) },
                updatedBy: { id: 1 },
                displayOrder: displayOrder,
                name: name,
                spaceType: { id: spaceType }
            };

            formData.append('propertyImage', JSON.stringify(propertyImageData));

            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            await propertyImageeditapi(Number(imageId), formData);
            navigate(`/admin/property/${id}/photos`, { state: { fromEdit: true } });
        } catch (error) {
            console.error('Error updating image:', error);
            navigate(`/admin/property/${id}/photos`, { state: { fromEdit: true } });
        }

        finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.container}>
             {isLoading && (
                <div className={styles.loaderOverlay}>
                    <Loader />
                </div>
            )}
            <h2 className={styles.title}>Update Photo Information</h2>
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
                    <div className={styles.inputGroup}>
                        <label htmlFor="displayOrder" className={styles.label}>Display Order</label>
                        <input
                            id="displayOrder"
                            type="number"
                            className={styles.input}
                            value={displayOrder}
                            onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                        />
                    </div>
                    <div className={styles.fileInputWrapper}>
                        <input
                            type="file"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className={styles.fileInputLabel}>
                            Choose New Image
                        </label>
                    </div>
                </div>
                <div className={styles.previewSection}>
                    <h3 className={styles.previewTitle}>Current Image</h3>
                    <div className={styles.previewContainer}>
                        {currentImage ? (
                            <img
                                src={currentImage}
                                alt="Current"
                                className={styles.previewImage}
                            />
                        ) : (
                            <div className={styles.placeholderImage}>No image selected</div>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.buttonGroup}>
                <button className={styles.submitButton} onClick={handleSubmit}>
                    Update
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

export default EditPhoto;