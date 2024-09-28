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
      {propertyData.map((prop: PropertyResponse, index: number) => {
        const userProperty = prop.userProperties[0];
        if (!userProperty) return null;

        const shareFraction = `${userProperty.noOfShare}/${prop.propertyShare}`;
        const randomImage = images[index % images.length];

        return (
          <Card key={index} className={styles.propertyTile}>
            <div className={styles.imageWrapper}>
              {randomImage ? (
                <img src={randomImage} alt={prop.propertyName} className={styles.propertyImage} />
              ) : (
                <div className={styles.noImage}>
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
            <CardContent className={styles.propertyInfo}>
              <div className={styles.headerRow}>
                <Typography variant="h6" className={styles.propertyName}>
                  {prop.propertyName}
                </Typography>
                {/* <Chip
                  label={prop.isActive ? "Active" : "Inactive"}
                  color={prop.isActive ? "success" : "error"}
                  size="small"
                  className={styles.statusChip}
                /> */}
              </div>
              <Typography variant="body2" className={styles.address}>
                {prop.address}, {prop.city}
              </Typography>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <Typography variant="caption" className={styles.detailLabel}>
                    Shares
                  </Typography>
                  <Typography variant="body2" className={styles.detailValue}>
                    {shareFraction}
                  </Typography>
                </div>
                <div className={styles.detailItem}>
                  <Typography variant="caption" className={styles.detailLabel}>
                    Acquired
                  </Typography>
                  <Typography variant="body2" className={styles.detailValue}>
                    {new Date(userProperty.acquisitionDate).toLocaleDateString()}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PropertyTab;