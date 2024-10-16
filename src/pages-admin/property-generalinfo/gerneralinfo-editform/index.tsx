import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector, useDispatch } from "react-redux";
import { updaterulesapi, getProperrtDetailsbyId } from "@/api";
import { fetchPropertyById } from "@/store/slice/auth/propertiesSlice";
import Loader from "@/components/loader";
import styles from "./EditPropertyForm.module.css";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";

interface PropertyDetails {
  noOfBedrooms: number;
  noOfBathrooms: number;
  squareFootage: string;
  cleaningFee: number;
  noOfGuestsAllowed: number;
  noOfBathroomsFull: number;
  noOfBathroomsHalf: number;
  checkInTime: number;
  checkOutTime: number;
  noOfPetsAllowed: number;
  petPolicy: string;
  feePerPet: number;
  peakSeasonStartDate: string;
  peakSeasonEndDate: string;
  peakSeasonAllottedNights: number;
  offSeasonAllottedNights: number;
  peakSeasonAllottedHolidayNights: number;
  offSeasonAllottedHolidayNights: number;
  lastMinuteBookingAllottedNights: number;
  wifiNetwork: string;
}

const EditPropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const selectedProperty = useSelector((state: RootState) => state.property.selectedProperty);
  const status = useSelector((state: RootState) => state.property.status);
  const reduxError = useSelector((state: RootState) => state.property.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(Number(id)));
      fetchPropertyDetails();
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProperty) {
      setFormData(selectedProperty);
    }
  }, [selectedProperty]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await getProperrtDetailsbyId(Number(id));
      setPropertyDetails(response.data);
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError("Failed to fetch property details. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePropertyDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyDetails((prevDetails: any) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || userId < 1) {
      setError("Invalid user ID. Please log in again.");
      return;
    }
    try {
      const updatedPropertyData = {
        updatedBy: { id: userId },
        property: {
          id: Number(id),
          propertyName: formData.propertyName,
          ownerRezPropId: Number(formData.ownerRezPropId),
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipcode: Number(formData.zipcode),
          houseDescription: formData.houseDescription,
          isExclusive: formData.isExclusive,
          propertyShare: Number(formData.propertyShare),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          isActive: formData.isActive,
          displayOrder: Number(formData.displayOrder),
          mailBannerFile: null,
          coverImageFile: null
        },
        noOfBedrooms: Number(propertyDetails?.noOfBedrooms),
        noOfBathrooms: Number(propertyDetails?.noOfBathrooms),
        squareFootage: propertyDetails?.squareFootage,
        cleaningFee: Number(propertyDetails?.cleaningFee),
        noOfGuestsAllowed: Number(propertyDetails?.noOfGuestsAllowed),
        noOfBathroomsFull: Number(propertyDetails?.noOfBathroomsFull),
        noOfBathroomsHalf: Number(propertyDetails?.noOfBathroomsHalf),
        checkInTime: Number(propertyDetails?.checkInTime),
        checkOutTime: Number(propertyDetails?.checkOutTime),
        noOfPetsAllowed: Number(propertyDetails?.noOfPetsAllowed),
        petPolicy: propertyDetails?.petPolicy,
        feePerPet: Number(propertyDetails?.feePerPet),
        peakSeasonStartDate: propertyDetails?.peakSeasonStartDate,
        peakSeasonEndDate: propertyDetails?.peakSeasonEndDate,
        peakSeasonAllottedNights: Number(propertyDetails?.peakSeasonAllottedNights),
        offSeasonAllottedNights: Number(propertyDetails?.offSeasonAllottedNights),
        peakSeasonAllottedHolidayNights: Number(propertyDetails?.peakSeasonAllottedHolidayNights),
        offSeasonAllottedHolidayNights: Number(propertyDetails?.offSeasonAllottedHolidayNights),
        lastMinuteBookingAllottedNights: Number(propertyDetails?.lastMinuteBookingAllottedNights),
        wifiNetwork: propertyDetails?.wifiNetwork
      };

      await updaterulesapi(Number(id), updatedPropertyData);
      navigate(`/admin/property/${id}`);
    } catch (err) {
      console.error("Error updating property:", err);
      setError("Failed to update property. Please try again.");
    }
  };

  if (status === 'loading') return <Loader />;
  if (error) return <div>{error}</div>;
  if (!formData || !propertyDetails) return <div>No property data found.</div>;

  return (
    <div className={styles.formContainer}>
      <Paper elevation={3} className={styles.formPaper}>
        <div className={styles.staticHeader}>
          <Box className={styles.formHeader}>
            <EditIcon className={styles.headerIcon} />
            <Typography variant="h4" className={styles.formTitle}>
              Edit Property
            </Typography>
          </Box>
        </div>
        <div className={styles.scrollableContent}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Property Name"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="OwnerRez Property ID"
                  name="ownerRezPropId"
                  type="number"
                  value={formData.ownerRezPropId}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Zipcode"
                  name="zipcode"
                  type="number"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Property Share"
                  name="propertyShare"
                  type="number"
                  value={formData.propertyShare}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="House Description"
                  name="houseDescription"
                  value={formData.houseDescription}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Display Order"
                  name="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Number of Bedrooms"
                  name="noOfBedrooms"
                  type="number"
                  value={propertyDetails.noOfBedrooms}
                  onChange={handlePropertyDetailsChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Number of Bathrooms"
                  name="noOfBathrooms"
                  type="number"
                  value={propertyDetails.noOfBathrooms}
                  onChange={handlePropertyDetailsChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Square Footage"
                  name="squareFootage"
                  value={propertyDetails.squareFootage}
                  onChange={handlePropertyDetailsChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Cleaning Fee"
                  name="cleaningFee"
                  type="number"
                  value={propertyDetails.cleaningFee}
                  onChange={handlePropertyDetailsChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isExclusive}
                      onChange={handleInputChange}
                      name="isExclusive"
                      color="primary"
                    />
                  }
                  label="Is Exclusive"
                  className={styles.checkbox}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      color="primary"
                      sx={{
                        fontSize: 'small'
                      }}
                    />
                  }
                  label="Is Active"
                  className={styles.checkbox}
                />
              </Grid>
            </Grid>
            {error && (
              <Typography color="error" className={styles.error}>
                {error}
              </Typography>
            )}
            <Box className={styles.buttonContainer}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/admin/property/${id}`)}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.updateButton}
              >
                Update Property
              </Button>
            </Box>
          </form>
        </div>
      </Paper>
    </div>
  );
};

export default EditPropertyForm;