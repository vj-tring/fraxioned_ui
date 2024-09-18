import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
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
  user: {
    id: number;
    firstName: string;
    lastName: string;
    isActive: number;
    lastLoginTime: string;
  };
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
  Id: number;
}

const PropertyTab: React.FC<PropertyTabProps> = ({ Id }) => {
  const [propertyData, setPropertyData] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const images = [imageone, imagetwo, imagethree];

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await getUserProperties(Id);
        setPropertyData(response.data);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError("Failed to fetch property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [Id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div className={styles.propertyTabContainer}>
      {propertyData.length > 0 &&
        propertyData.map((prop: PropertyResponse, index: number) => {
          const userProperty = prop.userProperties.find(
            (userProp) => userProp.user.id === Id
          );

          if (!userProperty) return null;

          const shareFraction = `${userProperty.noOfShare}/${prop.propertyShare}`;
          const randomImage = images[index % images.length];

          return (
            <Box key={index} className={styles.propertyWrapper}>
              <Card className={styles.propertyCard}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.propertyInfo}>
                    <Typography variant="h5" className={styles.propertyName}>
                      {prop.propertyName}
                    </Typography>
                    <Chip
                      label={prop.isActive ? "Active" : "Inactive"}
                      color={prop.isActive ? "success" : "error"}
                      className={styles.statusChip}
                    />
                    <Box className={styles.detailsContainer}>
                      <Typography variant="subtitle1" className={styles.detailLabel}>
                        Address
                      </Typography>
                      <Typography variant="body1" className={styles.detailValue}>
                        {prop.address}
                      </Typography>

                      <Typography variant="subtitle1" className={styles.detailLabel}>
                        Location
                      </Typography>
                      <Typography variant="body1" className={styles.detailValue}>
                        {`${prop.city}, ${prop.state}, ${prop.country} ${prop.zipcode}`}
                      </Typography>

                      <Typography variant="subtitle1" className={styles.detailLabel}>
                        Number of Shares
                      </Typography>
                      <Typography variant="body1" className={styles.detailValue}>
                        {shareFraction}
                      </Typography>

                      <Typography variant="subtitle1" className={styles.detailLabel}>
                        Acquisition Date
                      </Typography>
                      <Typography variant="body1" className={styles.detailValue}>
                        {new Date(userProperty.acquisitionDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </div>
                  <div className={styles.imageContainer}>
                    {randomImage ? (
                      <img src={randomImage} alt={prop.propertyName} className={styles.propertyImage} />
                    ) : (
                      <>
                        <ImageIcon size={48} />
                        <Typography variant="body2">No image available</Typography>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Box>
          );
        })}
    </div>
  );
};

export default PropertyTab;