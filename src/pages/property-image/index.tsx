import React, { useState, useEffect } from 'react';
import styles from './property-image.module.css'
import { getProperties } from '@/api';

interface PropertyType {
    id: number | string;
    propertyName: string;
    color: string;
}

interface PropertyImageProps {
    onPropertySelect: (propertyId: number | string) => void;
    selectedPropertyId: number | string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ onPropertySelect, selectedPropertyId }) => {
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

    useEffect(() => {
        const colors = [
            '#FF9999', '#9999FF', '#99FF99', '#FFB266', '#FF6666', '#FF99FF', '#999999', '#66FFB2', '#FFA07A', '#20B2AA', '#99FF99', '#FFB266'
        ];

        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                const fetchedProperties = response.data.map((property: any, index: number) => ({
                    id: property.id,
                    propertyName: property.propertyName,
                    color: colors[index % colors.length]
                }));

                const allHolidaysProperty: PropertyType = {
                    id: 'all',
                    propertyName: 'All Holidays',
                    color: '#4CAF50'
                };

                setPropertyTypes([allHolidaysProperty, ...fetchedProperties]);
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
        const intervalId = setInterval(fetchProperties, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={styles.propertyImageContainer}>
            {propertyTypes.map((property) => (
                <div
                    key={property.id}
                    className={`${styles.propertyType} ${selectedPropertyId === property.id ? styles.selected : ''}`}
                    onClick={() => onPropertySelect(property.id)}
                >
                    <div
                        className={styles.colorBox}
                        style={{ backgroundColor: property.color }}
                    ></div>
                    <span className={styles.propertyName}>{property.propertyName}</span>
                </div>
            ))}
        </div>
    );
};

export default PropertyImage;
