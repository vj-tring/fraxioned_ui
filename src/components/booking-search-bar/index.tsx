//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./bookingbar.css";
import Region from "../region";
import PropertyCarousel from "../property-carousel";
import GuestSelector from "../guest-selector";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "../calender";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import {bookingSummary, saveBooking } from "@/store/slice/auth/bookingSlice";
import { selectSelectedPropertyDetails } from "@/store/slice/auth/property-slice";
import calendarData from "../calender/calendarData.json";
import { useSnackbar } from "../snackbar-provider";
import CustomizedSnackbar from "../customized-snackbar";

const BookingSearchBar: React.FC = () => {
  const today = new Date();
  const userId = "";
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeDate, setActiveDate] = useState<"check-in" | "check-out" | null>(
    null
  );
  const bookingdetails = useSelector((state: RootState) => state.datePicker.dateRange);

  
  useEffect(() => {
    if (bookingdetails) {
        setDateRange({
            from: bookingdetails.from,
            to: bookingdetails.to
        });
    }
}, [bookingdetails]);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const bookingState = useSelector((state: RootState) => state.bookings);
  const isBookingLoading = bookingState?.isLoading;
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const counts = useSelector((state: RootState) => state.limits.counts);
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const calendarError = useSelector((state: RootState) => state.datePicker.errorMessage);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" >("error");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "error" | "info" | "warning" = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && !range.to) {
      setActiveDate("check-in");
    } else if (range?.from && range?.to) {
      setActiveDate("check-out");
    }
  };

  const handleRegionClick = (type: "check-in" | "check-out") => {
    setIsCalendarOpen(true);
    setActiveDate(type);
  };

  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays;
  };

  const handleBookingSubmit = async () => {
    if (calendarError) {
      showSnackbar("You can't book the date you have selected. Please choose a valid date range.", "error");
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      showSnackbar("Please select both check-in and check-out dates.");
      return;
    }

    if (!currentUser) {
      showSnackbar("User is not logged in. Please log in to make a booking.");
      return;
    }

    if (!selectedPropertyDetails) {
      showSnackbar("No property selected. Please select a property to book.");
      return;
    }

    const checkinDate = new Date(
      Date.UTC(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        12,
        0,
        0
      )
    );

    const checkoutDate = new Date(
      Date.UTC(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        12,
        0,
        0
      )
    );

    const bookingData = {
      user: { id: currentUser.id },
      property: { id: selectedPropertyDetails.id },
      createdBy: { id: currentUser.id },
      checkinDate: checkinDate.toISOString(),
      checkoutDate: checkoutDate.toISOString(),
      noOfGuests: counts.Adults + counts.Children,
      noOfPets: counts.Pets,
      isLastMinuteBooking: isLastMinuteBooking(checkinDate),
      noOfAdults: counts.Adults,
      noOfChildren: counts.Children,
      notes: "",
    };

    try {
      console.log('Submitting booking data:', bookingData);
      const result = await dispatch(bookingSummary(bookingData)).unwrap();

      if (result) {
        console.log('Booking summary created successfully:', result);

        // Update the booking data with the response values
        const updatedBookingData = {
          ...bookingData,
          season: result.season,
          cleaningFee: result.cleaningFee,
          petFee: result.petFee,
          totalAmountDue: result.totalAmountDue,
        };

        await dispatch(saveBooking(updatedBookingData));
        navigate("/home/booking-summary");
      }
    } catch (error) {
      console.error('Error during booking process:', error);
      showSnackbar("An error occurred while processing your booking. Please try again.", "error");
    }
  };


  return (
    <div className="MainCard">
      <div className="position">
        <div className="bar">
          <PropertyCarousel />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="check-in">
                <p>Check in</p>
                <input
                  type="text"
                  placeholder="Add dates"
                  value={dateRange?.from ? dateRange.from.toLocaleDateString() : ""}
                  readOnly
                  onClick={() => handleRegionClick("check-in")}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="calendar-popover" align="start">
              <DatePickerWithRange
                onSelect={handleDateSelect}
                initialRange={dateRange}
                selectingFrom={activeDate === "check-in"}
                userId={userId}
              />
            </PopoverContent>
          </Popover>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="check-out">
                <p>Check out</p>
                <input
                  type="text"
                  placeholder="Add dates"
                  value={dateRange?.to ? dateRange.to.toLocaleDateString() : ""}
                  readOnly
                  onClick={() => handleRegionClick("check-out")}
                />
              </div>
            </PopoverTrigger>
          </Popover>
            <div className="guests">
            <GuestSelector/>
          </div>
          <button
                onClick={handleBookingSubmit}
                className="rounded-pill btn-book border-0"
                disabled={isBookingLoading}
              >
                Book Now
          </button>
        </div>
      </div>
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
};

export default BookingSearchBar;