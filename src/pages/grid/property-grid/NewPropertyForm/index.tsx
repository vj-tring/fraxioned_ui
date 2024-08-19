import React, { useState } from 'react';
import {
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import styles from './NewPropertyForm.module.css';
import { addPropertyApi } from '@/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';

interface NewPropertyFormProps {
    onClose: () => void;
    onPropertyAdded: () => void;
}

const NewPropertyForm: React.FC<NewPropertyFormProps> = ({ onClose, onPropertyAdded }) => {
    const [propertyName, setPropertyName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [houseDescription, setHouseDescription] = useState('');
    const [propertyShare, setPropertyShare] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [isActive, setIsActive] = useState(true);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            console.error('User ID not found. Please log in again.');
            return;
        }
        try {
            const propertyData = {
                createdBy: { id: userId },
                propertyName,
                ownerRezPropId: 0,
                address,
                city,
                state,
                country,
                zipcode: parseInt(zipcode),
                houseDescription,
                isExclusive: true,
                propertyShare: parseFloat(propertyShare),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                isActive,
                displayOrder: 0
            };
            await addPropertyApi(propertyData);
            onPropertyAdded();
            onClose();
        } catch (err) {
            console.error('Error in adding the :', err);
        }
    };

    return (
        <div className={styles.formContainer}>
            <Typography variant="h4" className={styles.formTitle}>
                Add Property
            </Typography>
            <Paper elevation={0} className={styles.formPaper}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Property Name"
                                value={propertyName}
                                onChange={(e) => setPropertyName(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Country"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Zipcode"
                                type="number"
                                value={zipcode}
                                onChange={(e) => setZipcode(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="House Description"
                                value={houseDescription}
                                onChange={(e) => setHouseDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Property Share"
                                type="number"
                                value={propertyShare}
                                onChange={(e) => setPropertyShare(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Latitude"
                                type="number"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Longitude"
                                type="number"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                size="small"
                                className={styles.inputField}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        name="isActive"
                                    />
                                }
                                label="Is Active"
                            />
                        </Grid>
                    </Grid>
                    <Box className={styles.buttonContainer}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={styles.addButton}
                        >
                            ADD
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onClose}
                            className={styles.cancelButton}
                        >
                            CANCEL
                        </Button>
                    </Box>
                </form>
            </Paper>
        </div>
    );
};

export default NewPropertyForm;