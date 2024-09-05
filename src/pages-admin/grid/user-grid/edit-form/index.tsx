import React, { useEffect, useState } from 'react';
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Paper,
    Grid,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateuserapi, getRoles } from '@/api';
import CloseIcon from '@mui/icons-material/Close';
import Loader from '@/components/loader';
import styles from './EditUser.module.css';

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
}

const EditForm: React.FC<EditFormProps> = ({ user, onClose, onUserUpdated }) => {
    const [formData, setFormData] = useState<UserData>(user);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRoles();
                setRoles(response.data.roles);
            } catch (err) {
                console.error('Error fetching roles:', err);
                setError('Failed to fetch roles. Please try again.');
            }
        };

        fetchRoles();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleContactChange = (field: keyof ContactDetails, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            contactDetails: {
                ...prevData.contactDetails,
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                role: { id: formData.role.id },
                isActive: Boolean(formData.isActive),
                updatedBy: formData.id,
            };
            await updateuserapi(formData.id, dataToSend);
            onUserUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.formContainer}>
                <div className={styles.staticHeader}>
                    <Box className={styles.formHeader}>
                        <EditIcon className={styles.headerIcon} />
                        <Typography variant="h4" className={styles.formTitle}>
                            Edit User
                        </Typography>
                        <IconButton
                            onClick={onClose}
                            className={styles.closeButton}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </div>
                <div className={styles.scrollableContent}>
                    <Paper elevation={9} className={styles.formPaper}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <Grid container spacing={3}>
                                {/* Basic Information */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
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
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                
                                {/* Address Fields */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 1"
                                        name="addressLine1"
                                        value={formData.addressLine1 || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 2"
                                        name="addressLine2"
                                        value={formData.addressLine2 || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="City"
                                        name="city"
                                        value={formData.city || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="State"
                                        name="state"
                                        value={formData.state || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Country"
                                        name="country"
                                        value={formData.country || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Zipcode"
                                        name="zipcode"
                                        value={formData.zipcode || ''}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>

                                {/* Role Selection */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined" className={styles.inputField}>
                                        <InputLabel>Role</InputLabel>
                                        <Select
                                            value={formData.role.id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, role: { id: Number(e.target.value) } }))}
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

                                {/* Is Active Checkbox */}
                                <Grid item xs={12}>
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

                                {/* Contact Details */}
                                <Grid item xs={12}>
                                    <Typography variant="h6" className={styles.sectionTitle}>Contact Details</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Primary Email"
                                        value={formData.contactDetails.primaryEmail}
                                        onChange={(e) => handleContactChange('primaryEmail', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Secondary Email"
                                        value={formData.contactDetails.secondaryEmail || ''}
                                        onChange={(e) => handleContactChange('secondaryEmail', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Primary Phone"
                                        value={formData.contactDetails.primaryPhone}
                                        onChange={(e) => handleContactChange('primaryPhone', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Secondary Phone"
                                        value={formData.contactDetails.secondaryPhone || ''}
                                        onChange={(e) => handleContactChange('secondaryPhone', e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        className={styles.inputField}
                                    />
                                </Grid>
                                {/* Add fields for optional emails and phones if needed */}
                            </Grid>
                            {error && <Typography color="error" className={styles.error}>{error}</Typography>}
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
                                    className={styles.updateButton}
                                >
                                    Update User
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </div>
            </div>
        </div>
    );
};

export default EditForm;