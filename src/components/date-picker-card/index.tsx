import React, { useState } from 'react';
import { Card, Typography, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './date-picker.css';

interface DatePickerCardProps {
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: number;
  setCheckInDate: (date: Date | null) => void;
  setCheckOutDate: (date: Date | null) => void;
  setGuests: (count: number) => void;
  onCheckAvailability: () => void;
}

const DatePickerCard: React.FC<DatePickerCardProps> = ({
  checkInDate,
  checkOutDate,
  guests,
  setCheckInDate,
  setCheckOutDate,
  setGuests,
  onCheckAvailability
}) => {
  const [openDatePicker, setOpenDatePicker] = useState<'checkIn' | 'checkOut' | null>(null);

  // Handles the date change
  const handleDateChange = (date: Date | null, type: 'checkIn' | 'checkOut') => {
    if (type === 'checkIn') {
      setCheckInDate(date);
    } else {
      setCheckOutDate(date);
    }
    setOpenDatePicker(null);
  };

  return (
    <Card className="cards bg-light p-4 monsterrat">
      <Typography variant="h5" className='selectDate mb-2 monsterrat'>Select Dates</Typography>
      <Grid container spacing={2} className="DatePicker mt-2">
        <Grid item xs={12} sm={6}>
          <TextField
            label="Check in"
            placeholder="Add Date"
            fullWidth
            onClick={() => setOpenDatePicker('checkIn')}
            value={checkInDate ? checkInDate.toLocaleDateString() : ''}
            InputProps={{
              readOnly: true, // Make text field readonly to only open date picker
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Check Out"
            placeholder="Add Date"
            fullWidth
            onClick={() => setOpenDatePicker('checkOut')}
            value={checkOutDate ? checkOutDate.toLocaleDateString() : ''}
            InputProps={{
              readOnly: true, // Make text field readonly to only open date picker
            }}
          />
        </Grid>
      </Grid>

      <TextField
        select
        label="Guests"
        fullWidth
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}  
        className='mt-3 monsterrat'
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <MenuItem key={num} value={num}>
            {num} Guest{num > 1 ? 's' : ''}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        className="availability w-100 mt-3 monsterrat"
        onClick={onCheckAvailability}
      >
        Check Availability
      </Button>

      {/* Date Picker Dialogs */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {openDatePicker && (
          <DatePicker
            open={Boolean(openDatePicker)}
            onClose={() => setOpenDatePicker(null)}
            value={openDatePicker === 'checkIn' ? checkInDate : checkOutDate}
            onChange={(date) => handleDateChange(date, openDatePicker)}
            // renderInput={(params) => <TextField {...params} />}
          />
        )}
      </LocalizationProvider>
    </Card>
  );
};

export default DatePickerCard;
