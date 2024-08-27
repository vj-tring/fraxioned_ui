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
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { updatePropertyapi, getPropertyById } from '@/api';
import Loader from '@/components/loader';
import styles from './EditPropertyForm.module.css';
import { RootState } from '@/store/reducers';

const EditPropertyForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                const response = await getPropertyById(Number(id));
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching property details:', err);
                setError('Failed to fetch property details. Please try again.');
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not found. Please log in again.');
            return;
        }
        try {
            const updatedPropertyData = {
                updatedBy: {
                    id: userId
                },
                propertyName: formData.propertyName,
                ownerRezPropId: formData.ownerRezPropId,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                zipcode: formData.zipcode,
                houseDescription: formData.houseDescription,
                isExclusive: formData.isExclusive,
                propertyShare: formData.propertyShare,
                latitude: formData.latitude,
                longitude: formData.longitude,
                isActive: formData.isActive,
                displayOrder: formData.displayOrder
            };

            await updatePropertyapi(Number(id), updatedPropertyData);
            navigate(`/admin/property/${id}`);
        } catch (err) {
            console.error('Error updating property:', err);
            setError('Failed to update property. Please try again.');
        }
    };

    if (loading) return <Loader />;
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                        {error && <Typography color="error" className={styles.error}>{error}</Typography>}
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
