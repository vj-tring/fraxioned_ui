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
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import styles from './new-form.module.css';
import { getProperties, addHolidayApi } from '@/api';
import { useSelector } from 'react-redux';
import Loader from '@/components/loader';
import { RootState } from '@/store/reducers';

interface Property {
    id: number;
    propertyName: string;
}

interface NewFormProps {
    onClose: () => void;
    onHolidayAdded: () => void;
}

const NewForm: React.FC<NewFormProps> = ({ onClose, onHolidayAdded }) => {
    const [name, setName] = useState('');
    const [year, setYear] = useState<number | ''>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = useSelector((state: RootState) => state.auth.user?.id);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await getProperties();
                setProperties(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('User ID not found. Please log in again.');
            return;
        }
        try {
            const holidayData = {
                name,
                year: Number(year),
                startDate: startDate?.toISOString().split('T')[0],
                endDate: endDate?.toISOString().split('T')[0],
                properties: selectedProperties.map(id => ({ id })),
                createdBy: {
                    id: userId,
                },
            };
            await addHolidayApi(holidayData);
            onHolidayAdded();
            onClose();
        } catch (err) {
            console.error('Error adding holiday:', err);
            setError('Failed to add holiday. Please try again.');
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
            <Typography variant="h4" className={styles.formTitle}>
                Add Holiday
            </Typography>
            <Paper elevation={0} className={styles.formPaper}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        className={styles.inputField}
                    />
                    <TextField
                        label="Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value) || '')}
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        className={styles.inputField}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    className={styles.datePicker}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    className={styles.datePicker}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                    <Typography variant="subtitle2" className={styles.checkboxGroupLabel}>
                        Select Properties
                    </Typography>
                    <FormControl component="fieldset" className={styles.checkboxGroup}>
                        <div className={styles.scrollableContainer}>
                            <FormGroup>
                                <Grid container>
                                    {properties.map((property) => (
                                        <Grid item xs={6} key={property.id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedProperties.includes(property.id)}
                                                        onChange={handlePropertyChange}
                                                        name={property.id.toString()}
                                                        size="small"
                                                    />
                                                }
                                                label={property.propertyName}
                                                className={styles.formControlLabel}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>
                        </div>
                    </FormControl>
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

export default NewForm;