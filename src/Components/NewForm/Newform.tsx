import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from './Newform.module.css';
import { getProperties } from 'utils/api';

interface NewFormProps {
    onClose: () => void;
}

const NewForm: React.FC<NewFormProps> = ({ onClose }) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [property, setProperty] = useState('');
    const [properties, setProperties] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                const propertyNames = response.data.map((prop: { propertyName: any; }) => prop.propertyName);
                setProperties(propertyNames);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError('Failed to fetch properties. Please try again.');
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, year, startDate, endDate, property });
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className={styles.formContainer}>
            <Typography variant="h4" component="h2" gutterBottom>
                Add Holiday
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
                    onChange={(e) => setYear(parseInt(e.target.value) || '')}
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
                <FormControl fullWidth required className={styles.inputField}>
                    <InputLabel>Property Name</InputLabel>
                    <Select
                        value={property}
                        onChange={(e) => setProperty(e.target.value as string)}
                        label="Property Name"
                    >
                        {properties.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box className={styles.buttonContainer}>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="secondary"
                        className={styles.addButton}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default NewForm;