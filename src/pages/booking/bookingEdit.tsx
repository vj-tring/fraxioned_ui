import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Grid, Popover } from '@mui/material';
import { DatePickerWithRange } from '@/components/calender';
import { DateRange } from 'react-day-picker';
import { modifyBooking } from '@/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface EditBookingModalProps {
  open: boolean;
  booking: any;
  handleClose: () => void;
  
}

const EditBookingModal: React.FC<EditBookingModalProps> = ({ open, booking, handleClose }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setDateRange({
        from: new Date(booking.checkinDate),
        to: new Date(booking.checkoutDate),
      });
    }
  }, [booking]);

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    setDateError(null);
  }

  const handleCalendarOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCalendarClose = () => {
    setAnchorEl(null);
  };

  const isCalendarOpen = Boolean(anchorEl);

  const handleSubmit = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      setDateError("Please select both check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedBookingData = {
        user: { id: booking.user.id},
        property: { id: 2},
        updatedBy: { id: booking.user.id },
        checkinDate: dateRange.from.toISOString(),
        checkoutDate: dateRange.to.toISOString(),
        noOfGuests: booking.noOfGuests,
        noOfPets: booking.noOfPets,
        isLastMinuteBooking: Boolean(booking.isLastMinuteBooking),
        noOfAdults: booking.noOfAdults,
        noOfChildren: booking.noOfChildren,
        notes: booking.notes,
        confirmationCode: booking.confirmationCode,
        cleaningFee: booking.cleaningFee,
        petFee: booking.petFee
      };

      const response = await modifyBooking(booking.id, updatedBookingData);

      if (response.status === 200) {
        handleClose();
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      if (error instanceof Error) {
        setDateError(error.message);
      } else if (typeof error === 'object' && error !== null) {
        const apiError = error as { response?: { data?: { message?: string | string[] } } };
        const errorMessages = apiError.response?.data?.message;
        if (Array.isArray(errorMessages)) {
          setDateError(errorMessages.join(', '));
        } else if (typeof errorMessages === 'string') {
          setDateError(errorMessages);
        } else {
          setDateError("An unexpected error occurred while updating the booking.");
        }
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
        <Typography id="edit-booking-modal" variant="h6" component="h2" mb={2}>
          Edit Booking
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="BookingID"
              value={booking?.id || ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Property"
              value={booking?.property || ''}
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Check In"
              value={dateRange?.from ? dateRange.from.toLocaleDateString() : 'Add Dates'}
              InputProps={{ readOnly: true }}
              onClick={handleCalendarOpen}
              error={!!dateError}
              helperText={dateError}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Check Out"
              value={dateRange?.to ? dateRange.to.toLocaleDateString() : 'Add Dates'}
              InputProps={{ readOnly: true }}
              onClick={handleCalendarOpen}
              error={!!dateError}
            />
          </Grid>
        </Grid>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="secondary" onClick={handleClose} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Booking'}
          </Button>
        </Box>
        <Popover
          open={isCalendarOpen}
          anchorEl={anchorEl}
          onClose={handleCalendarClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableRestoreFocus
        >
          <DatePickerWithRange
            onSelect={handleDateSelect}
            initialRange={dateRange}
          />
        </Popover>
      </Box>
    </Modal>
  );
};

export default EditBookingModal;