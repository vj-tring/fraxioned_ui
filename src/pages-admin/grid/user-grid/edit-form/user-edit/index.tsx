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
import { updateuserapi, getRoles } from "@/api/api-endpoints";
import styles from "./useredit.module.css";
import { User, Role, ContactDetails } from "@/store/model/user";
import { updateUserById } from "@/store/slice/user-slice";
import { useDispatch } from "@/store";

interface EditFormProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
  showCloseIcon?: boolean;
  formTitle?: string;
  isAdmin: boolean;
}

const EditForm: React.FC<EditFormProps> = ({
  user,
  onClose,
  onUserUpdated,
  showCloseIcon = true,
  formTitle = "Edit User",
  isAdmin,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<User>(user);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showSecondaryContact, setShowSecondaryContact] =
    useState<Boolean>(false);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
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

  const handleAddContact = () => setShowSecondaryContact(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, role, isActive, ...rest } = formData;
      const dataToSend: User = {
        role: { id: role.id, roleName: role.roleName },
        ...rest,
        updatedBy: id,
        isActive: true,
      };
      if (id) {
        console.log("updateuser", dataToSend);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6" className={styles.formTitle}>
          {formTitle}
        </Typography>
        {showCloseIcon && (
          <IconButton
            onClick={onClose}
            aria-label="close"
            className={styles.closeButton}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Grid container spacing={2}>
          {[
            "firstName",
            "lastName",
            "addressLine1",
            "addressLine2",
            "city",
            "state",
            "country",
            "zipcode",
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/([A-Z])/g, " $1").trim()} // Convert camelCase to readable label
                name={field}
                value={formData[field as keyof User] || ""}
                onChange={handleInputChange}
                fullWidth
                required={field === "firstName" || field === "lastName"}
                className={styles.inputField}
              />
            </Grid>
          ))}
          {isAdmin && (
            <div>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth className={styles.inputField}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role.id}
                    onChange={(e) => {
                      const selectedRole = roles.find(
                        (role) => role.id === Number(e.target.value)
                      );
                      if (selectedRole) {
                        setFormData((prev) => ({
                          ...prev,
                          role: selectedRole,
                        }));
                      }
                    }}
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
            </div>
          )}

          <Grid item xs={12}>
            <Typography variant="subtitle1" className={styles.sectionTitle}>
              Contact Details
            </Typography>
          </Grid>

          {["primaryPhone", "primaryEmail"].map((field) => (
            <Grid item xs={12} sm={6} key={field}>
              <TextField
                label={field.replace(/([A-Z])/g, " $1").trim()} // Convert camelCase to readable label
                name={field}
                value={
                  formData.contactDetails[field as keyof ContactDetails] || ""
                }
                onChange={(e) =>
                  handleContactChange(
                    field as keyof ContactDetails,
                    e.target.value
                  )
                }
                fullWidth
                className={styles.inputField}
              />
            </Grid>
          ))}

          {showSecondaryContact && (
            <>
              {["secondaryPhone", "secondaryEmail"].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField
                    label={field.replace(/([A-Z])/g, " $1").trim()} // Convert camelCase to readable label
                    name={field}
                    value={
                      formData.contactDetails[field as keyof ContactDetails] ||
                      ""
                    }
                    onChange={(e) =>
                      handleContactChange(
                        field as keyof ContactDetails,
                        e.target.value
                      )
                    }
                    fullWidth
                    className={styles.inputField}
                  />
                </Grid>
              ))}
            </>
          )}

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
