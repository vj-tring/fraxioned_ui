import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { propertyImageapi } from '@/api';
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
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchImages = async () => {
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

        fetchImages();
    }, [id]);

    return (
        <div className={styles.propertyPhotosContainer}>
            <div className={styles.photoGrid}>
                {images.map((image) => (
                    <div key={image.id} className={styles.photoItem}>
                        <img src={image.imageUrl} alt={image.imageName} className={styles.propertyImage} />
                        <div className={styles.imageInfo}>
                            <p className={styles.spaceName}>{image.spaceType.space.name}</p>
                            <p className={styles.spaceType}>{image.spaceType.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyPhotos;
