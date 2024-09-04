
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import EditButton from '@/components/edit';
import styles from './propertyamenities.module.css';
import EditAmenityForm from './edit-amenityform/index';

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditFormVisible, setEditFormVisible] = useState(false);

  const handleEdit = () => {
    setEditFormVisible(true);
  };

  const handleCloseEditForm = () => {
    setEditFormVisible(false);
  };

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Property Amenities</h2>
          <EditButton onClick={handleEdit} />
        </div>
        <div className={styles.amenitiesContainer}>
        </div>
      </div>
      {isEditFormVisible && <EditAmenityForm onClose={handleCloseEditForm} />}
    </div>
  );
};

export default PropertyAmenities;