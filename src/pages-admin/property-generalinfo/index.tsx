import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, getProperrtDetailsbyId } from '@/api';
import EditButton from '@/components/edit';
import styles from './property-generalinfo.module.css';
import imageone from '../../assests/bear-lake-bluffs.jpg';
import imagetwo from '../../assests/crown-jewel.jpg';
import imagethree from '../../assests/lake-escape.jpg';
import Loader from '@/components/loader';
import pinImage from '../../assets/images/pin.jpg';

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
  propertyRemainingShare: number;
  latitude: number;
  longitude: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface PropertyDetails {
  noOfBedrooms: number;
  noOfBathrooms: number;
  squareFootage: string;
  cleaningFee: number;
}

const PropertyGeneralInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const images = [imageone, imagetwo, imagethree];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse, detailsResponse] = await Promise.all([
          getPropertyById(Number(id)),
          getProperrtDetailsbyId(Number(id))
        ]);
        setPropertyData(propertyResponse.data);
        setPropertyDetails({
          noOfBedrooms: detailsResponse.data.noOfBedrooms,
          noOfBathrooms: detailsResponse.data.noOfBathrooms,
          squareFootage: detailsResponse.data.squareFootage,
          cleaningFee: detailsResponse.data.cleaningFee
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to fetch property data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/property/${id}/edit`);
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!propertyData || !propertyDetails) return <div className={styles.noData}>No property data found.</div>;

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>General Information</h2>
          <EditButton onClick={handleEdit} />
        </div>
        <div className={styles.propertyCard}>
          <div className={styles.imageContainer}>
            <img src={randomImage} alt={propertyData.propertyName} className={styles.propertyImage} />
            <div className={styles.exclusiveTag}>
              <img src={pinImage} alt="Pin" className={styles.pinIcon} />
              <span>{propertyData.isExclusive ? 'Exclusive' : 'Collective'}</span>
            </div>
          </div>
          <div className={styles.infoContainer}>
            <h3 className={styles.propertyName}>{propertyData.propertyName}</h3>
            <div className={styles.infoBlock}>
              <div className={styles.infoColumns}>
                <div className={styles.addressColumn}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Address:</span>
                    <span className={styles.infoValue}>
                      {`${propertyData.address}, ${propertyData.city}, ${propertyData.state}, ${propertyData.country}, ${propertyData.zipcode}`}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Square Footage:</span>
                    <span className={styles.infoValue}>{propertyDetails.squareFootage} sq ft</span>
                  </div>
                </div>
                <div className={styles.detailsColumn}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Property Share:</span>
                    <span className={styles.infoValue}>{propertyData.propertyShare}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Bedrooms:</span>
                    <span className={styles.infoValue}>{propertyDetails.noOfBedrooms}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Bathrooms:</span>
                    <span className={styles.infoValue}>{propertyDetails.noOfBathrooms}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Share left:</span>
                    <span className={styles.infoValue}>{propertyData.propertyRemainingShare}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Cleaning fee:</span>
                    <span className={styles.infoValue}>{propertyDetails.cleaningFee}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.infoBlock}>
              <h4 className={styles.descriptionTitle}>Description</h4>
              <p className={styles.description}>{propertyData.houseDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyGeneralInfo;