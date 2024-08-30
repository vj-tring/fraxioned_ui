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
import { saveBooking } from "@/store/slice/auth/bookingSlice";
import { selectSelectedPropertyDetails } from "@/store/slice/auth/property-slice";
import calendarData from "../calender/calendarData.json";
import { useSnackbar } from "../snackbar-provider";

const BookingSearchBar: React.FC = () => {
  const today = new Date();
  const userId = "";
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeDate, setActiveDate] = useState<"check-in" | "check-out" | null>(
    null
  );
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const bookingState = useSelector((state: RootState) => state.bookings);
  const isBookingLoading = bookingState?.isLoading;
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const counts = useSelector((state: RootState) => state.limits.counts);
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const { showSnackbar } = useSnackbar();

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

  const handleBookingSubmit = () => {
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
      noOfGuests: counts.Adults+counts.Children,
      noOfPets: counts.Pets,
      isLastMinuteBooking: isLastMinuteBooking(checkinDate),
      noOfAdults: counts.Adults,
      noOfChildren: counts.Children,
      noOfInfants: 0,
      notes: "Hi",
      confirmationCode: "",
      cleaningFee: 100,
      petFee: 0,
    };

    dispatch(saveBooking(bookingData));

    
    // if (bookingState.successMessage) {
      // showSnackbar(bookingState.successMessage, "success");
      navigate("/dashboard/booking-summary");
    // }
  };

  
  useEffect(() => {
    // if (!isBookingLoading && !bookingState.error) {
    //   setDateRange(undefined);
    // }

  

    // if (bookingState.error) {
    //   showSnackbar(bookingState.error, "error");

    //   if (bookingState.error.includes("Booking successfully created!")) {
    //     setErrorMessage(bookingState.error);
    //     navigate("/dashboard");
    //   } else {
    //     setErrorMessage(bookingState.error);
    //   }
    // }
  }, [
    isBookingLoading,
    bookingState.successMessage,
    bookingState.error,
    showSnackbar,
    navigate,
  ]);

  return (
    <div className="MainCard">
      <div className="card">
        <PropertyCarousel />
        <div className="vl p-2"></div>
        <Popover
          open={isCalendarOpen}
          onOpenChange={setIsCalendarOpen}
          disableRipple
        >
          <PopoverTrigger asChild disableRipple>
            <div>
              <Region
                label="Check In"
                date={dateRange?.from}
                onClick={() => handleRegionClick("check-in")}
                isActive={isCalendarOpen && activeDate === "check-in"}
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
        <div className="vl p-2"></div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div>
              <Region
                label="Check Out"
                date={dateRange?.to}
                onClick={() => handleRegionClick("check-out")}
                isActive={isCalendarOpen && activeDate === "check-out"}
              />
            </div>
          </PopoverTrigger>
        </Popover>
        <div className="vl"></div>
        <GuestSelector />
        <div className="vl"></div>
        <Button
          onClick={handleBookingSubmit}
          className="rounded-pill btn-book border-0"
          disabled={isBookingLoading}
        >
          Book Now
        </Button>
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default BookingSearchBar;
