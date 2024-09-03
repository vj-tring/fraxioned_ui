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
    IconButton
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import styles from './NewPropertyForm.module.css';
import CloseIcon from '@mui/icons-material/Close';
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
            console.error('Error in adding the property:', err);
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
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Property Name"
                                    value={propertyName}
                                    onChange={(e) => setPropertyName(e.target.value)}
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
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Zipcode"
                                    type="number"
                                    value={zipcode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="Property Share"
                                    type="number"
                                    value={propertyShare}
                                    onChange={(e) => setPropertyShare(e.target.value)}
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
                                            checked={isActive}
                                            onChange={(e) => setIsActive(e.target.checked)}
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
                                    value={houseDescription}
                                    onChange={(e) => setHouseDescription(e.target.value)}
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
                                    type="number"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    className={styles.inputField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Longitude"
                                    type="number"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
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