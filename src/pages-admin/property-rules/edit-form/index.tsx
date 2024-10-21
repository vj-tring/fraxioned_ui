import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField,
    Button,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '@/components/loader';
import styles from './editrulesform.module.css';
import { styled } from '@mui/material/styles';
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

    const TimePickerContainer = styled('div')({
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        minWidth: '200px',
    });

    const TimeSelect = styled(Select)({
        minWidth: '80px',
        '& .MuiSelect-select': {
            padding: '8px 12px',
        },
    });

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
                            <h3 className={styles.sectionTitle}>Property Details</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Square Footage"
                                        name="squareFootage"
                                        value={formData?.squareFootage}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Guests Allowed"
                                        name="noOfGuestsAllowed"
                                        type="number"
                                        value={formData?.noOfGuestsAllowed}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Pets Allowed"
                                        name="noOfPetsAllowed"
                                        type="number"
                                        value={formData?.noOfPetsAllowed}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>
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
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Peak Season End"
                                        name="peakSeasonEndDate"
                                        type="date"
                                        value={formData?.peakSeasonEndDate}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Peak Season(Alloted Nights)"
                                        name="peakSeasonAllottedNights"
                                        type="number"
                                        value={formData?.peakSeasonAllottedNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Off Season(Alloted Nights)"
                                        name="offSeasonAllottedNights"
                                        type="number"
                                        value={formData?.offSeasonAllottedNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                </div>
                            </div>
                        </section>
                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Holiday Settings</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Peak season Holiday(Alloted Nights)"
                                        name="peakSeasonAllottedHolidayNights"
                                        type="number"
                                        value={formData?.peakSeasonAllottedHolidayNights}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
                                    />
                                    <TextField
                                        label="Off Season Holiday(Alloted Nights)"
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
                            <h3 className={styles.sectionTitle}>Check-in & Check-out Time</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TimePickerContainer>
                                        <FormControl className={styles.timeInput}>
                                            <InputLabel>Check-in</InputLabel>
                                            <TimeSelect
                                                value={formData?.checkInTime || 0}
                                                label="Check-in"
                                                onChange={(e) => {
                                                    setFormData(prevData => prevData ? ({
                                                        ...prevData,
                                                        checkInTime: Number(e.target.value)
                                                    }) : null);
                                                }}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <MenuItem key={i} value={i}>
                                                        {i === 0 ? '12:00 AM' :
                                                            i < 12 ? `${i}:00 AM` :
                                                                i === 12 ? '12:00 PM' :
                                                                    `${i - 12}:00 PM`}
                                                    </MenuItem>
                                                ))}
                                            </TimeSelect>
                                        </FormControl>
                                    </TimePickerContainer>

                                    <TimePickerContainer>
                                        <FormControl className={styles.timeInput}>
                                            <InputLabel>Check-out</InputLabel>
                                            <TimeSelect
                                                value={formData?.checkOutTime || 0}
                                                label="Check-out"
                                                onChange={(e) => {
                                                    setFormData(prevData => prevData ? ({
                                                        ...prevData,
                                                        checkOutTime: Number(e.target.value)
                                                    }) : null);
                                                }}
                                            >
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <MenuItem key={i} value={i}>
                                                        {i === 0 ? '12:00 AM' :
                                                            i < 12 ? `${i}:00 AM` :
                                                                i === 12 ? '12:00 PM' :
                                                                    `${i - 12}:00 PM`}
                                                    </MenuItem>
                                                ))}
                                            </TimeSelect>
                                        </FormControl>
                                    </TimePickerContainer>
                                </div>
                            </div>
                        </section>

                        <section className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Fee details</h3>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <TextField
                                        label="Fee Per Pet"
                                        name="feePerPet"
                                        type="number"
                                        value={formData?.feePerPet}
                                        onChange={handleInputChange}
                                        className={styles.numberInput}
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