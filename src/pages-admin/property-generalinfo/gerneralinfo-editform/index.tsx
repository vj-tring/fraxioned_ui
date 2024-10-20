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
import { fetchPropertyById, fetchPropertyDetailsById } from "@/store/slice/auth/propertiesSlice";
import { updatePropertyRules } from "@/store/slice/auth/property-detail";
import Loader from "@/components/loader";
import styles from "./EditPropertyForm.module.css";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";

const EditPropertyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const selectedProperty = useSelector((state: RootState) => state.property.selectedProperty);
  const selectedPropertyDetails = useSelector((state: RootState) => state.property.selectedPropertyDetails);
  const status = useSelector((state: RootState) => state.property.status);
  const reduxError = useSelector((state: RootState) => state.property.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(Number(id)));
      dispatch(fetchPropertyDetailsById(Number(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProperty && selectedPropertyDetails) {
      setFormData({ ...selectedProperty, ...selectedPropertyDetails });
    }
  }, [selectedProperty, selectedPropertyDetails]);

  useEffect(() => {
    if (reduxError) {
      setError(reduxError);
    }
  }, [reduxError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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
          ownerRezPropId: Number(formData.ownerRezPropId),
          propertyName: formData.propertyName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipcode: Number(formData.zipcode),
          houseDescription: formData.houseDescription,
          isExclusive: formData.isExclusive,
          propertyShare: Number(formData.propertyShare),
          propertyRemainingShare: Number(formData.propertyRemainingShare),
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
          isActive: formData.isActive,
          displayOrder: Number(formData.displayOrder),
          mailBannerUrl: formData.mailBannerUrl,
          coverImageUrl: formData.coverImageUrl,
        },
        noOfGuestsAllowed: Number(formData.noOfGuestsAllowed),
        noOfBedrooms: Number(formData.noOfBedrooms),
        noOfBathrooms: Number(formData.noOfBathrooms),
        noOfBathroomsFull: Number(formData.noOfBathroomsFull),
        noOfBathroomsHalf: Number(formData.noOfBathroomsHalf),
        squareFootage: formData.squareFootage,
        checkInTime: Number(formData.checkInTime),
        checkOutTime: Number(formData.checkOutTime),
        cleaningFee: Number(formData.cleaningFee),
        noOfPetsAllowed: Number(formData.noOfPetsAllowed),
        petPolicy: formData.petPolicy,
        feePerPet: Number(formData.feePerPet),
        peakSeasonStartDate: formData.peakSeasonStartDate,
        peakSeasonEndDate: formData.peakSeasonEndDate,
        peakSeasonAllottedNights: Number(formData.peakSeasonAllottedNights),
        offSeasonAllottedNights: Number(formData.offSeasonAllottedNights),
        peakSeasonAllottedHolidayNights: Number(formData.peakSeasonAllottedHolidayNights),
        offSeasonAllottedHolidayNights: Number(formData.offSeasonAllottedHolidayNights),
        lastMinuteBookingAllottedNights: Number(formData.lastMinuteBookingAllottedNights),
        wifiNetwork: formData.wifiNetwork,
      };

      await dispatch(updatePropertyRules({ id: Number(id), data: updatedPropertyData }));
      navigate(`/admin/property/${id}`);
    } catch (err) {
      console.error("Error updating property:", err);
      setError("Failed to update property. Please try again.");
    }
  };

  if (status === 'loading') return <Loader />;
  if (error) return <div>{error}</div>;
  if (!formData) return <div>No property data found.</div>;

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
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Square Footage"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
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