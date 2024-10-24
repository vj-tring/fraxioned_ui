import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { DatePickerWithRange } from '@/components/calender';
import { DateRange } from 'react-day-picker';
import styles from './create-booking.module.css';

import MultipleSelect from '@/components/guest-selector';
import { RootState } from '@/store/reducers';
import { format, addDays } from 'date-fns';
import { fetchUserBookings } from '@/store/slice/auth/bookingSlice';
import { AppDispatch } from '@/store';
import Loader from '../../components/loader';
import { X } from 'lucide-react';
import { fetchProperties } from '@/store/slice/auth/property-slice';
import { SelectChangeEvent } from '@mui/material';


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 731,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
};

const dateBoxStyle = {
    border: '1px solid gray',
    borderRadius: '10px',
    padding: '3px',
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '50px',
    width: '240px',
    textAlign: 'center',
    marginLeft:'34px'
};

interface CreateBookingModalProps {
    openEvent: boolean;
    handleClose: () => void;
}

const CreateBookingModal: React.FC<CreateBookingModalProps> = ({ openEvent, handleClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const today = new Date();
    const tomorrow = addDays(today, 1);

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: today,
        to: tomorrow
    });

    const [displayDates, setDisplayDates] = useState({
        checkinDate: format(today, "MMM do, yyyy"),
        checkoutDate: format(tomorrow, "MMM do, yyyy")
    });

    const [dateError, setDateError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [disabledDates, setDisabledDates] = useState<Date[]>([]);
    const [guestCount, setGuestCount] = useState<number>(0);

    const userId = useSelector((state: any) => state.auth.user?.id);
    const guestCounts = useSelector((state: RootState) => state.limits.counts);
    const [selectedProperty, setSelectedProperty] = useState<string>('');
    const propertyNames = useSelector((state: RootState) => state.property.properties);

    useEffect(() => {
        dispatch(fetchProperties(userId));
    }, [dispatch]);

    useEffect(() => {
        if (dateRange?.from) {
            setDisplayDates(prev => ({
                ...prev,
                checkinDate: format(dateRange.from as Date, "MMM do, yyyy")
            }));
        }
        if (dateRange?.to) {
            setDisplayDates(prev => ({
                ...prev,
                checkoutDate: format(dateRange.to as Date, "MMM do, yyyy")
            }));
        }
    }, [dateRange]);

    const handleDateSelect = (range: DateRange | undefined) => {
        if (range) {
            setDateRange(range);
            setDateError(null);

            if (range.from && range.to) {
                updateDisabledDates(range);
            }
        }
    };

    const updateDisabledDates = (newRange: DateRange) => {
        if (!newRange.from || !newRange.to) return;

        const updatedDisabledDates = disabledDates.filter(date => {
            return date < newRange.from! || date > newRange.to!;
        });

        let currentDate = new Date(newRange.from);
        while (currentDate <= newRange.to) {
            updatedDisabledDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        setDisabledDates(updatedDisabledDates);
    };

    const handleGuestChange = (newCount: number) => {
        setGuestCount(newCount);
    };



    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await dispatch(fetchUserBookings(userId));
            handleClose();
        } catch (error) {
            console.error('Error updating booking:', error);
            if (error instanceof Error) {
                setDateError(error.message);
            } else {
                setDateError("An unexpected error occurred while updating the booking.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        setSelectedProperty(event.target.value as string);
    };

    return (
        <Modal
            open={openEvent}
            onClose={handleClose}
            aria-labelledby="create-booking-modal"
            aria-describedby="modal-to-create-booking"
        >
            <Box sx={style}>
                {isSubmitting && <Loader />}
                <Typography id="create-booking-modal" variant="h4" component="h2" mb={2}>
                    Create New Booking
                </Typography>
                <X className="absolute top-8 right-7 h-7 w-7 cursor-pointer" onClick={handleClose} />

                <hr />
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={3} ml={3}>
                        <FormControl fullWidth >
                            <InputLabel id="select-property-label">Select Property</InputLabel>
                            <Select
                                labelId="select-property-label"
                                value={selectedProperty}
                                label="Select Property"
                                onChange={(event: SelectChangeEvent<string>) => handleSelectChange(event)}
                                className={styles.refreshprop}
                                renderValue={(selected) => {
                                    return selected;
                                }}
                            >
                                {propertyNames?.map((property: any) => (
                                    <MenuItem key={property.id} value={property.name}>
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid item xs={5}>
                        <Box sx={dateBoxStyle}>
                            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: '500', fontSize: '14px', }}>
                                        Check-in
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        {displayDates.checkinDate}
                                    </Typography>
                                </Box>
                                <div className="vl"></div>
                                <Box>
                                    <Typography variant="caption" sx={{ fontWeight: '500', fontSize: '14px' }}>
                                        Check-out
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'gray' }}>
                                        {displayDates.checkoutDate}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className="multiple-select-container">
                            <MultipleSelect
                                showIcons={false}
                                initialCount={guestCount}
                                initialCounts={guestCounts}
                                onChange={handleGuestChange}
                                onClose={() => { }}
                            />
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className="property-calendar">
                        <DatePickerWithRange
                            onDateSelect={handleDateSelect}
                            initialRange={dateRange}
                            propertyColor="#e28f25"
                            isEditMode={true}
                        />
                    </Grid>
                </Grid>
                {dateError && (
                    <Typography color="error" mt={2}>
                        {dateError}
                    </Typography>
                )}
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Create Booking'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateBookingModal;