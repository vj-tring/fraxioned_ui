import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip } from "@mui/material";
import { getUserProperties } from "@/api";
import styles from "./propertyTab.module.css";
import { Image as ImageIcon } from "lucide-react";
import imageone from '../../../../../assests/bear-lake-bluffs.jpg';
import imagetwo from '../../../../../assests/crown-jewel.jpg';
import imagethree from '../../../../../assests/lake-escape.jpg';

interface UserProperty {
  id: number;
  noOfShare: number;
  acquisitionDate: string;
  isActive: number;
  year: number;
}

interface PropertyResponse {
  propertyId: number;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  isActive: boolean;
  userProperties: UserProperty[];
  propertyShare: number;
}

interface PropertyTabProps {
  userId: number;
}

const PropertyTab: React.FC<PropertyTabProps> = ({ userId }) => {
  const [propertyData, setPropertyData] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const images = [imageone, imagetwo, imagethree];

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await getUserProperties(userId);
        setPropertyData(response.data);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError("Failed to fetch property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [userId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className={styles.propertyTabContainer}>
      <div className={styles.cardGrid}>
        {propertyData.map((prop: PropertyResponse, index: number) => {
          const userProperty = prop.userProperties[0]; 
          if (!userProperty) return null;

          const shareFraction = `${userProperty.noOfShare}/${prop.propertyShare}`;
          const randomImage = images[index % images.length];

          return (
            <Card key={index} className={styles.propertyCard}>
              <CardContent className={styles.cardContent}>
                <div className={styles.imageContainer}>
                  {randomImage ? (
                    <img src={randomImage} alt={prop.propertyName} className={styles.propertyImage} />
                  ) : (
                    <div className={styles.noImage}>
                      <ImageIcon size={48} />
                      <Typography variant="body2">No image available</Typography>
                    </div>
                  )}
                </div>
                <div className={styles.propertyInfo}>
                  <Typography variant="h6" className={styles.propertyName}>
                    {prop.propertyName}
                  </Typography>
                  <Chip
                    label={prop.isActive ? "Active" : "Inactive"}
                    color={prop.isActive ? "success" : "error"}
                    size="small"
                    className={styles.statusChip}
                  />
                  <div className={styles.detailsContainer}>
                    <div className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Address
                      </Typography>
                      <Typography variant="body2" className={styles.detailValue}>
                        {prop.address}
                      </Typography>
                    </div>
                    <div className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Location
                      </Typography>
                      <Typography variant="body2" className={styles.detailValue}>
                        {`${prop.city}, ${prop.state}, ${prop.country} ${prop.zipcode}`}
                      </Typography>
                    </div>
                    <div className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Shares
                      </Typography>
                      <Typography variant="body2" className={styles.detailValue}>
                        {shareFraction}
                      </Typography>
                    </div>
                    <div className={styles.detailItem}>
                      <Typography variant="subtitle2" className={styles.detailLabel}>
                        Acquired
                      </Typography>
                      <Typography variant="body2" className={styles.detailValue}>
                        {new Date(userProperty.acquisitionDate).toLocaleDateString()}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyTab;