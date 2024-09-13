import React, { useEffect, useState } from "react";
import { TextField, Grid, Typography, Paper } from "@mui/material";
import styles from "./propertyTab.module.css";
import { getUserProperties } from "@/api";
import { style } from "@mui/system/Stack/createStack";


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
    <Paper elevation={3} className={styles.propertyPaper}>
      {propertyData.length > 0 &&
        propertyData.map((prop: PropertyResponse, index: number) => {
          
          const userProperty = prop.userProperties.find(
            (userProp) => userProp.user.id === Id
          );

          
          if (!userProperty) return null;

          return (
            <React.Fragment key={index}>
              <Typography variant="h6" className={styles.title}>Property Details</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Property Name"
                    value={prop.propertyName}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    value={prop.address}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    value={prop.city}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="State"
                    value={prop.state}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Country"
                    value={prop.country}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Zipcode"
                    value={prop.zipcode}
                    fullWidth
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Shares"
                      value={userProperty.noOfShare}
                      fullWidth
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Acquisition Date"
                      value={userProperty.acquisitionDate}
                      fullWidth
                      variant="outlined"
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
              </Grid>

          

            </React.Fragment>
          );
        })}
    </Paper>
  );
};

export default PropertyTab;
