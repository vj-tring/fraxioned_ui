import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import PopoverCalendar from "../booking-search-bar/PopoverCalendar";
import MultipleSelect from "../guest-selector";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { DateRange } from "react-day-picker";

interface CustomButtonProps {
  isAvailable: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const CustomButton = styled('button')<CustomButtonProps>(({ isAvailable }) => ({
  width: '100%',
  height: '50px',
  textAlign: 'center',
  borderRadius: '50px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 500,
  fontSize: '16px',
  color: '#fff',
  transition: 'background-color 0.3s',
  backgroundColor: isAvailable ? '#e8aa6c' : '#88CDD4',
  '&:hover': {
    backgroundColor: isAvailable ? '#e49f63' : '#7abec5',
  },
}));

interface DatePickerCardProps {
  guests: number;
  setGuests: (count: number) => void;
  onCheckAvailability: () => void;
  isAvailable: boolean;
  onNavigateToSummary: () => void;
  dateRange: DateRange | undefined;
  onDateRangeSelect: (range: DateRange | undefined) => void;
}

const DatePickerCard: React.FC<DatePickerCardProps> = ({
  onCheckAvailability,
  isAvailable,
  onNavigateToSummary,
  dateRange,
  onDateRangeSelect,
}) => {
  return (
    <Card className="cards bg-light p-4 monsterrat">
      <Typography variant="h5" className="selectDate mb-2 monsterrat">
        Select Dates
      </Typography>
      <PopoverCalendar withBorder  paddingTop />

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
