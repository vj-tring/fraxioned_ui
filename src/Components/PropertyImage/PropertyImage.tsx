import React from 'react';
import styles from './PropertyImage.module.css';

interface PropertyType {
    name: string;
    color: string;
}

const propertyTypes: PropertyType[] = [
    { name: 'Bear Lake Bluffs', color: '#FF9999' },
    { name: 'Blue Bear Lake', color: '#9999FF' },
    { name: 'Crown Jewel', color: '#99FF99' },
    { name: 'Huckleberry House', color: '#FFB266' },
    { name: 'Lake Escape', color: '#FF6666' },
    { name: 'Modern Lagoon', color: '#FF99FF' },
    { name: 'Paradise Shores', color: '#999999' },
    { name: 'Swan Creek', color: '#66FFB2' },
];

const PropertyImage: React.FC = () => {
    return (
        <div className={styles.propertyImageContainer}>
            {propertyTypes.map((property, index) => (
                <div key={index} className={styles.propertyType}>
                    <div
                        className={styles.colorBox}
                        style={{ backgroundColor: property.color }}
                    ></div>
                    <span className={styles.propertyName}>{property.name}</span>
                </div>
            ))}
        </div>
    );
};

export default PropertyImage;