import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './propertysidepanel.module.css';
import { FaInfoCircle, FaConciergeBell, FaMapMarkerAlt, FaImages, FaList, FaChevronDown, FaFile, FaUser, FaBitcoin } from 'react-icons/fa';
import { MdAddPhotoAlternate } from "react-icons/md";
import { fetchProperties, fetchPropertyById } from '@/store/slice/auth/propertiesSlice';
import { RootState } from '@/store/reducers';
import { AppDispatch } from '@/store';

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
    const dispatch = useDispatch<AppDispatch>();
    const properties = useSelector((state: RootState) => state.property.properties);
    const selectedProperty = useSelector((state: RootState) => state.property.selectedProperty);
    const status = useSelector((state: RootState) => state.property.status);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProperties());
        }
    }, [status, dispatch]);

    useEffect(() => {
        if (id) {
            dispatch(fetchPropertyById(Number(id)));
        }
    }, [id, dispatch]);

    const handlePropertySelect = (property: Property) => {
        dispatch(fetchPropertyById(property.id));
        setIsDropdownOpen(false);
        navigate(`/admin/property/${property.id}`);
    };

    const menuItems = [
        { icon: <FaInfoCircle />, label: 'General Info', path: `/admin/property/${id}`, enabled: true },
        { icon: <FaList />, label: 'Rules', path: `/admin/property/${id}/rules`, enabled: true },
        { icon: <FaImages />, label: 'Photos', path: `/admin/property/${id}/photos`, enabled: true },
        { icon: <FaUser />, label: 'Users', path: `/admin/property/${id}/users`, enabled: true },
        { icon: <MdAddPhotoAlternate />, label: 'Rooms', path: `/admin/property/${id}/rooms`, enabled: true },
        { icon: <FaConciergeBell />, label: 'Amenities', path: `/admin/property/${id}/amenities`, enabled: true },
        { icon: <FaMapMarkerAlt />, label: 'Location', path: `/admin/property/${id}/location`, enabled: false },
        { icon: <FaBitcoin />, label: 'Codes', path: `/admin/property/${id}/codes`, enabled: true },
        { icon: <FaFile />, label: 'Documents', path: `/admin/property/${id}/documents`, enabled: true },
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
                                onClick={(e) => {
                                    if (!item.enabled) {
                                        e.preventDefault();
                                    } else if (item.label === 'Rules') {
                                        e.preventDefault();
                                        navigate(`/admin/property/${id}/rules`);
                                    }
                                }}
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




