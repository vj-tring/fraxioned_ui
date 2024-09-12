//@ts-nocheck
import * as React from "react";
import { addDays, format, addYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./calender.css";
import calendarData from "./calendarData.json";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties, selectSelectedPropertyDetails } from "@/store/slice/auth/property-slice";
import { fetchPropertySeasonHoliday, selectPropertySeasonHolidays } from '@/store/slice/auth/propertySeasonHolidaySlice';
import {  clearBookingMessages, fetchBookings } from '../../store/slice/auth/bookingSlice';
import { useEffect } from "react";
import { RootState } from "@/store/reducers";
import { setDateRange, setErrorMessage, setIsCalendarOpen, clearDates, setStartDate, setStartDateSelected, setSelectedYear, setValidationMessage, clearValidationMessage, clearPartial } from "@/store/slice/datePickerSlice";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
  selectingFrom?: boolean;
  userId?: string;
}

export function DatePickerWithRange({
  className,
  onSelect,
  initialRange,
  selectingFrom,
  userId,
}: DatePickerWithRangeProps) {
  const today = new Date();
  const endDate = new Date(today.getFullYear() + 5, 11, 31);
  const checkInEndDate = addDays(today, 730);
  const checkOutEndDate = addYears(today, 5);

  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  const bookingState = useSelector((state: RootState) => state.bookings);
  // const bookingError = bookingState?.error;
  // const bookingSuccessMessage = bookingState?.successMessage;
  // const isBookingLoading = bookingState?.isLoading;
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const seasonHolidays = useSelector(selectPropertySeasonHolidays);
  const selectedYear = useSelector((state: RootState) => state.datePicker.selectedYear);
  const startDate = useSelector((state: RootState) => state.datePicker.startDate);
  const startDateSelected = useSelector((state: RootState) => state.datePicker.startDateSelected);
  const errorMessage = useSelector((state: RootState) => state.datePicker.errorMessage);
  // const isCalendarOpen = useSelector((state: RootState) => state.datePicker.isCalendarOpen);
  const dateRange = useSelector((state: RootState) => state.datePicker.dateRange);
  // const currentBooking = useSelector((state: RootState) => state.bookings?.currentBooking);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const validationMessage = useSelector((state: RootState) => state.datePicker.validationMessage);

  const unavailableDates = calendarData.unavailableDates.map(date => new Date(date));
  const blueDates = calendarData.blueDates.map(date => new Date(date));
  const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    console.log('Bookings in component:', bookings);
  }, [bookings]);

  useEffect(() => {
    dispatch(fetchProperties);
  }, [dispatch]); 

  useEffect(() => {
    dispatch(clearBookingMessages());
  }, [dispatch]);

  // useEffect(() => {
  //   if (bookingError) {
  //     dispatch(setErrorMessage(bookingError));
  //   }
  //   if (bookingSuccessMessage) {
  //     console.log(bookingSuccessMessage);
  //     dispatch(clearDates());
  //   }
  //   const timer = setTimeout(() => {
  //     dispatch(clearBookingMessages());
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [bookingError, bookingSuccessMessage, dispatch]);

  useEffect(() => {
    if (selectedPropertyDetails?.id) {
      dispatch(fetchPropertySeasonHoliday(selectedPropertyDetails.id));
    }
  }, [dispatch, selectedPropertyDetails?.id]);

  const clearDatesHandler = () => {
    dispatch(clearDates());
    if (onSelect) onSelect(undefined);
  };

  const bookedDates = React.useMemo(() => {
    if (!selectedPropertyDetails) return [];

    const dates = bookings
      .filter(booking => booking.property.id === selectedPropertyDetails.id)
      .flatMap(booking => {
        if (!booking.checkinDate || !booking.checkoutDate) return [];
        const start = new Date(booking.checkinDate);
        const end = new Date(booking.checkoutDate);
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      });
    console.log('Generated bookedDates for property:', selectedPropertyDetails.id, dates);
    return dates;
  }, [bookings, selectedPropertyDetails]);

  const isBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate()
    );
  };

  const isUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate()
    );
  };

  const isDayBeforeUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate() - 1
    );
  };

  const isAfterUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) => date.getTime() > unavailableDate.getTime()
    );
  };

  const isDayBeforeBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate() - 1
    );
  };

  const isAfterBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => date.getTime() > bookedDate.getTime()
    );
  };

  const isHolidayDate = (date: Date) => {
    return seasonHolidays.some(holiday =>
      date >= new Date(holiday.holiday.startDate) &&
      date <= new Date(holiday.holiday.endDate)
    );
  };

  const disableDates = (date: Date) => {
    if (startDateSelected && startDate) {
      const nextBookedDate = bookedDates.find(
        (bookedDate) => bookedDate > startDate
      );
      const nextUnavailableDate = unavailableDates.find(
        (unavailableDate) => unavailableDate > startDate
      );
      return (
        date < startDate ||
        isBookedDate(date) ||
        isUnavailableDate(date) ||
        date > checkOutEndDate ||
        (nextBookedDate && date > nextBookedDate) ||
        (nextUnavailableDate && date > nextUnavailableDate)
      );
    } else {
      return (
        (date < today && date.toDateString() !== today.toDateString()) ||
        date > checkInEndDate ||
        isBookedDate(date) ||
        isUnavailableDate(date)
      );
    }
  };

  const isDateSpanningBookedDates = (start: Date, end: Date) => {
    return bookedDates.some(
      (bookedDate) => bookedDate > start && bookedDate < end
    );
  };

  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays; 
  };
  const meetsConsecutiveStayRule = (date: Date) => {
    if (date.toDateString() === today.toDateString()) {
      return true;
    }
  
    const userBookings = bookings.filter(
      booking => booking.property.id === selectedPropertyDetails.id &&
                 booking.user.id === currentUser.id
    );
  
    if (userBookings.length === 0) {
      return true;
    }
  
    for (const booking of userBookings) {
      const checkOutDate = new Date(booking.checkoutDate);
      const checkInDate = new Date(booking.checkinDate);
  
      const daysSinceCheckout = Math.floor((date.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCheckout >= 0 && daysSinceCheckout < 4) {
        return false;
      }
  
      const daysBeforeCheckin = Math.floor((checkInDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysBeforeCheckin >= 0 && daysBeforeCheckin <= 5) {
        return false;
      }
  
      if (date >= checkInDate && date <= checkOutDate) {
        return false;
      }
    }
  
    return true;
  };

const isBookingTooCloseToCheckin = (checkinDate: Date) => {
  const checkinTime = new Date(checkinDate);
  checkinTime.setHours(selectedPropertyDetails.checkInTime, 0, 0, 0);

  const timeDifference = checkinTime.getTime() - today.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return hoursDifference < 24;
};

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      const newStartDate = range.from;
      let newEndDate = range.to;
  
      dispatch(setSelectedYear(newStartDate.getFullYear()));
  
      if (!meetsConsecutiveStayRule(newStartDate, newEndDate || newStartDate)) {
        dispatch(setErrorMessage('There must be at least 5 nights between your bookings at this property.'));
        dispatch(clearPartial());
        if (onSelect) onSelect(undefined);
        return;
      }
      dispatch(setStartDate(newStartDate));
      dispatch(setStartDateSelected(true));

      // if (newEndDate) {
      //   if (!meetsConsecutiveStayRule(newStartDate, newEndDate)) {
      //     dispatch(setErrorMessage('There must be at least 5 nights between your bookings at this property.'));
      //     dispatch(clearPartial());
      //     if (onSelect) onSelect(undefined);
      //     return;
      //   }
      // }

      if (isBookingTooCloseToCheckin(newStartDate)) {
        dispatch(setErrorMessage('Booking must be made at least 24 hours before the check-in time'));
        dispatch(clearPartial());
        if (onSelect) onSelect(undefined);
        return;
      }

      const lastMinuteBooking = isLastMinuteBooking(newStartDate);
      const peakSeasonStart = new Date(
        selectedPropertyDetails.peakSeasonStartDate
      );
      const peakSeasonEnd = new Date(selectedPropertyDetails.peakSeasonEndDate);
      let peakNights = 0;
      let offNights = 0;
      let peakHolidayNights = 0;
      let offHolidayNights = 0;
      for (let d = new Date(newStartDate); d < newEndDate; d.setDate(d.getDate() + 1)) {
        if (d >= peakSeasonStart && d <= peakSeasonEnd) {
          peakNights++;
        } else {
          offNights++;
        }
        if (isHolidayDate(d)) {
          if (d >= peakSeasonStart && d <= peakSeasonEnd) {
            peakHolidayNights++;
          } else {
            offHolidayNights++;
          }
        }
      }

      if (peakNights > selectedPropertyDetails.details[selectedYear]?.peakRemainingNights) {
        dispatch(setErrorMessage(`You don't have sufficient peak-season remaining nights to select this checkout date`));
        return;
      }

      if (offNights > selectedPropertyDetails.details[selectedYear]?.offRemainingNights) {
        dispatch(setErrorMessage(`You don't have sufficient off-season remaining nights to select this checkout date`));
        return;
      }

      if (peakHolidayNights > selectedPropertyDetails.details[selectedYear]?.peakRemainingHolidayNights) {
        dispatch(setErrorMessage(`You don't have sufficient peak-season holiday remaining nights to select this checkout date`));
        return;
      }

      if (offHolidayNights > selectedPropertyDetails.details[selectedYear]?.offRemainingHolidayNights) {
        dispatch(setErrorMessage(`You don't have sufficient off-season holiday remaining nights to select this checkout date`));
        return;
      }

      if (newEndDate) {
        const nextBookedDate = bookedDates.find(
          (bookedDate) => bookedDate > newStartDate
        );
        const nextUnavailableDate = unavailableDates.find(
          (unavailableDate) => unavailableDate > newStartDate
        );
        if (
          (nextBookedDate && newEndDate > nextBookedDate) ||
          (nextUnavailableDate && newEndDate > nextUnavailableDate)
        ) {
          newEndDate = undefined;
          dispatch(setErrorMessage(
            "Cannot select over booked dates. Please clear and try again."
          ));
        } else {
          const nightsSelected =
            (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24);
          if (lastMinuteBooking) {
            if (nightsSelected < calendarData.bookingRules.lastMinuteBooking.minNights) {
              dispatch(setErrorMessage(`Minimum ${calendarData.bookingRules.lastMinuteBooking.minNights} night(s) required for last-minute bookings`));
            } else if (nightsSelected > calendarData.bookingRules.lastMinuteBooking.maxNights) {
              dispatch(setErrorMessage(`Maximum ${calendarData.bookingRules.lastMinuteBooking.maxNights} nights allowed for last-minute bookings`));
            } else if (selectedPropertyDetails.details[selectedYear]?.lastMinuteRemainingNights == 0) {
              dispatch(setErrorMessage(`You don't have sufficient last-minute remaining nights to select this checkout date`));
            } else {
              dispatch(setErrorMessage(null));
            }
          } else {
            if (nightsSelected < calendarData.bookingRules.regularBooking.minNights) {
              dispatch(setErrorMessage(`Minimum ${calendarData.bookingRules.regularBooking.minNights} nights required`));
            } else if (nightsSelected > selectedPropertyDetails?.details[selectedYear]?.maximumStayLength) {
              dispatch(setErrorMessage('Your booking request has exceeded the maximum stay length'));
            } else {
              dispatch(setErrorMessage(null));
            }
          }
        }
        dispatch(setStartDateSelected(false));
      } else {
        if (
          isDayBeforeBookedDate(newStartDate) ||
          isDayBeforeUnavailableDate(newStartDate)
        ) {
          dispatch(setErrorMessage("Check out only"));
        } else {
          dispatch(setErrorMessage(null));
        }
      }

      const newDateRange = { from: newStartDate, to: newEndDate };
      dispatch(setDateRange(newDateRange));
      if (onSelect) onSelect(newDateRange);

      // Keep the calendar open if only the start or end date is selected
      if (newStartDate && !newEndDate) {
        dispatch(setIsCalendarOpen(true));
      } else if (newStartDate && newEndDate) {
        dispatch(setIsCalendarOpen(false));
      }
    } else {
      dispatch(clearDates());
      if (onSelect) onSelect(undefined);
    }
  };

  const customLocale = {
    code: calendarData.locale.code,
    localize: {
      day: (n) => calendarData.locale.days[n],
      month: (n) => calendarData.locale.months[n],
    },
    formatLong: {
      date: () => calendarData.locale.dateFormat,
    },
  };

  return (
    <div className={cn("gri flex flex-column calendar", className)}>
      <div>
     
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateChange}
          numberOfMonths={2}
          fromDate={today}
          toDate={endDate}
          disabled={disableDates}
          locale={customLocale}
          modifiers={{
            booked: bookedDates,
            unavailable: unavailableDates,
            blue: blueDates,
            holiday: seasonHolidays.map(h => ({
              from: new Date(h.holiday.startDate),
              to: new Date(h.holiday.endDate)
            })),
          }}
          modifiersClassNames={{
            booked: 'booked-date',
            unavailable: 'unavailable-date',
            blue: 'blue-date',
            holiday: 'holiday-date',
          }}
        />
      <div className="error-msg-container ml-5 flex justify-start">
          <div className="error-msg">
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {validationMessage && <div className="text-yellow-600">{validationMessage}</div>}
          </div>
        </div>
      </div>
      <style>{`
        .booked-date {
          color: gray;
          text-decoration: line-through;
        }
  
        .unavailable-date {
          color: gray;
          text-decoration: line-through;
        }
  
        .after-booked-date {
          color: gray;
          text-decoration: line-through;
        }
  
        .checkout-only-date {
          color: gray;
          text-decoration: line-through;
        }
  
        .holiday-date {
          color: blue !important;
        }
      `}</style>
      {/* <div className="flex items-center justify-between end-calendar">
        <div className='peak-length'>
            <div><b className="bold">Peak Nights : </b>{selectedPropertyDetails?.details[selectedYear || new Date().getFullYear()]?.peakRemainingNights || 'N/A'} Nights</div>
            <div><b className="bold">Off Nights : </b>{selectedPropertyDetails?.details[selectedYear || new Date().getFullYear()]?.offRemainingNights || 'N/A'} Nights</div>
          </div>
        </div> */}
        <div className="flex items-center justify-between end-calendar">
          <div className='stay-length'>
            <div><b className="bold">Minimum Stay :</b> {calendarData.bookingRules.regularBooking.minNights} Nights</div>
            <div><b className="bold">Maximum Stay :</b> {selectedPropertyDetails?.details[selectedYear || new Date().getFullYear()]?.maximumStayLength || 'N/A'} Nights</div>  
          </div>
          <div onClick={clearDatesHandler} className="btn-clear">
            Clear dates
          </div>
        </div>
    </div>
  );
}