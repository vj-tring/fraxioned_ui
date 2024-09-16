import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { getUserProperties } from "@/api";
import styles from "./PropertyTab.module.css";
import { Image } from "lucide-react";

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

          return (
            <Box key={index} className={styles.propertyWrapper}>
              <Card className={styles.propertyCard}>
                <CardContent>
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
                </CardContent>
              </Card>
              <Box className={styles.imageContainer}>
                <Image size={48} />
                <Typography variant="body2">No image available</Typography>
              </Box>
            </Box>
          );
        })}
    </div>
  );
};

export default PropertyTab;