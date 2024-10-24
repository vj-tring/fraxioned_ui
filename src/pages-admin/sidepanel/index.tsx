import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import fraxionedLogo from '../../assets/images/fraxioned.png';
import logo from '../../assets/images/fraxionedpng.png'
import {
    FaCalendar, FaPlane, FaUser, FaFile, FaChartBar, FaBars, FaHome, FaConciergeBell,
    FaQuestion
} from 'react-icons/fa';
import { IoIosImages } from "react-icons/io";
import styles from './sidepanel.module.css'
import { MenuItem, SidePanelProps } from './sidepanel.types';


const menuItems: MenuItem[] = [
    { icon: <FaCalendar />, label: 'Bookings', path: '/admin/bookings', disabled: false },
    { icon: <FaPlane />, label: 'Holidays', path: '/admin/holidays', disabled: false },
    { icon: <FaHome />, label: 'Property', path: '/admin/property', disabled: false },
    { icon: <FaUser />, label: 'User', path: '/admin/user', disabled: false },
    { icon: <IoIosImages />, label: 'Spaces', path: '/admin/spaces', disabled: false },
    { icon: <FaConciergeBell />, label: 'Amenity', path: '/admin/amenity', disabled: false },
    { icon: <FaFile />, label: 'Documents', path: '/admin/documents', disabled: false },
    { icon: <FaChartBar />, label: 'Reports', path: '/admin/reports', disabled: false },
    { icon: <FaQuestion />, label: 'FAQ', path: '/admin/Faq', disabled: false },
];

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const handleItemClick = (e: React.MouseEvent, disabled: boolean) => {
        if (disabled) {
            e.preventDefault();
        }
    };

    const isActive = (path: string) => {
        if (path === '/admin/bookings') {
            return location.pathname.startsWith('/admin/bookings') || location.pathname === '/admin/bookings-grid';
        }
        if (path === '/admin/property') {
            return location.pathname.startsWith('/admin/property');
        }
        if (path === '/admin/user') {
            return location.pathname.startsWith('/admin/user');
        }
        if (path === '/admin/reports') {
            return location.pathname.startsWith('/admin/reports');
        }
        if (path === 'admin/documents') {
            return location.pathname.startsWith('/admin/documents');
        }

        return location.pathname === path;
    };

    return (
        <nav className={`${styles.sidePanel} ${isOpen ? styles.open : styles.closed}`}>
            <div className={styles.logoContainer}>
                {isOpen ? (
                    <>
                        <img src={fraxionedLogo} alt="Fraxioned Owners' Portal" className={styles.logo} loading="lazy" />
                        <button className={styles.toggleButton} onClick={toggleSidebar}>
                            <FaBars />
                        </button>
                    </>
                ) : (
                    <img
                        src={logo}
                        alt="Fraxioned Owners' Portal"
                        className={styles.logotwo}
                        onClick={toggleSidebar}
                        loading="lazy"
                    />
                )}
            </div>
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index} className={styles.menuItem}>
                        <Link
                            to={item.path}
                            className={`${styles.menuLink} ${isActive(item.path) ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
                            onClick={(e) => handleItemClick(e, item.disabled)}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            {isOpen && <span className={styles.label}>{item.label}</span>}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SidePanel;