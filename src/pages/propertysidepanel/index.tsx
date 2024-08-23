import React from 'react';
import styles from './propertysidepanel.module.css'
import { FaInfoCircle, FaConciergeBell, FaAlignLeft, FaMapMarkerAlt, FaImages } from 'react-icons/fa';

interface PropertySidePanelProps {
  isOpen: boolean;
}

const PropertySidePanel: React.FC<PropertySidePanelProps> = ({ isOpen }) => {
  const menuItems = [
    { icon: <FaInfoCircle />, label: 'General Info' },
    { icon: <FaConciergeBell />, label: 'Amenities' },
    { icon: <FaAlignLeft />, label: 'Description' },
    { icon: <FaMapMarkerAlt />, label: 'Location' },
    { icon: <FaImages />, label: 'Photos' },
  ];

  return (
    <nav className={`${styles.propertyPanel} ${isOpen ? styles.open : styles.closed}`}>
      <ul className={styles.menu}>
        {menuItems.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            <a href="#" className={styles.menuLink}>
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PropertySidePanel;