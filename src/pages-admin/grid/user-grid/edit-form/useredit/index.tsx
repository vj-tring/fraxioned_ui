import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { updateuserapi, getRoles } from "@/api";
import styles from "./useresit.module.css";

interface ContactDetails {
  id: number;
  primaryEmail: string;
  secondaryEmail: string | null;
  optionalEmailOne: string | null;
  optionalEmailTwo: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
  optionalPhoneOne: string | null;
  optionalPhoneTwo: string | null;
}

interface UserData {
  id: number;
  role: { id: number };
  firstName: string;
  lastName: string;
  password?: string;
  imageURL: string | null;
  isActive: boolean;
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  country: string | null;
  city: string | null;
  zipcode: string | null;
  resetToken?: string;
  resetTokenExpires?: string;
  lastLoginTime: string;
  updatedBy?: number;
  contactDetails: ContactDetails;
}

interface Role {
  id: number;
  roleName: string;
  roleDescription: string;
}

interface EditFormProps {
    user: UserData;
    onClose: () => void;
    onUserUpdated: () => void;
    showCloseIcon?: boolean; 
    formTitle: string;
}

const EditForm: React.FC<EditFormProps> = ({ user, onClose, onUserUpdated, showCloseIcon = true, formTitle = "Edit User" }) => {
    const [formData, setFormData] = useState<UserData>(user);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [showSecondaryContact, setShowSecondaryContact] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles();
        setRoles(response.data.roles);
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to fetch roles. Please try again.");
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (
      formData.contactDetails.secondaryEmail ||
      formData.contactDetails.secondaryPhone
    ) {
      setShowSecondaryContact(true);
    }
  }, [formData.contactDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      contactDetails: {
        ...prevData.contactDetails,
        [field]: value,
      },
    }));
  };

  const handleAddContact = () => {
    setShowSecondaryContact(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSend = {
        role: { id: formData.role.id },
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        imageURL: formData.imageURL,
        isActive: Boolean(formData.isActive),
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        state: formData.state,
        country: formData.country,
        city: formData.city,
        zipcode: formData.zipcode,
        resetToken: formData.resetToken,
        resetTokenExpires: formData.resetTokenExpires,
        lastLoginTime: formData.lastLoginTime,
        updatedBy: formData.id,
        contactDetails: {
          primaryEmail: formData.contactDetails.primaryEmail,
          primaryPhone: formData.contactDetails.primaryPhone,
          secondaryEmail: formData.contactDetails.secondaryEmail,
          secondaryPhone: formData.contactDetails.secondaryPhone,
          optionalEmailOne: formData.contactDetails.optionalEmailOne,
          optionalPhoneOne: formData.contactDetails.optionalPhoneOne,
          optionalEmailTwo: formData.contactDetails.optionalEmailTwo,
          optionalPhoneTwo: formData.contactDetails.optionalPhoneTwo,
        },
      };

      await updateuserapi(formData.id, dataToSend);
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  return (
    <div className={styles.editFormContainer}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" className={styles.formTitle}>
          Edit User
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="close"
          className={styles.closeButton}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              fullWidth
              required
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              fullWidth
              required
              className={styles.inputField}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1 || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2 || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="State"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Country"
              name="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Zipcode"
              name="zipcode"
              value={formData.zipcode || ""}
              onChange={handleInputChange}
              fullWidth
              className={styles.inputField}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth className={styles.inputField}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role.id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: { id: Number(e.target.value) },
                  }))
                }
                label="Role"
                name="role.id"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.roleName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

          <Grid item xs={12}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Contact Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Phone"
              name="primaryPhone"
              value={formData.contactDetails.primaryPhone}
              onChange={(e) =>
                handleContactChange("primaryPhone", e.target.value)
              }
              fullWidth
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Email"
              name="primaryEmail"
              value={formData.contactDetails.primaryEmail}
              onChange={(e) =>
                handleContactChange("primaryEmail", e.target.value)
              }
              fullWidth
              className={styles.inputField}
            />
          </Grid>

          {showSecondaryContact && [
            <Grid item xs={12} sm={6} key="secondaryPhone">
              <TextField
                label="Secondary Phone"
                name="secondaryPhone"
                value={formData.contactDetails.secondaryPhone || ""}
                onChange={(e) =>
                  handleContactChange("secondaryPhone", e.target.value)
                }
                fullWidth
                className={styles.inputField}
              />
            </Grid>,
            <Grid item xs={12} sm={6} key="secondaryEmail">
              <TextField
                label="Secondary Email"
                name="secondaryEmail"
                value={formData.contactDetails.secondaryEmail || ""}
                onChange={(e) =>
                  handleContactChange("secondaryEmail", e.target.value)
                }
                fullWidth
                className={styles.inputField}
              />
            </Grid>,
          ]}

          {!showSecondaryContact && (
            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddContact}
                className={styles.addContactButton}
              >
                Add Contact
              </Button>
            </Grid>
          )}
        </Grid>

        {error && (
          <Typography color="error" className={styles.error}>
            {error}
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end">
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
            color="primary"
            className={styles.updateButton}
          >
            Update User
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default EditForm;
