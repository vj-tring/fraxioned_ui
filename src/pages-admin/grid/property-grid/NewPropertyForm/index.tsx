import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./NewPropertyForm.module.css";
import { addProperty } from "@/store/slice/auth/addproperty";
import { AppDispatch } from "@/store";

interface NewPropertyFormProps {
  onClose: () => void;
  onPropertyAdded: () => void;
}

interface PropertyData {
  createdBy: { id: number };
  propertyName: string;
  ownerRezPropId: number;
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
}

const NewPropertyForm: React.FC<NewPropertyFormProps> = ({
  onClose,
  onPropertyAdded,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    houseDescription: "",
    propertyShare: "",
    latitude: "",
    longitude: "",
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.propertyName.trim()) {
      alert("Property Name is required.");
      return;
    }

    try {
      const propertyData: PropertyData = {
        createdBy: { id: 1 },
        propertyName: formData.propertyName.trim(),
        ownerRezPropId: 0,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        zipcode: parseInt(formData.zipcode, 10) || 0,
        houseDescription: formData.houseDescription.trim(),
        isExclusive: true,
        propertyShare: parseFloat(formData.propertyShare) || 0,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        isActive: formData.isActive,
        displayOrder: 0,
      };

      const result = await dispatch(addProperty(propertyData));
      if (addProperty.fulfilled.match(result)) {
        onPropertyAdded();
        onClose();
      } else if (addProperty.rejected.match(result)) {
        alert(`Failed to add property: ${result.error.message}`);
      }
    } catch (err) {
      console.error("Error in adding the property:", err);
      alert("An error occurred while adding the property. Please try again.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.formContainer}>
        <Paper elevation={9} className={styles.formPaper}>
          <Box className={styles.formHeader}>
            <HomeIcon className={styles.headerIcon} />
            <Typography variant="h4" className={styles.formTitle}>
              Add New Property
            </Typography>
            <IconButton
              onClick={onClose}
              className={styles.closeButton}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Property Name"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleChange}
                  autoFocus
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Zipcode"
                  name="zipcode"
                  type="number"
                  value={formData.zipcode}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Property Share"
                  name="propertyShare"
                  type="number"
                  value={formData.propertyShare}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Is Active"
                  className={styles.checkbox}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="House Description"
                  name="houseDescription"
                  value={formData.houseDescription}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  className={styles.inputField}
                />
              </Grid>
            </Grid>
            <Box className={styles.buttonContainer}>
              <Button
                variant="outlined"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className={styles.addButton}
              >
                Add Property
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default NewPropertyForm;
