import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import fraxionedLogo from '../../assets/images/fraxioned_logo.png';
import {
    FaCalendar, FaPlane, FaUser, FaFile,
    FaUserTag, FaChartBar, FaGavel, FaBars
} from 'react-icons/fa';
import styles from './Sidepanel.module.css';

interface MenuItem {
    icon: React.ReactElement;
    label: string;
    path: string;
}

interface SidePanelProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const menuItems: MenuItem[] = [
    { icon: <FaCalendar />, label: 'Bookings', path: '/admin/bookings' },
    { icon: <FaPlane />, label: 'Holidays', path: '/holidays' },
    { icon: <FaUser />, label: 'User', path: '/user' },
    { icon: <FaFile />, label: 'Documents', path: '/documents' },
    { icon: <FaUserTag />, label: 'Role', path: '/role' },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports' },
    { icon: <FaGavel />, label: 'Rules', path: '/rules' }
];

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();


    return (
        <nav className={`${styles.sidePanel} ${isOpen ? styles.open : styles.closed}`}>
            <div className={styles.logoContainer}>
                {isOpen && <img src={fraxionedLogo} alt="Fraxioned Owners' Portal" className={styles.logo} />}
                <button className={styles.toggleButton} onClick={toggleSidebar}>
                    <FaBars />
                </button>
            </div>
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index} className={styles.menuItem}>
                        <Link
                            to={item.path}
                            className={`${styles.menuLink} ${location.pathname === item.path ? styles.active : ''}`}
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