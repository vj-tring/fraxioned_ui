import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './PropertyAmenities.module.css';
import { amenitiesapi, getAmenitiesById } from '@/api';
import NewAmenityForm from './new-amenity';

interface Amenity {
  id: number;
  amenityName: string;
  amenityType: string;
}

const PropertyAmenities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [amenities, setAmenities] = useState<{ [key: string]: Amenity[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [showNewAmenityForm, setShowNewAmenityForm] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  useEffect(() => {
    if (id) {
      fetchSelectedAmenities(Number(id));
    }
  }, [id]);

  const fetchAmenities = async () => {
    try {
      const response = await amenitiesapi();
      const groupedAmenities = groupAmenitiesByType(response.data.data);
      setAmenities(groupedAmenities);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch amenities. Please try again later.');
      setLoading(false);
    }
  };

  const fetchSelectedAmenities = async (propertyId: number) => {
    try {
      const response = await getAmenitiesById(propertyId);
      const selected = response.data.data.map((item: any) => item.amenity.id);
      setSelectedAmenities(selected);
    } catch (err) {
      setError('Failed to fetch selected amenities for this property.');
    }
  };

  const groupAmenitiesByType = (data: Amenity[]) => {
    return data.reduce((acc, amenity) => {
      if (!acc[amenity.amenityType]) {
        acc[amenity.amenityType] = [];
      }
      acc[amenity.amenityType].push(amenity);
      return acc;
    }, {} as { [key: string]: Amenity[] });
  };

  const handleCheckboxChange = (amenityId: number) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  // const handleUpdate = () => {
  //   console.log('Selected amenities:', selectedAmenities);
  // };

  const handleAddNewAmenity = () => {
    setShowNewAmenityForm(true);
  };

  const handleCloseNewAmenityForm = () => {
    setShowNewAmenityForm(false);
  };

  const handleNewAmenityAdded = () => {
    fetchAmenities();
    setShowNewAmenityForm(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Property Amenities</h1>
          <button className={styles.addButton} onClick={handleAddNewAmenity}>
            Add
          </button>
        </div>
        <div className={styles.amenitiesGrid}>
          {Object.entries(amenities).map(([type, amenitiesList]) => (
            <div key={type} className={styles.amenityGroup}>
              <h2 className={styles.amenityType}>{type}</h2>
              {amenitiesList.map((amenity) => (
                <label key={amenity.id} className={styles.amenityItem}>
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={() => handleCheckboxChange(amenity.id)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkmark}></span>
                  {amenity.amenityName}
                </label>
              ))}
            </div>
          ))}
        </div>
        {/* <button className={styles.updateButton} onClick={handleUpdate}>
          Update
        </button> */}
      </div>
      {showNewAmenityForm && (
        <NewAmenityForm
          onClose={handleCloseNewAmenityForm}
          onAmenityAdded={handleNewAmenityAdded}
        />
      )}
    </div>
  );
};

export default PropertyAmenities;
