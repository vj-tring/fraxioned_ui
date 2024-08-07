import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import fraxionedLogo from '../../assets/images/fraxioned_logo.png'
import {
    FaCalendar, FaPlane, FaUser, FaFile,
    FaUserTag, FaChartBar, FaGavel
} from 'react-icons/fa';

import styles from './Sidepanel.module.css';

interface MenuItem {
    icon: React.ReactElement;
    label: string;
    path: string;
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

const SidePanel: React.FC = () => {
    const location = useLocation();
    return (
        <nav className={styles.sidePanel}>
            <div className={styles.logoContainer}>
                <img src={fraxionedLogo} alt="BB - Owners" className={styles.logo} />
            </div>
            <hr className={styles.hr} />
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index} className={styles.menuItem}>
                        <Link to={item.path} className={`${styles.menuLink} ${location.pathname === item.path ? styles.active : ''}`}>
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SidePanel;