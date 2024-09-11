import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyImageapi } from '@/api';
import { Edit } from 'lucide-react';
import styles from './propertyphoto.module.css';

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
    const { id } = useParams<{ id: string }>();

    const refreshPhotos = async () => {
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
        }
    };

    useEffect(() => {
        refreshPhotos();
    }, [id]);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    const handleEditImage = (imageId: number) => {
        // Implement edit functionality here
        console.log(`Editing image with id: ${imageId}`);
    };

    return (
        <div className={styles.propertyPhotosContainer}>
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
                                    <div className={styles.editOverlay} onClick={() => handleEditImage(image.id)}>
                                        <Edit size={24} />
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
        </div>
    );
};

export default PropertyPhotos;