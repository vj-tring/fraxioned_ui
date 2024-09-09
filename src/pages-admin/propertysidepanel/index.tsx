import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './propertysidepanel.module.css'
import { FaInfoCircle, FaConciergeBell, FaMapMarkerAlt, FaImages, FaList, FaChevronDown, FaFile } from 'react-icons/fa';
import { getPropertyById, getProperties } from '@/api';

interface PropertySidePanelProps {
    isOpen: boolean;
}

interface Property {
    id: number;
    propertyName: string;
}

const PropertySidePanel: React.FC<PropertySidePanelProps> = ({ isOpen }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                setProperties(response.data);
            } catch (err) {
                console.error('Error fetching properties:', err);
            }
        };

        fetchProperties();
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPropertyDetails = async () => {
                try {
                    const response = await getPropertyById(Number(id));
                    setSelectedProperty(response.data);
                } catch (err) {
                    console.error('Error fetching property details:', err);
                }
            };

            fetchPropertyDetails();
        }
    }, [id]);

    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
        setIsDropdownOpen(false);
        navigate(`/admin/property/${property.id}`);
    };

    const menuItems = [
        { icon: <FaInfoCircle />, label: 'General Info', path: `/admin/property/${id}`, enabled: true },
        { icon: <FaList />, label: 'Rules', path: `/admin/property/${id}/rules`, enabled: true },
        { icon: <FaConciergeBell />, label: 'Amenities', path: `/admin/property/${id}/amenities`, enabled: true },
        { icon: <FaImages />, label: 'Photos', path: `/admin/property/${id}/photos`, enabled: true },
        { icon: <FaMapMarkerAlt />, label: 'Location', path: `/admin/property/${id}/location`, enabled: false },
        { icon: <FaFile />, label: 'Documents', path: `/admin/property/${id}/documents`, enabled: false },
    ];

    return (
        <nav className={`${styles.propertyPanel} ${isOpen ? styles.open : ''}`}>
            <div
                className={`${styles.propertyDropdown} ${isDropdownOpen ? styles.active : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <span className={styles.propertyNames}>
                    {selectedProperty ? selectedProperty.propertyName : 'Select a property'}
                </span>
                <FaChevronDown className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`} />
            </div>
            {isDropdownOpen && (
                <ul className={styles.propertyList}>
                    {properties.map((property) => (
                        <li
                            key={property.id}
                            onClick={() => handlePropertySelect(property)}
                            className={`${styles.propertyListItem} ${selectedProperty?.id === property.id ? styles.active : ''}`}
                        >
                            {property.propertyName}
                        </li>
                    ))}
                </ul>
            )}
            {selectedProperty && (
                <ul className={styles.menu}>
                    {menuItems.map((item, index) => (
                        <li key={index} className={`${styles.menuItem} ${location.pathname === item.path ? styles.active : ''}`}>
                            <Link
                                to={item.enabled ? item.path : '#'}
                                className={`${styles.menuLink} ${!item.enabled ? styles.disabled : ''}`}
                                onClick={(e) => !item.enabled && e.preventDefault()}
                            >
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default PropertySidePanel;