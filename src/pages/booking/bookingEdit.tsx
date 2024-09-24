import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import { DatePickerWithRange } from '@/components/calender';
import { DateRange } from 'react-day-picker';
import { modifyBooking } from '@/api';
import './bookingEdit.css'
import MultipleSelect from '@/components/guest-selector';
import { RootState } from '@/store/reducers';
import { initializeCounts, updateCount } from '@/store/slice/auth/propertyGuestSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 721,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface EditBookingModalProps {
  open: boolean;
  booking: any;
  handleClose: () => void;
  onUpdateBooking: (updatedBooking: any) => void;
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ open, booking, handleClose, onUpdateBooking }) => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [displayDates, setDisplayDates] = useState({ checkinDate: '', checkoutDate: '' });
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [guestCount, setGuestCount] = useState<number>(0);

  const guestCounts = useSelector((state: RootState) => state.limits.counts);

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
      checkinDate: range.from!.toLocaleDateString().split('T')[0], 
      checkoutDate: range.to!.toLocaleDateString().split('T')[0], 
    });
  };

  const handleGuestChange = (newCount: number) => {
    setGuestCount(newCount);
  };

  const handleGuestSelectorClose = () => {
    // Any additional logic you want to run when the guest selector closes
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
        property: { id: 6 },
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

      const response = await modifyBooking(booking.id, updatedBookingData);

      if (response.status === 200) {
        onUpdateBooking(updatedBookingData);
        handleClose();
      } else {
        throw new Error('Failed to update booking');
      }
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
          Modify Your Bookings
        </Typography>
        <hr />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              Booking Id
            </Typography>
            <Typography>
              {booking?.bookingId}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="subtitle1" fontWeight="bold">
              Property Name
            </Typography>
            <Typography>
              {booking?.property}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography className="multiple-select-container">
              <MultipleSelect
                isEditMode={true}
                initialCount={guestCount}
                initialCounts={guestCounts}
                onChange={handleGuestChange}
                onClose={handleGuestSelectorClose}
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
        {/* {dateError && (
          <Typography color="error" mt={2}>
            {dateError}
          </Typography>
        )} */}
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
