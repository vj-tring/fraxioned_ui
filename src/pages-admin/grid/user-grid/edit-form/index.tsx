import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { updateUserapi } from '@/api';
import Loader from '@/components/loader';
import styles from './EditUser.module.css';
import { RootState } from '@/store/reducers';

interface UserData {
    role: { id: number };
    firstName: string;
    lastName: string;
    isActive: boolean;
    addressLine1: string;
    addressLine2: string;
    state: string;
    country: string;
    city: string;
    zipcode: string;
    lastLoginTime: string;
    contactDetails: Array<{ contactType: string; contactValue: string }>;
}

const EditForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await updateUserapi(Number(id));
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to fetch user details. Please try again.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => {
            if (!prevData) return null;
            return {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            };
        });
    };

    const handleContactChange = (index: number, field: string, value: string) => {
        setFormData((prevData) => {
            if (!prevData) return null;
            const newContactDetails = [...prevData.contactDetails];
            newContactDetails[index] = { ...newContactDetails[index], [field]: value };
            return { ...prevData, contactDetails: newContactDetails };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not found. Please log in again.');
            return;
        }
        try {
            await updateUserapi(Number(id), formData);
            navigate(`/admin/user/${id}`);
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user. Please try again.');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;
    if (!formData) return <div>No user data found.</div>;

    return (
        <div className={styles.formContainer}>
            <Paper elevation={3} className={styles.formPaper}>
                <div className={styles.staticHeader}>
                    <Box className={styles.formHeader}>
                        <EditIcon className={styles.headerIcon} />
                        <Typography variant="h4" className={styles.formTitle}>
                            Edit User
                        </Typography>
                    </Box>
                </div>
                <div className={styles.scrollableContent}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <Grid container spacing={3}>
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
                            <Grid item xs={12}>
                                <TextField
                                    label="Address 1"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address 2 (optional)"
                                    name="addressLine2"
                                    value={formData.addressLine2}
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
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Zipcode"
                                    name="zipcode"
                                    value={formData.zipcode}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6">Contact Details</Typography>
                            </Grid>
                            {formData.contactDetails.map((contact, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Phone Number"
                                            value={contact.contactType === 'PHONE' ? contact.contactValue : ''}
                                            onChange={(e) => handleContactChange(index, 'contactValue', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            className={styles.inputField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Email"
                                            value={contact.contactType === 'EMAIL' ? contact.contactValue : ''}
                                            onChange={(e) => handleContactChange(index, 'contactValue', e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            className={styles.inputField}
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" className={styles.inputField}>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        value={formData.role.id}
                                        onChange={(e) => setFormData(prev => prev ? {...prev, role: {id: Number(e.target.value)}} : null)}
                                        label="Role"
                                        name="role.id"
                                    >
                                        <MenuItem value={1}>Admin</MenuItem>
                                        <MenuItem value={2}>User</MenuItem>
                                        <MenuItem value={3}>Manager</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Login"
                                    name="lastLoginTime"
                                    value={new Date(formData.lastLoginTime).toLocaleString()}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
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
                        </Grid>
                        {error && <Typography color="error" className={styles.error}>{error}</Typography>}
                        <Box className={styles.buttonContainer}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate(`/admin/user/${id}`)}
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
            </Paper>
        </div>
    );
};

export default EditForm;