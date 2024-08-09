import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import fraxionedLogo from '../../assets/images/fraxioned_logo.png';
import logo from '../../assets/Fraxioned-icon.png';
import {
    FaCalendar, FaPlane, FaUser, FaFile,
    FaUserTag, FaChartBar, FaGavel, FaBars
} from 'react-icons/fa';
import styles from './Sidepanel.module.css';

interface MenuItem {
    icon: React.ReactElement;
    label: string;
    path: string;
    disabled: boolean;
}

interface SidePanelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const menuItems: MenuItem[] = [
    { icon: <FaCalendar />, label: 'Bookings', path: '/admin/bookings', disabled: false },
    { icon: <FaPlane />, label: 'Holidays', path: '/admin/holidays', disabled: false }, 
    { icon: <FaUser />, label: 'User', path: '/user', disabled: true },
    { icon: <FaFile />, label: 'Documents', path: '/documents', disabled: true },
    { icon: <FaUserTag />, label: 'Role', path: '/role', disabled: true },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports', disabled: true },
    { icon: <FaGavel />, label: 'Rules', path: '/rules', disabled: true }
];

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();

    const handleItemClick = (e: React.MouseEvent, disabled: boolean) => {
        if (disabled) {
            e.preventDefault();
        }
    };

    const handleLogoClick = () => {
        toggleSidebar();
    };

    return (
        <nav className={`${styles.sidePanel} ${isOpen ? styles.open : styles.closed}`}>
            <div className={styles.logoContainer}>
                {isOpen ? (
                    <img src={fraxionedLogo} alt="Fraxioned Owners' Portal" className={styles.logo} />
                ) : (
                    <img
                        src={logo}
                        alt="Fraxioned Owners' Portal"
                        className={styles.logotwo}
                        onClick={handleLogoClick}
                        style={{ cursor: 'pointer' }}
                    />
                )}

                <button className={styles.toggleButton} onClick={toggleSidebar}>
                    <FaBars />
                </button>
            </div>
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index} className={styles.menuItem}>
                        <Link
                            to={item.path}
                            className={`${styles.menuLink} ${location.pathname === item.path ? styles.active : ''} ${item.disabled ? styles.disabled : ''}`}
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