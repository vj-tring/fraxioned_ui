import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from './edit-form.module.css'
import { getProperties, updateHolidaysApi, fetchpropertyHolidaysApi } from '@/api';
import { useSelector } from 'react-redux';
import Loader from '@/components/loader';
import { RootState } from '@/store/reducers';

interface Property {
    id: number;
    propertyName: string;
}

interface EditFormProps {
    onClose: () => void;
    onHolidayUpdated: () => void;
    holidayData: {
        id: number;
        name: string;
        year: number;
        startDate: string;
        endDate: string;
    };
}

const EditForm: React.FC<EditFormProps> = ({ onClose, onHolidayUpdated, holidayData }) => {
    const [name, setName] = useState(holidayData.name);
    const [year, setYear] = useState<number>(holidayData.year);
    const [startDate, setStartDate] = useState<Date | null>(new Date(holidayData.startDate));
    const [endDate, setEndDate] = useState<Date | null>(new Date(holidayData.endDate));
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propertiesResponse, holidayResponse] = await Promise.all([
                    getProperties(),
                    fetchpropertyHolidaysApi(holidayData.id)
                ]);
                setProperties(propertiesResponse.data);

                const holidayProperties = holidayResponse.data.data.propertySeasonHolidays.map(
                    (push: any) => push.property.id
                );
                setSelectedProperties(holidayProperties);

                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, [holidayData.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not found. Please log in again.');
            return;
        }
        try {
            const updatedHolidayData = {
                startDate: startDate?.toISOString().split('T')[0],
                endDate: endDate?.toISOString().split('T')[0],
                updatedBy: {
                    id: userId
                },
                properties: selectedProperties.map(id => ({ id })),
                name,
                year
            };

            await updateHolidaysApi(holidayData.id, updatedHolidayData);
            onHolidayUpdated();
            onClose();
        } catch (err) {
            console.error('Error updating holiday:', err);
            setError('Failed to update holiday. Please try again.');
        }
    };

    const handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const propertyId = parseInt(name);
        if (checked) {
            setSelectedProperties(prev => [...prev, propertyId]);
        } else {
            setSelectedProperties(prev => prev.filter(id => id !== propertyId));
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className={styles.formContainer}>
            <Typography variant="h4" component="h2" gutterBottom className={styles.staticHeader}>
                Edit Holiday
            </Typography>
            <form onSubmit={handleSubmit} className={styles.form}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    className={styles.inputField}
                />
                <TextField
                    label="Year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 0)}
                    fullWidth
                    required
                    className={styles.inputField}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box className={styles.datePickerContainer}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            className={styles.datePicker}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            className={styles.datePicker}
                        />
                    </Box>
                </LocalizationProvider>
                <Paper elevation={0} className={styles.propertiesContainer}>
                    <FormControl component="fieldset" className={styles.checkboxGroup}>
                        <Typography variant="subtitle1" gutterBottom>
                            Select Properties
                        </Typography>
                        <FormGroup className={styles.propertiesList}>
                            {properties.map((property) => (
                                <FormControlLabel
                                    key={property.id}
                                    control={
                                        <Checkbox
                                            checked={selectedProperties.includes(property.id)}
                                            onChange={handlePropertyChange}
                                            name={property.id.toString()}
                                        />
                                    }
                                    label={property.propertyName}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </Paper>
                <Box className={styles.buttonContainer}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles.updateButton}
                    >
                        Update
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default EditForm;