//@ts-nocheck
import * as React from "react"
import { addDays, format, addYears } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { saveBooking, clearBookingMessages, fetchBookings } from '../../store/slice/auth/bookingSlice';
import { useEffect } from "react";
import { RootState } from "@/store/reducers"


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
}:DatePickerWithRangeProps) {
  const today = new Date();
  const endDate = new Date(today.getFullYear() + 5, 11, 31);
  const checkInEndDate = addDays(today, 730);
  const checkOutEndDate = addYears(today, 5);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 0),
  });
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  const bookingState = useSelector((state: RootState) => state.bookings);
  const bookingError = bookingState?.error;
  const bookingSuccessMessage = bookingState?.successMessage;
  const isBookingLoading = bookingState?.isLoading;
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const seasonHolidays = useSelector(selectPropertySeasonHolidays);
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [startDateSelected, setStartDateSelected] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const currentBooking = useSelector((state: RootState) => state.bookings?.currentBooking);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  // const bookedDates = calendarData.bookedDates.map(date => new Date(date));
  const unavailableDates = calendarData.unavailableDates.map(date => new Date(date));
  const blueDates = calendarData.blueDates.map(date => new Date(date));

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

  useEffect(() => {
    if (bookingError) {
      setErrorMessage(bookingError);
    }
    if (bookingSuccessMessage) {
      console.log(bookingSuccessMessage);
      clearDates();
    }
    const timer = setTimeout(() => {
      dispatch(clearBookingMessages());
    }, 5000); 

    return () => clearTimeout(timer);
  }, [bookingError, bookingSuccessMessage, dispatch]);


  useEffect(() => {
    if (selectedPropertyDetails?.id) {
      dispatch(fetchPropertySeasonHoliday(selectedPropertyDetails.id));
    }
  }, [dispatch, selectedPropertyDetails?.id]);

  const clearDates = () => {
    setDate(undefined);
    setStartDate(null);
    setStartDateSelected(false);
    setErrorMessage(null);
    setIsCalendarOpen(false);
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
      //  (!meetsConsecutiveStayRule(date) && date.toDateString() !== today.toDateString());
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
    const previousCheckOutDate = bookedDates.reduce((latest, bookedDate) => {
      return bookedDate < date && bookedDate > latest ? bookedDate : latest;
    }, new Date(0));

    const nightsBetween = Math.floor(
      (date.getTime() - previousCheckOutDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return nightsBetween >= 5;
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      const newStartDate = range.from;
      let newEndDate = range.to;

      setSelectedYear(newStartDate.getFullYear());
  
      if (!meetsConsecutiveStayRule(newStartDate)) {
        setErrorMessage("Minimum 5 nights required between bookings");
        setDate(undefined);
        setStartDate(null);
        setStartDateSelected(false);
        if (onSelect) onSelect(undefined);
        return;
      }

      setStartDate(newStartDate);
      setStartDateSelected(true);

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
        setErrorMessage(`You don't have sufficient peak-season remaining nights to select this checkout date`);
        return;
      }

      if (offNights > selectedPropertyDetails.details[selectedYear]?.offRemainingNights) {
        setErrorMessage(`You don't have sufficient off-season remaining nights to select this checkout date`);
        return;
      }

      if (peakHolidayNights > selectedPropertyDetails.details[selectedYear]?.peakRemainingHolidayNights) {
        setErrorMessage(`You don't have sufficient peak-season holiday remaining nights to select this checkout date`);
        return;
      }

      if (offHolidayNights > selectedPropertyDetails.details[selectedYear]?.offRemainingHolidayNights) {
        setErrorMessage(`You don't have sufficient off-season holiday remaining nights to select this checkout date`);
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
          setErrorMessage(
            "Cannot select over booked dates. Please clear and try again."
          );
        } else {
          const nightsSelected =
            (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24);
          if (lastMinuteBooking) {
            if (nightsSelected < calendarData.bookingRules.lastMinuteBooking.minNights) {
              setErrorMessage(`Minimum ${calendarData.bookingRules.lastMinuteBooking.minNights} night(s) required for last-minute bookings`);
            } else if (nightsSelected > calendarData.bookingRules.lastMinuteBooking.maxNights) {
              setErrorMessage(`Maximum ${calendarData.bookingRules.lastMinuteBooking.maxNights} nights allowed for last-minute bookings`);
            } else if (selectedPropertyDetails.details[selectedYear]?.lastMinuteRemainingNights == 0) {
              setErrorMessage(`You don't have sufficient last-minute remaining nights to select this checkout date`);
            } else  {
              setErrorMessage(null);
            }
          } else {
            if (nightsSelected < calendarData.bookingRules.regularBooking.minNights) {
              setErrorMessage(`Minimum ${calendarData.bookingRules.regularBooking.minNights} nights required`);
            } else if (nightsSelected > selectedPropertyDetails?.details[selectedYear]?.maximumStayLength) {
              setErrorMessage('Your booking request has exceeded the maximum stay length');
            } else {
              setErrorMessage(null);
            }
          }
        }
        setStartDateSelected(false);
      } else {
        if (
          isDayBeforeBookedDate(newStartDate) ||
          isDayBeforeUnavailableDate(newStartDate)
        ) {
          setErrorMessage("Check out only");
        } else {
          setErrorMessage(null);
        }
      }

      const newDateRange = { from: newStartDate, to: newEndDate };
      setDate(newDateRange);
      if (onSelect) onSelect(newDateRange);

      // Keep the calendar open if only the start or end date is selected
      if (newStartDate && !newEndDate) {
        setIsCalendarOpen(true);
      } else if (newStartDate && newEndDate) {
        setIsCalendarOpen(false);
      }
    } else {
      setDate(undefined);
      setStartDate(null);
      setStartDateSelected(false);
      setErrorMessage(null);
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
    <div className={cn("gri flex flex-column", className)}>
      {/* First Calendar */}
      <div className="calendar">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
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
            {bookingError && <div className="text-red-600">{bookingError}</div>}
            {bookingSuccessMessage && <div className="text-green-600">{bookingSuccessMessage}</div>}
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
              color: #0560f2;
            }

          `}</style>
        <div className="flex items-center justify-between end-calendar">
        <div className='stay-length'>
            <div>Minimum Stay Length : {calendarData.bookingRules.regularBooking.minNights} Nights</div>
            <div>Maximum Stay Length : {selectedPropertyDetails?.details[selectedYear]?.maximumStayLength} Nights</div>
        </div>
        <div onClick={clearDates} className="btn-clear">
            Clear
          </div>

        </div>
        <div className="flex items-center justify-end ">
        </div>
      </div>

      /* Second Calendar */
      /* <div className="calendar2">  
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
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
              }}
              modifiersClassNames={{
                booked: 'booked-date',
                unavailable: 'unavailable-date',
                blue: 'blue-date',
              }}
            /> 
          <div className="error-msg-container ml-5 flex justify-start">
            <div className="error-msg">
              {errorMessage && (
                <div className="text-red-600">
                  {errorMessage}
                </div>
              )}
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
  
              .blue-date {
                background-color: #F4B76A;
                color: white;
              }
  
              .after-booked-date {
                color: gray;
                text-decoration: line-through;
              }
  
              .checkout-only-date {
                color: gray;
                text-decoration: line-through;
              }
            `}</style>
          <div className="flex items-center justify-end ml-5">
         
          <div className='stay-length'>
              <div className='misl2'>Minimum Stay Length : {calendarData.bookingRules.regularBooking.minNights} Nights</div>
              <div className='masl'>Maximum Stay Length : {calendarData.bookingRules.regularBooking.maxNights} Nights</div>
          </div>
          <Button onClick={clearDates} className="ml-auto mr-2">
              Clear
            </Button>
          </div>
          </PopoverContent>
        </Popover>
      </div>  */
    // </div>
  );
}