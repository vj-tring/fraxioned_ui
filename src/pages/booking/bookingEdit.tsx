import React, { useEffect, useState, useRef } from 'react';
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
import { selectProperty } from '@/store/slice/auth/property-slice';
import { AppDispatch } from '@/store';
import Loader from '../../components/loader';

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
  const bookingRef = useRef(booking);

  const currentBookingDates = {
    from: new Date(booking.checkinDate),
    to: new Date(booking.checkoutDate)
  };

  useEffect(() => {
    if (booking?.propertyId) {
      dispatch(selectProperty(booking?.propertyId));
    }
  }, [dispatch, booking?.propertyId, userId]);

  useEffect(() => {
    if (open && bookingRef.current) {
      const initialDateRange = {
        from: new Date(bookingRef.current.checkinDate),
        to: new Date(bookingRef.current.checkoutDate),
      };
      setDateRange(initialDateRange);
      setDisplayDates({
        checkinDate: bookingRef.current.checkinDate,
        checkoutDate: bookingRef.current.checkoutDate,
      });
      setGuestCount(bookingRef.current.noOfGuests);
      dispatch(initializeCounts({
        Adults: bookingRef.current.noOfAdults,
        Children: bookingRef.current.noOfChildren,
        Pets: bookingRef.current.noOfPets
      }));
    }
  }, [open, dispatch]);

  useEffect(() => {
    bookingRef.current = booking;
  }, [booking]);

  useEffect(() => {
    if (updateStatus === "Booking updated successfully") {
      console.log('Update successful, closing modal');
      onUpdateSuccess(booking);
      handleClose();
    }
    if (updateError) {
      console.error('Update error:', updateError);
      setDateError(updateError);
    }
  }, [updateStatus, updateError, onUpdateSuccess, booking, handleClose]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM do, yyyy");
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    console.log('Date range selected:', range);
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
    console.log('Guest count changed:', newCount);
    setGuestCount(newCount);
  };

  const handleSubmit = async () => {
    console.log('Submitting booking update');
    setIsSubmitting(true);
    try {
      const updatedBookingData = {
        user: { id: bookingRef.current.user.id },
        property: { id: bookingRef.current?.propertyId },
        updatedBy: { id: bookingRef.current.user.id },
        noOfGuests: guestCount,
        isLastMinuteBooking: Boolean(bookingRef.current.isLastMinuteBooking),
        noOfAdults: guestCounts.Adults,
        noOfChildren: guestCounts.Children,
        noOfPets: guestCounts.Pets,
        notes: bookingRef.current.notes,
        confirmationCode: bookingRef.current.confirmationCode,
        cleaningFee: bookingRef.current.cleaningFee,
        petFee: bookingRef.current.petFee
      };

      if (dateRange && dateRange.from && dateRange.to) {
        updatedBookingData.checkinDate = dateRange.from.toISOString();
        updatedBookingData.checkoutDate = dateRange.to.toISOString();
      } else {
        updatedBookingData.checkinDate = bookingRef.current.checkinDate;
        updatedBookingData.checkoutDate = bookingRef.current.checkoutDate;
      }

      console.log('Updated booking data:', updatedBookingData);
      await dispatch(updateBooking({ bookingId: bookingRef.current.id, updatedData: updatedBookingData }));
      await dispatch(fetchUserBookings(userId));
      onUpdateSuccess(bookingRef.current);
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

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="edit-booking-modal"
      aria-describedby="modal-to-edit-booking"
    >
      <Box sx={style}>
        {isSubmitting && <Loader />}
        <Typography id="edit-booking-modal" variant="h4" component="h2" mb={2}>
          Modify Your Booking
        </Typography>
        <hr />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3} ml={3}>
            <Typography>
              # {bookingRef.current?.bookingId}
            </Typography>
            <Typography>
              {bookingRef.current?.property}
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
              propertyColor={''}    
              isEditMode={true}
              currentBookingDates={{
                from: new Date(booking.checkinDate),
                to: new Date(booking.checkoutDate)
              }}
              currentBookingId={booking.id}
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
