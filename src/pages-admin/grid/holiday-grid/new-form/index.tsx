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
    IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';
import styles from './new-form.module.css';
import { getProperties, addHolidayApi } from '@/api';
import { useSelector } from 'react-redux';
import Loader from '@/components/loader';
import { RootState } from '@/store/reducers';
import EventIcon from '@mui/icons-material/Event';

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
    const [allPropertiesSelected, setAllPropertiesSelected] = useState(false);
    const [nameError, setNameError] = useState<string | null>(null);
    const [yearError, setYearError] = useState<string | null>(null);
    const [startDateError, setStartDateError] = useState<string | null>(null);
    const [endDateError, setEndDateError] = useState<string | null>(null);
    const [propertiesError, setPropertiesError] = useState<string | null>(null);

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

        let valid = true;

        if (!name) {
            setNameError('Fill in the Name');
            valid = false;
        } else {
            setNameError(null);
        }

        if (!year) {
            setYearError('Fill in the Year');
            valid = false;
        } else {
            setYearError(null);
        }

        if (!startDate) {
            setStartDateError('Fill in the Start Date');
            valid = false;
        } else {
            setStartDateError(null);
        }

        if (!endDate) {
            setEndDateError('Fill in the End Date');
            valid = false;
        } else {
            setEndDateError(null);
        }

        if (selectedProperties.length === 0) {
            setPropertiesError('Select at least one property');
            valid = false;
        } else {
            setPropertiesError(null);
        }

        if (!userId) {
            setError('User ID not found. Please log in again.');
            valid = false;
        }

        if (!valid) {
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
        updateAllPropertiesSelected();
    };

    const handleAllPropertiesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = event.target;
        setAllPropertiesSelected(checked);
        if (checked) {
            setSelectedProperties(properties.map(property => property.id));
        } else {
            setSelectedProperties([]);
        }
    };

    const updateAllPropertiesSelected = () => {
        setAllPropertiesSelected(selectedProperties.length === properties.length);
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.formContainer}>
                <Paper elevation={9} className={styles.formPaper}>
                    <Box className={styles.formHeader}>
                        <EventIcon className={styles.headerIcon} />
                        <Typography variant="h4" className={styles.formTitle}>
                            Add Holiday
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
                                    label="Name"
                                    autoFocus
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    fullWidth
                                    variant="outlined"
                                    className={styles.inputField}
                                    error={!!nameError}
                                    helperText={nameError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Year"
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value) || '')}
                                    fullWidth
                                    variant="outlined"
                                    className={styles.inputField}
                                    error={!!yearError}
                                    helperText={yearError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Start Date"
                                        value={startDate}
                                        onChange={(newValue) => setStartDate(newValue)}
                                        className={styles.datePicker}
                                        slotProps={{ textField: { fullWidth: true, className: styles.inputField, error: !!startDateError, helperText: startDateError } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="End Date"
                                        value={endDate}
                                        onChange={(newValue) => setEndDate(newValue)}
                                        className={styles.datePicker}
                                        slotProps={{ textField: { fullWidth: true, className: styles.inputField, error: !!endDateError, helperText: endDateError } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" className={styles.checkboxGroupLabel}>
                                    Select Properties
                                </Typography>
                                <FormControl component="fieldset" className={styles.checkboxGroup} error={!!propertiesError}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={allPropertiesSelected}
                                                onChange={handleAllPropertiesChange}
                                                name="allProperties"
                                            />
                                        }
                                        label="All Properties"
                                        className={styles.formControlLabel}
                                    />
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
                                    {propertiesError && (
                                        <Typography color="error" variant="body2" className={styles.propertiesError}>
                                            {propertiesError}
                                        </Typography>
                                    )}
                                </FormControl>
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
                                Add Holiday
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </div>
        </div>
    );
};

export default NewForm;