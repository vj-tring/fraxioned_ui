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

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!propertyData) return <div className={styles.noData}>No property data found.</div>;

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>General Information</h2>
          <EditButton onClick={handleEdit} />
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.column}>
            <InfoItem label="Property Name:" value={propertyData.propertyName} />
            <InfoItem label="OwnerRez Property ID:" value={propertyData.ownerRezPropId} />
            <InfoItem label="Address:" value={propertyData.address} />
            <InfoItem label="City:" value={propertyData.city} />
            <InfoItem label="State:" value={propertyData.state} />
          </div>
          <div className={styles.column}>
            <InfoItem label="Country:" value={propertyData.country} />
            <InfoItem label="Zipcode:" value={propertyData.zipcode} />
            <InfoItem label="Property Share:" value={`${propertyData.propertyShare}%`} />
            <InfoItem label="Is Exclusive:" value={propertyData.isExclusive ? 'Yes' : 'No'} />
            <InfoItem label="Is Active:" value={propertyData.isActive ? 'Yes' : 'No'} />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className={styles.infoItem}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);

export default PropertyGeneralInfo;
