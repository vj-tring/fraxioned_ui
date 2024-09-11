import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { propertyImageapi, deletetpropertyImageById } from '@/api';
import { Edit, Trash2 } from 'lucide-react';
import Loader from '@/components/loader';
import styles from './propertyphoto.module.css';
import ConfirmationModal from '@/components/confirmation-modal';

interface PropertyImage {
    property: any;
    id: number;
    imageUrl: string;
    imageName: string;
    spaceType: {
        name: string;
        space: {
            name: string;
        };
    };
}

const PropertyPhotos: React.FC = () => {
    const [images, setImages] = useState<PropertyImage[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const refreshPhotos = async () => {
        setIsLoading(true);
        try {
            const response = await propertyImageapi();
            if (response.data && response.data.success) {
                const propertyImages = response.data.data.filter(
                    (img: PropertyImage) => img.property.id === parseInt(id || '0', 10)
                );
                setImages(propertyImages);
            }
        } catch (error) {
            console.error('Error fetching property images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshPhotos();
    }, [id, location.pathname]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleEditImage = (imageId: number) => {
        navigate(`/admin/property/${id}/photos/${imageId}/edit`);
    };

    const handleDeleteImage = (imageId: number) => {
        setImageToDelete(imageId);
        setShowDeleteConfirmation(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setImageToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (imageToDelete) {
            setIsLoading(true);
            try {
                await deletetpropertyImageById(imageToDelete);
                await refreshPhotos();
                setShowDeleteConfirmation(false);
                setImageToDelete(null);
            } catch (error) {
                console.error('Error deleting property image:', error);
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className={styles.propertyPhotosContainer}>
            {isLoading && (
                <div className={styles.loaderOverlay}>
                    <Loader />
                </div>
            )}
            <div className={styles.header}>
                <h1 className={styles.title}>Property Images</h1>
                <div className={styles.buttonGroup}>
                    <Link to={`/admin/property/${id}/photos/upload`} className={styles.button}>
                        New Upload
                    </Link>
                    <button className={`${styles.button} ${isEditMode ? styles.activeButton : ''}`} onClick={toggleEditMode}>
                        {isEditMode ? 'Done' : 'Edit'}
                    </button>
                </div>
            </div>
            <div className={styles.photoGridContainer}>
                <div className={styles.photoGrid}>
                    {images.map((image) => (
                        <div key={image.id} className={styles.photoItem}>
                            <div className={styles.imageWrapper}>
                                <img src={image.imageUrl} alt={image.imageName} className={styles.propertyImage} />
                                {isEditMode && (
                                    <div className={styles.editOverlay}>
                                        <button className={styles.iconButton} onClick={() => handleEditImage(image.id)}>
                                            <Edit size={24} />
                                        </button>
                                        <button className={styles.iconButton} onClick={() => handleDeleteImage(image.id)}>
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className={styles.imageInfo}>
                                <p className={styles.spaceName}>{image.spaceType.space.name}</p>
                                <p className={styles.spaceType}>{image.spaceType.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ConfirmationModal
                show={showDeleteConfirmation}
                onHide={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this image?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default PropertyPhotos;
