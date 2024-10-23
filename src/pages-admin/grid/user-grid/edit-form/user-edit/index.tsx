import React, { useState, useEffect } from "react";
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "@/api/api-endpoints";
import { updateUserById } from "@/store/slice/user/action";
import { RootState } from "@/store/reducers";
import { User, Role, ContactDetails } from "@/store/model";
import styles from "./useredit.module.css";
import { AppDispatch } from "@/store";
import { EditFormProps } from "./user-edit.types";

const EditForm: React.FC<EditFormProps> = ({
  user,
  onClose,
  onUserUpdated,
  showCloseIcon = true,
  formTitle = "Edit User",
  isAdmin,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.Users.user);
  const loading = useSelector((state: RootState) => state.Users.loading);
  const [formData, setFormData] = useState<User>(user);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showSecondaryContact, setShowSecondaryContact] = useState<boolean>(false);

  // New function to check if role/active fields should be shown
  const shouldShowRoleFields = () => {
    // If not admin, don't show the fields
    if (!isAdmin) return false;

    // If current user is Admin role, don't show the fields
    if (formData.role.roleName === "Admin") return false;

    // Show fields if user is Owner or any other role
    return true;
  };

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
    const { secondaryEmail, secondaryPhone } = formData.contactDetails;
    setShowSecondaryContact(!!(secondaryEmail || secondaryPhone));
  }, [formData.contactDetails]);

  useEffect(() => {
    if (userState) {
      setFormData(userState);
    }
  }, [userState]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

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

  const handleRoleChange = (roleId: number) => {
    const selectedRole = roles.find((role) => role.id === roleId);
    if (selectedRole) {
      setFormData((prevData) => ({
        ...prevData,
        role: selectedRole,
      }));
    }
  };

  const handleAddContact = () => setShowSecondaryContact(true);


  //takes up the field names of the address and modifies according to the UI representation
  const formatFieldLabel = (field: string): string => {
    return field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...restFormData } = formData;

      const dataToSend: Partial<User> = {
        ...restFormData,
        updatedBy: id,
        ...(formData.profileImage && { profileImage: formData.profileImage }),
        
      };

      delete (dataToSend as any).profileImage;
      delete dataToSend.resetToken;
      delete dataToSend.resetTokenExpires;

      if (id) {
        await dispatch(updateUserById({ userId: id, userData: dataToSend }));
      }

      onUserUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  return (
    <div className={styles.editFormContainer}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" className={styles.formTitle}>
          {formTitle}
        </Typography>
        {showCloseIcon && (
          <IconButton onClick={onClose} aria-label="close" className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Grid container spacing={2}>
          {/* Basic Information */}
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

          {/* Address Information */}
          {["addressLine1", "addressLine2", "city", "state", "country", "zipcode"].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={formatFieldLabel(field)}
                name={field}
                value={formData[field as keyof User] || ""}
                onChange={handleInputChange}
                fullWidth
                className={styles.inputField}
              />
            </Grid>
          ))}


          {/* Role and Active Status - Only shown for non-Admin roles when logged in user is Admin */}
          {shouldShowRoleFields() && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={styles.inputField}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role.id}
                    onChange={(e) => handleRoleChange(Number(e.target.value))}
                    label="Role"
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
            </>
          )}

          {/* Contact Details */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Contact Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Email"
              name="primaryEmail"
              value={formData.contactDetails.primaryEmail}
              onChange={(e) => handleContactChange("primaryEmail", e.target.value)}
              fullWidth
              className={styles.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primary Phone"
              name="primaryPhone"
              value={formData.contactDetails.primaryPhone}
              onChange={(e) => handleContactChange("primaryPhone", e.target.value)}
              fullWidth
              className={styles.inputField}
            />
          </Grid>

          {showSecondaryContact && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Email"
                  name="secondaryEmail"
                  value={formData.contactDetails.secondaryEmail || ""}
                  onChange={(e) => handleContactChange("secondaryEmail", e.target.value)}
                  fullWidth
                  className={styles.inputField}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Secondary Phone"
                  name="secondaryPhone"
                  value={formData.contactDetails.secondaryPhone || ""}
                  onChange={(e) => handleContactChange("secondaryPhone", e.target.value)}
                  fullWidth
                  className={styles.inputField}
                />
              </Grid>
            </>
          )}

          {!showSecondaryContact && (
            <Grid item xs={12}>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddContact}
                className={styles.addContactButton}
              >
                Add Secondary Contact
              </Button>
            </Grid>
          )}
        </Grid>

        {error && (
          <Typography color="error" className={styles.error}>
            {error}
          </Typography>
        )}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.updateButton}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update User"}
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default EditForm;
