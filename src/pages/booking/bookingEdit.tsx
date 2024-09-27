import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import { DatePickerWithRange } from '@/components/calender';
import { DateRange } from 'react-day-picker';
import './bookingEdit.css'
import MultipleSelect from '@/components/guest-selector';
import { RootState } from '@/store/reducers';
import { initializeCounts } from '@/store/slice/auth/propertyGuestSlice';
import { format } from 'date-fns';
import { fetchUserBookings, updateBooking } from '@/store/slice/auth/bookingSlice';
import { fetchProperties, selectProperty } from '@/store/slice/auth/property-slice';
import { AppDispatch } from '@/store';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 731,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
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
};

interface EditBookingModalProps {
  open: boolean;
  booking: any;
  handleClose: () => void;
  onUpdateSuccess: (updatedBooking: any) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ open, booking, handleClose, onUpdateSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [displayDates, setDisplayDates] = useState({ checkinDate: '', checkoutDate: '' });
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(0);
  const userId = useSelector((state: any) => state.auth.user?.id);
  const guestCounts = useSelector((state: RootState) => state.limits.counts);
  const updateStatus = useSelector((state: RootState) => state.bookings.successMessage);
  const updateError = useSelector((state: RootState) => state.bookings.error);

  
  useEffect(() => {
    if (booking?.propertyId) {
      dispatch(selectProperty(booking?.propertyId));
    }
  }, [dispatch, booking?.propertyId, userId]);

  useEffect(() => {
    if (booking) {
      setDateRange({
        from: new Date(booking.checkinDate),
        to: new Date(booking.checkoutDate),
      });
      setDisplayDates({
        checkinDate: booking.checkinDate,
        checkoutDate: booking.checkoutDate,
      });
      setGuestCount(booking.noOfGuests);
      dispatch(initializeCounts({
        Adults: booking.noOfAdults,
        Children: booking.noOfChildren,
        Pets: booking.noOfPets
      }));
    }
  }, [booking, dispatch]);

  useEffect(() => {
    if (updateStatus === "Booking updated successfully") {
      onUpdateSuccess(booking);
      handleClose();
    }
    if (updateError) {
      setDateError(updateError);
    }
  }, [updateStatus, updateError, onUpdateSuccess, booking, handleClose]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM do, yyyy");
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setDateError(null);
    
    if (range?.from && range?.to) {
      updateDisabledDates(range);
      updateDisplayDates(range);
      setIsCalendarVisible(false);
    }
  }

  const updateDisabledDates = (newRange: DateRange) => {
    const updatedDisabledDates = disabledDates.filter(date => {
      return date < newRange.from! || date > newRange.to!;
    });
    
    let currentDate = new Date(newRange.from!);
    while (currentDate <= newRange.to!) {
      updatedDisabledDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    setDisabledDates(updatedDisabledDates);
  };

  const updateDisplayDates = (range: DateRange) => {
    setDisplayDates({
      checkinDate: formattedDate(range.from!), 
      checkoutDate: formattedDate(range.to!), 
    });
  };

  const handleGuestChange = (newCount: number) => {
    setGuestCount(newCount);
  };

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      setDateError("Please select both check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBookingData = {
        user: { id: booking.user.id },
        property: { id: booking?.propertyId },
        updatedBy: { id: booking.user.id },
        checkinDate: dateRange.from.toISOString(),
        checkoutDate: dateRange.to.toISOString(),
        noOfGuests: guestCount,
        isLastMinuteBooking: Boolean(booking.isLastMinuteBooking),
        noOfAdults: guestCounts.Adults,
        noOfChildren: guestCounts.Children,
        noOfPets: guestCounts.Pets,
        notes: booking.notes,
        confirmationCode: booking.confirmationCode,
        cleaningFee: booking.cleaningFee,
        petFee: booking.petFee
      };

      dispatch(updateBooking({ bookingId: booking.id, updatedData: updatedBookingData }));
      dispatch(fetchUserBookings(userId));


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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-booking-modal"
      aria-describedby="modal-to-edit-booking"
    >
      <Box sx={style}>
        <Typography id="edit-booking-modal" variant="h4" component="h2" mb={2}>
          Modify Your Booking
        </Typography>
        <hr />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3} ml={3}>
           <Typography>
           # {booking?.bookingId}
            </Typography>
            <Typography>
            {booking?.property}
            </Typography>
          </Grid>
          <Grid item xs={5}>
               <Box sx={dateBoxStyle}>
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '14px' }}>Check-in</Typography>
                  <Typography variant="body2" sx={{color: 'gray'}}>{displayDates.checkinDate}</Typography>
                </Box>
                <div className="vl"></div>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '14px' }}>Check-out</Typography>
                  <Typography variant="body2" sx={{color: 'gray'}} >{displayDates.checkoutDate}</Typography>
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
                onClose={() => {}}
              />
            </Typography>
          </Grid>
          <Grid item xs={12} className='property-calendar'>
            <DatePickerWithRange
              onSelect={handleDateSelect}
              initialRange={dateRange}
            />
          </Grid>
        </Grid>
        {dateError && (
          <Typography color="error" mt={2}>
            {dateError}
          </Typography>
        )}
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Booking'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditBookingModal;
