import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById } from '@/api';
import EditButton from '@/components/edit';
import styles from './property-generalinfo.module.css';

interface PropertyData {
  id: number;
  ownerRezPropId: number;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  houseDescription: string;
  isExclusive: boolean;
  propertyShare: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

const PropertyGeneralInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await getPropertyById(Number(id));
        setPropertyData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property details:', err);
        setError('Failed to fetch property details. Please try again.');
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/property/${id}/edit`);
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!propertyData) return <div>No property data found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>General Information</h2>
        <EditButton onClick={handleEdit} />
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Property Name:</span>
          <span className={styles.value}>{propertyData.propertyName}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>OwnerRez Property ID:</span>
          <span className={styles.value}>{propertyData.ownerRezPropId}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Address:</span>
          <span className={styles.value}>{propertyData.address}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>City:</span>
          <span className={styles.value}>{propertyData.city}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>State:</span>
          <span className={styles.value}>{propertyData.state}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Country:</span>
          <span className={styles.value}>{propertyData.country}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Zipcode:</span>
          <span className={styles.value}>{propertyData.zipcode}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Property Share:</span>
          <span className={styles.value}>{propertyData.propertyShare}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Is Exclusive:</span>
          <span className={styles.value}>{propertyData.isExclusive ? 'Yes' : 'No'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Is Active:</span>
          <span className={styles.value}>{propertyData.isActive ? 'Yes' : 'No'}</span>
        </div>
      </div>
      <div className={styles.description}>
        <h3>House Description</h3>
        <p>{propertyData.houseDescription}</p>
      </div>
    </div>
  );
};

export default PropertyGeneralInfo;