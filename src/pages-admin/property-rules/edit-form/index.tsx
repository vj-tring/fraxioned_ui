import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Paper,
    InputAdornment
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '@/components/loader';
import styles from './editrulesform.module.css';
import { RootState } from '@/store/reducers';
import { fetchPropertyDetails, updatePropertyRules } from '@/store/slice/auth/property-detail';
import { AppDispatch } from '@/store';

interface PropertyRulesData {
    noOfGuestsAllowed: number;
    noOfBedrooms: number;
    noOfBathrooms: number;
    noOfBathroomsFull: number;
    noOfBathroomsHalf: number;
    squareFootage: string;
    noOfPetsAllowed: number;
    checkInTime: number;
    checkOutTime: number;
    cleaningFee: number;
    wifiNetwork: string;
    peakSeasonStartDate: string;
    peakSeasonEndDate: string;
    petPolicy: string;
    feePerPet: number;
    peakSeasonAllottedNights: number;
    offSeasonAllottedNights: number;
    peakSeasonAllottedHolidayNights: number;
    offSeasonAllottedHolidayNights: number;
    lastMinuteBookingAllottedNights: number;
}

const EditPropertyRulesForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [formData, setFormData] = useState<PropertyRulesData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const propertyDetails = useSelector((state: RootState) => state.propertydetail.data);
    const loading = useSelector((state: RootState) => state.propertydetail.loading);
    const updateError = useSelector((state: RootState) => state.propertydetail.error);

    useEffect(() => {
        dispatch(fetchPropertyDetails(Number(id)));
    }, [id, dispatch]);

    useEffect(() => {
        if (propertyDetails) {
            setFormData({
                noOfGuestsAllowed: propertyDetails.noOfGuestsAllowed,
                noOfBedrooms: propertyDetails.noOfBedrooms,
                noOfBathrooms: propertyDetails.noOfBathrooms,
                noOfBathroomsFull: propertyDetails.noOfBathroomsFull,
                noOfBathroomsHalf: propertyDetails.noOfBathroomsHalf,
                squareFootage: propertyDetails.squareFootage,
                noOfPetsAllowed: propertyDetails.noOfPetsAllowed,
                checkInTime: propertyDetails.checkInTime,
                checkOutTime: propertyDetails.checkOutTime,
                cleaningFee: propertyDetails.cleaningFee,
                wifiNetwork: propertyDetails.wifiNetwork,
                peakSeasonStartDate: propertyDetails.peakSeasonStartDate,
                peakSeasonEndDate: propertyDetails.peakSeasonEndDate,
                petPolicy: propertyDetails.petPolicy,
                feePerPet: propertyDetails.feePerPet,
                peakSeasonAllottedNights: propertyDetails.peakSeasonAllottedNights,
                offSeasonAllottedNights: propertyDetails.offSeasonAllottedNights,
                peakSeasonAllottedHolidayNights: propertyDetails.peakSeasonAllottedHolidayNights,
                offSeasonAllottedHolidayNights: propertyDetails.offSeasonAllottedHolidayNights,
                lastMinuteBookingAllottedNights: propertyDetails.lastMinuteBookingAllottedNights,
            });
        }
    }, [propertyDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => prevData ? ({
            ...prevData,
            [name]: value
        }) : null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not found. Please log in again.');
            return;
        }
        if (!formData) {
            setError('No form data to submit.');
            return;
        }
        try {
            const updatedRulesData = {
                updatedBy: {
                    id: userId
                },
                property: {
                    id: Number(id)
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
                wifiNetwork: formData.wifiNetwork
            };

            await dispatch(updatePropertyRules({ id: Number(id), data: updatedRulesData }));
            if (!updateError) {
                navigate(`/admin/property/${id}/rules`);
            }
        } catch (err) {
            console.error('Error updating property rules:', err);
            setError('Failed to update property rules. Please try again.');
        }
    };

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;
    if (!formData) return <div>No property rules data found.</div>;

    return (
        <div className={styles.formContainer}>
            <Paper elevation={3} className={styles.formPaper}>
                <div className={styles.staticHeader}>
                    <div className={styles.formHeader}>
                        <Typography variant="h4" className={styles.formTitle}>
                            Property Rules & Details
                        </Typography>
                    </div>
                </div>
                <div className={styles.scrollableContent}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Seasonal Settings</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Peak Season Start"
                                        name="peakSeasonStartDate"
                                        type="date"
                                        value={formData?.peakSeasonStartDate}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        className={styles.dateInput}
                                    />
                                    <TextField
                                        label="Peak Season End"
                                        name="peakSeasonEndDate"
                                        type="date"
                                        value={formData?.peakSeasonEndDate}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        className={styles.dateInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Peak Season(Allowed Nights)"
                                        name="peakSeasonAllottedNights"
                                        type="number"
                                        value={formData?.peakSeasonAllottedNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Off Season(Allowed Nights)"
                                        name="offSeasonAllottedNights"
                                        type="number"
                                        value={formData?.offSeasonAllottedNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Peak season Holiday(Allowed Nights)"
                                        name="peakSeasonAllottedHolidayNights"
                                        type="number"
                                        value={formData?.peakSeasonAllottedHolidayNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Off season Holiday(Allowed Nights)"
                                        name="offSeasonAllottedHolidayNights"
                                        type="number"
                                        value={formData?.offSeasonAllottedHolidayNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Property Details</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Guests Allowed"
                                        name="noOfGuestsAllowed"
                                        type="number"
                                        value={formData?.noOfGuestsAllowed}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Bedrooms"
                                        name="noOfBedrooms"
                                        type="number"
                                        value={formData?.noOfBedrooms}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Total Bathrooms"
                                        name="noOfBathrooms"
                                        type="number"
                                        value={formData?.noOfBathrooms}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Full Bathrooms"
                                        name="noOfBathroomsFull"
                                        type="number"
                                        value={formData?.noOfBathroomsFull}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Half Bathrooms"
                                        name="noOfBathroomsHalf"
                                        type="number"
                                        value={formData?.noOfBathroomsHalf}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Square Footage"
                                        name="squareFootage"
                                        value={formData?.squareFootage}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Check-in & Fees</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Check-in Time"
                                        name="checkInTime"
                                        type="number"
                                        value={formData?.checkInTime}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">:00</InputAdornment>,
                                        }}
                                        className={styles.timeInput}
                                    />
                                    <TextField
                                        label="Check-out Time"
                                        name="checkOutTime"
                                        type="number"
                                        value={formData?.checkOutTime}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">:00</InputAdornment>,
                                        }}
                                        className={styles.timeInput}
                                    />
                                    <TextField
                                        label="Cleaning Fee"
                                        name="cleaningFee"
                                        type="number"
                                        value={formData?.cleaningFee}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Pet Policy</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Pets Allowed"
                                        name="noOfPetsAllowed"
                                        type="number"
                                        value={formData?.noOfPetsAllowed}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Fee Per Pet"
                                        name="feePerPet"
                                        type="number"
                                        value={formData?.feePerPet}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>
                        {error && <Typography color="error" className={styles.error}>{error}</Typography>}

                        <div className={styles.buttonContainer}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/admin/property/${id}/rules`)}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                className={styles.updateButton}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </Paper>
        </div>
    );
};

export default EditPropertyRulesForm;
