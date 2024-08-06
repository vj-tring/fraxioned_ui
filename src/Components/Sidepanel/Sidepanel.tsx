import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaCalendar, FaInbox, FaFileAlt, FaComments, FaUsers,
    FaStar, FaChartBar, FaUser
} from 'react-icons/fa';
import styles from './Sidepanel.module.css';

interface MenuItem {
    icon: React.ReactElement;
    label: string;
    path: string;
}

const menuItems: MenuItem[] = [
    { icon: <FaCalendar />, label: 'Bookings', path: '/admin/bookings' },
    { icon: <FaInbox />, label: 'Inbox', path: '/inbox' },
    { icon: <FaFileAlt />, label: 'Quotes', path: '/quotes' },
    { icon: <FaComments />, label: 'Inquiries', path: '/inquiries' },
    { icon: <FaUsers />, label: 'Contacts', path: '/contacts' },
    { icon: <FaStar />, label: 'Reviews', path: '/reviews' },
    { icon: <FaChartBar />, label: 'Reports', path: '/reports' },
    { icon: <FaUser />, label: 'PM', path: '/pm' }
];

const SidePanel: React.FC = () => {
    return (
        <nav className={styles.sidePanel}>
            <ul className={styles.menu}>
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <li className={styles.menuItem}>
                            <Link to={item.path} className={styles.menuLink}>
                                <span className={styles.icon}>{item.icon}</span>
                                <span className={styles.label}>{item.label}</span>
                            </Link>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        </nav>
    );
};

export default SidePanel;