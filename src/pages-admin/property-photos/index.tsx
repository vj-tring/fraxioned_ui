import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { propertyImageapi, deletetpropertyImageById } from '@/api';
import { Edit, Trash2, X } from 'lucide-react';
import Loader from '@/components/loader';
import styles from './propertyphoto.module.css';
import ConfirmationModal from '@/components/confirmation-modal';
import EditPhoto from './edit-propertyphoto';

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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const refreshPhotos = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        refreshPhotos();
    }, [refreshPhotos]);

    useEffect(() => {
        if (location.state && (location.state.fromEdit || location.state.fromUpload)) {
            refreshPhotos();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, refreshPhotos]);

    const handleEditImage = (e: React.MouseEvent, imageId: number) => {
        e.stopPropagation();
        setSelectedImageId(imageId);
        setShowEditPopup(true);
    };

    const handleDeleteImage = (e: React.MouseEvent, imageId: number) => {
        e.stopPropagation();
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
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImageUrl(imageUrl);
    };

    const handleClosePopup = () => {
        setSelectedImageUrl(null);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setSelectedImageId(null);
        refreshPhotos();
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
                </div>
            </div>
            <div className={styles.photoGridContainer}>
                <div className={styles.photoGrid}>
                    {images.map((image) => (
                        <div key={image.id} className={styles.photoItem} onClick={() => handleImageClick(image.imageUrl)}>
                            <div className={styles.imageWrapper}>
                                <img src={image.imageUrl} alt={image.imageName} className={styles.propertyImage} />
                                <div className={styles.editOverlay}>
                                    <button className={styles.iconButton} onClick={(e) => handleEditImage(e, image.id)}>
                                        <Edit size={24} />
                                    </button>
                                    <button className={styles.iconButton} onClick={(e) => handleDeleteImage(e, image.id)}>
                                        <Trash2 size={24} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.imageInfo}>
                                <p className={styles.spaceName}>{image.spaceType.space.name}</p>
                                <p className={styles.spaceType}>{image.spaceType.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedImageUrl && (
                <div className={styles.popupOverlay} onClick={handleClosePopup}>
                    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImageUrl} alt="Selected property" className={styles.popupImage} />
                        <button className={styles.closeButton} onClick={handleClosePopup}>
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
            {showEditPopup && (
                <div className={styles.editPopupOverlay}>
                    <div className={styles.editPopupContent}>
                        <EditPhoto
                            propertyId={id}
                            imageId={selectedImageId?.toString()}
                            onClose={handleCloseEditPopup}
                        />
                    </div>
                </div>
            )}
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
