import React from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './propertysidepanel.module.css'
import { FaInfoCircle, FaConciergeBell, FaAlignLeft, FaMapMarkerAlt, FaImages } from 'react-icons/fa';

interface PropertySidePanelProps {
    isOpen: boolean;
}

const PropertySidePanel: React.FC<PropertySidePanelProps> = ({ isOpen }) => {
    const { id } = useParams<{ id: string }>();

    const menuItems = [
        { icon: <FaInfoCircle />, label: 'General Info', path: `/admin/property/${id}` },
        { icon: <FaConciergeBell />, label: 'Amenities', path: `/admin/property/${id}/amenities` },
        { icon: <FaAlignLeft />, label: 'Description', path: `/admin/property/${id}/description` },
        { icon: <FaMapMarkerAlt />, label: 'Location', path: `/admin/property/${id}/location` },
        { icon: <FaImages />, label: 'Photos', path: `/admin/property/${id}/photos` },
    ];

    return (
        <nav className={`${styles.propertyPanel} ${isOpen ? styles.open : ''}`}>
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