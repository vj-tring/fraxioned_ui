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
      <Box sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        '& .MuiButton-root': {
          width: '100%',
          justifyContent: 'flex-start',
          padding: '10px',
          '& .MuiButton-startIcon': {
            marginRight: '10px',
          },
        },
      }}>
        <PopoverCalendar
          dateRange={dateRange}
          onSelect={onDateRangeSelect}
          paddingTop
        />
        <Divider sx={{ borderColor: '#666' }} />
        <MultipleSelect showIcons={false} />
      </Box>

      <AnimatePresence mode="wait"> 
        <motion.div
          key={isAvailable ? 'book' : 'check'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CustomButton
            className="mt-3"
            onClick={isAvailable ? onNavigateToSummary : onCheckAvailability}
            isAvailable={isAvailable}
          >
            {isAvailable ? "Book Now" : "Check Availability"}
          </CustomButton>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default DatePickerCard;