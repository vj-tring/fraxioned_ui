import React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
// import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import PopoverCalendar from "../booking-search-bar/PopoverCalendar";

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
  guests,
  setGuests,
  onCheckAvailability,
}) => {
  return (
    <Card className="cards bg-light p-4 monsterrat">
      <Typography variant="h5" className="selectDate mb-2 monsterrat">
        Select Dates
      </Typography>
      <PopoverCalendar withBorder paddingTop />

      <TextField
        select
        label="Guests"
        fullWidth
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        className="mt-3 monsterrat GuestDrop"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <MenuItem key={num} value={num}>
            {num} Guest{num > 1 ? "s" : ""}
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
    </Card>
  );
};

export default DatePickerCard;
