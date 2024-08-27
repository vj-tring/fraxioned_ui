import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './propertysidepanel.module.css'
import { FaInfoCircle, FaConciergeBell, FaMapMarkerAlt, FaImages, FaList, FaChevronDown, FaFile } from 'react-icons/fa';
import { getPropertyById } from '@/api';

interface PropertySidePanelProps {
    isOpen: boolean;
}

const PropertySidePanel: React.FC<PropertySidePanelProps> = ({ isOpen }) => {
    const { id } = useParams<{ id: string }>();
    const [propertyName, setPropertyName] = useState('');

    useEffect(() => {
        const fetchPropertyName = async () => {
            try {
                const response = await getPropertyById(Number(id));
                setPropertyName(response.data.propertyName);
            } catch (err) {
                console.error('Error fetching property name:', err);
            }
        };

        fetchPropertyName();
    }, [id]);

    const menuItems = [
        { icon: <FaInfoCircle />, label: 'General Info', path: `/admin/property/${id}`, disabled: false },
        { icon: <FaMapMarkerAlt />, label: 'Location', path: `/admin/property/${id}/location`, disabled: false },
        { icon: <FaList />, label: 'Rules', path: `/admin/property/${id}/rules`, disabled: false },
        { icon: <FaConciergeBell />, label: 'Amenities', path: `/admin/property/${id}/amenities`, disabled: true },
        { icon: <FaImages />, label: 'Photos', path: `/admin/property/${id}/photos`, disabled: true },
        { icon: <FaFile />, label: 'Documents', path: `/admin/property/${id}/documents`, disabled: true },

    ];

    return (
        <nav className={`${styles.propertyPanel} ${isOpen ? styles.open : ''}`}>
            <div className={styles.propertyDropdown}>
                <span className={styles.propertyNames} >{propertyName}</span>
                <FaChevronDown className={styles.dropdownIcon} />
            </div>
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index} className={styles.menuItem}>
                        <Link to={item.path} className={styles.menuLink}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default PropertySidePanel;