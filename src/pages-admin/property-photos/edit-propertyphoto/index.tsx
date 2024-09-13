import React, { useState, useEffect } from 'react';
import { getpropertyImageById, propertyImageeditapi, propertyspaceapi, propertyspacetypesapi } from '@/api';
import Loader from '@/components/loader';
import styles from './editphoto.module.css';
import { X } from 'lucide-react';

interface Space {
    id: number;
    name: string;
}

interface SpaceType {
    id: number;
    name: string;
    space: {
        id: number;
        name: string;
    };
}

interface EditPhotoProps {
    propertyId: string | undefined;
    imageId: string | undefined;
    onClose: () => void;
}

const EditPhoto: React.FC<EditPhotoProps> = ({ propertyId, imageId, onClose }) => {
    const [name, setName] = useState('');
    const [space, setSpace] = useState<number | null>(null);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [spaceType, setSpaceType] = useState<number | null>(null);
    const [spaceTypes, setSpaceTypes] = useState<SpaceType[]>([]);
    const [filteredSpaceTypes, setFilteredSpaceTypes] = useState<SpaceType[]>([]);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [displayOrder, setDisplayOrder] = useState(1);

    useEffect(() => {
        const fetchSpacesAndTypes = async () => {
            try {
                const spacesResponse = await propertyspaceapi();
                setSpaces(spacesResponse.data.data);

                const spaceTypesResponse = await propertyspacetypesapi();
                setSpaceTypes(spaceTypesResponse.data.data);
            } catch (error) {
                console.error('Error fetching spaces and types:', error);
            }
        };

        fetchSpacesAndTypes();
    }, []);

    useEffect(() => {
        const fetchImageDetails = async () => {
            try {
                const response = await getpropertyImageById(Number(imageId));
                const imageDetails = response.data.data;

                if (imageDetails) {
                    setName(imageDetails.imageName || '');
                    setSpace(imageDetails.spaceType?.space?.id || null);
                    setSpaceType(imageDetails.spaceType?.id || null);
                    setCurrentImage(imageDetails.imageUrl || null);
                    setDisplayOrder(imageDetails.displayOrder || 1);
                }
            } catch (error) {
                console.error('Error fetching image details:', error);
            }
        };

        if (imageId) {
            fetchImageDetails();
        }
    }, [imageId]);

    useEffect(() => {
        if (space) {
            const filtered = spaceTypes.filter(type => type.space.id === space);
            setFilteredSpaceTypes(filtered);
            if (filtered.length > 0 && !filtered.find(type => type.id === spaceType)) {
                setSpaceType(filtered[0].id);
            }
        }
    }, [space, spaceTypes]);

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
                property: { id: Number(propertyId) },
                updatedBy: { id: 1 },
                displayOrder: displayOrder,
                name: name,
                spaceType: { id: spaceType },
                space: { id: space }
            };

            formData.append('propertyImage', JSON.stringify(propertyImageData));

            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            await propertyImageeditapi(Number(imageId), formData);
            onClose();
        } catch (error) {
            console.error('Error updating image:', error);
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.editPhotoOverlay} onClick={onClose}>
            <div className={styles.editPhotoContainer} onClick={(e) => e.stopPropagation()}>
                {isLoading && (
                    <div className={styles.loaderOverlay}>
                        <Loader />
                    </div>
                )}
                <h2 className={styles.title}>Update Photo Information</h2>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
                <div className={styles.content}>
                    <div className={styles.previewSection}>
                        <h3 className={styles.previewTitle}>
                            {imageFile ? 'Updated Image' : 'Current Image'}
                        </h3>
                        <div className={styles.previewContainer}>
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={imageFile ? 'Updated' : 'Current'}
                                    className={styles.previewImage}
                                />
                            ) : (
                                <div className={styles.placeholderImage}>No image selected</div>
                            )}
                        </div>
                    </div>
                    <div className={styles.formContainer}>
                        <div className={styles.formSection}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="space" className={styles.label}>Space</label>
                                <select
                                    id="space"
                                    className={styles.select}
                                    value={space || ''}
                                    onChange={(e) => setSpace(parseInt(e.target.value))}
                                >
                                    <option value="">Select a space</option>
                                    {spaces.map((space) => (
                                        <option key={space.id} value={space.id}>
                                            {space.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="spaceType" className={styles.label}>Space Type</label>
                                <select
                                    id="spaceType"
                                    className={styles.select}
                                    value={spaceType || ''}
                                    onChange={(e) => setSpaceType(parseInt(e.target.value))}
                                >
                                    <option value="">Select a space type</option>
                                    {filteredSpaceTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
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
                            <div className={styles.buttonGroup}>
                                <button className={styles.submitButton} onClick={handleSubmit}>
                                    Update
                                </button>
                                <button
                                    className={styles.cancelButton}
                                    onClick={onClose}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPhoto;