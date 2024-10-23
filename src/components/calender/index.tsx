import * as React from "react";
import { addDays, format, addYears } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/utils";
import { Calendar } from "@/components/ui/calendar";
import "./calender.css";
import calendarData from "./calendarData.json";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProperties,
  selectSelectedPropertyDetails,
} from "@/store/slice/auth/property-slice";
import {
  fetchPropertySeasonHoliday,
  selectPropertySeasonHolidays,
} from "@/store/slice/auth/propertySeasonHolidaySlice";
import {
  clearBookingMessages,
  fetchBookings,
} from "../../store/slice/auth/bookingSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/store/reducers";
import {
  setDateRange,
  setErrorMessage,
  setIsCalendarOpen,
  clearDates,
  setStartDate,
  setStartDateSelected,
  setSelectedYear,
  setValidationMessage,
  clearValidationMessage,
  clearPartial,
} from "@/store/slice/datepicker";
import { AppDispatch } from "@/store";
import LastMinuteBookingDialog from "../last-minute-dialog";
import { BarChart2, CalendarArrowUp, CalendarDays, Clock, Crown, Moon, Mountain, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onDateSelect?: (range: DateRange | undefined) => void;
  initialRange?: DateRange;
  selectingFrom?: boolean;
  userId?: string;
  fetchBookingsOnMount?: boolean;
  externalBookedDates?: Date[];
  hideBookedDates?: boolean;
  propertyColor: string;
  disableStrikethrough?: boolean;
  showEndCalendar?: boolean;
  isViewOnly?: boolean;
  currentBookingDates?: { from: Date; to: Date };
  isEditMode?: boolean;
  currentBookingId?: string;
}

export function DatePickerWithRange({
  className,
  onDateSelect,
  showEndCalendar = true,
  fetchBookingsOnMount = false,
  externalBookedDates = [],
  hideBookedDates = false,
  propertyColor,
  disableStrikethrough = false,
  isViewOnly,
  isEditMode = false,
  currentBookingDates,
  currentBookingId,
}: DatePickerWithRangeProps) {
  const today = new Date();
  const endDate = new Date(today.getFullYear() + 5, 11, 31);
  const checkInEndDate = addDays(today, 730);
  const checkOutEndDate = addYears(today, 5);

  const dispatch = useDispatch<AppDispatch>();
  const bookings = useSelector((state: RootState) => state.bookings.bookings);
  // const bookingError = bookingState?.error;
  // const bookingSuccessMessage = bookingState?.successMessage;
  // const isBookingLoading = bookingState?.isLoading;
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const seasonHolidays = useSelector(selectPropertySeasonHolidays);
  const selectedYear = useSelector(
    (state: RootState) => state.datePicker.selectedYear
  );
  const startDate = useSelector(
    (state: RootState) => state.datePicker.startDate
  );
  const startDateSelected = useSelector(
    (state: RootState) => state.datePicker.startDateSelected
  );
  const errorMessage = useSelector(
    (state: RootState) => state.datePicker.errorMessage
  );
  // const isCalendarOpen = useSelector((state: RootState) => state.datePicker.isCalendarOpen);
  const dateRange = useSelector(
    (state: RootState) => state.datePicker.dateRange
  );
  // const currentBooking = useSelector((state: RootState) => state.bookings?.currentBooking);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const validationMessage = useSelector(
    (state: RootState) => state.datePicker.validationMessage
  );
  const [isLastMinutePopupOpen, setIsLastMinutePopupOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | null>(null);
  const unavailableDates = calendarData.unavailableDates.map(
    (date) => new Date(date)
  );
  const blueDates = calendarData.blueDates.map((date) => new Date(date));
  const [isRegularBookingSelected, setIsRegularBookingSelected] =
    useState(false);

  useEffect(() => {
    if (fetchBookingsOnMount) {
      dispatch(fetchBookings());
    }
  }, [dispatch, fetchBookingsOnMount]);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
  }, [bookings]);

  useEffect(() => {
    dispatch(fetchProperties);
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearBookingMessages());
  }, [dispatch]);



  useEffect(() => {
    if (selectedPropertyDetails?.id) {
      dispatch(fetchPropertySeasonHoliday(selectedPropertyDetails.id));
    }
  }, [dispatch, selectedPropertyDetails?.id]);

  const clearDatesHandler = () => {
    dispatch(clearDates());
    setIsRegularBookingSelected(false);
    setTempDateRange(null); // Reset tempDateRange
    setIsLastMinutePopupOpen(false);
    if (onDateSelect) onDateSelect(undefined);
  };

  const bookedDates = React.useMemo(() => {
    if (externalBookedDates.length > 0) {
      return externalBookedDates;
    }
    if (!selectedPropertyDetails || !Array.isArray(bookings)) return [];

    const dates = bookings
      .filter(
        (booking) =>
          String(booking.property.id) === String(selectedPropertyDetails.id) &&
          !booking.isCancelled &&
          String(booking.id) !== String(currentBookingId)
      )
      .flatMap((booking) => {
        if (!booking.checkinDate || !booking.checkoutDate) return [];
        const start = new Date(booking.checkinDate);
        const end = new Date(booking.checkoutDate);
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      });
    return dates;
  }, [bookings, selectedPropertyDetails, externalBookedDates]);

  const isBookedDate = (date: Date) => {
    if (hideBookedDates) return false;

    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate()
    );
  };

  const isCurrentBookingDate = (date: Date) => {
    if (!isEditMode || !currentBookingDates) return false;
    return date >= currentBookingDates.from && date <= currentBookingDates.to;
  };

  // const isCurrentBookingDate = (date: Date) => {
  //   if (!isEditMode ||!currentBookingId || !currentBookingDates) return false;
  //   return date >= currentBookingDates.from && date <= currentBookingDates.to;
  // };

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

  const isDayBeforeBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate() - 1
    );
  };

  const isHolidayDate = (date: Date) => {
    return seasonHolidays.some(
      (holiday) =>
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

  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays;
  };
  const meetsConsecutiveStayRule = (startDate: Date, endDate: Date) => {
    if (startDate.toDateString() === today.toDateString()) {
      return true;
    }

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return true;
    }

    const userBookings = bookings.filter(
      (booking) =>
        booking.property.id === selectedPropertyDetails.id &&
        booking.user.id === currentUser.id &&
        !booking.isCancelled &&
        !currentBookingDates
    );

    if (userBookings.length === 0) {
      return true;
    }

    for (const booking of userBookings) {
      const checkOutDate = new Date(booking.checkoutDate);
      const checkInDate = new Date(booking.checkinDate);

      // Calculate days since previous checkout date for the start date
      const daysSinceCheckoutStart = Math.floor(
        (startDate.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const daysSinceCheckoutEnd = Math.floor(
        (endDate.getTime() - checkOutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (
        (daysSinceCheckoutStart >= 0 && daysSinceCheckoutStart < 4) ||
        (daysSinceCheckoutEnd >= 0 && daysSinceCheckoutEnd < 4)
      ) {
        return false;
      }

      const daysBeforeCheckinStart = Math.floor(
        (checkInDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const daysBeforeCheckinEnd = Math.floor(
        (checkInDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (
        (daysBeforeCheckinStart >= 0 && daysBeforeCheckinStart <= 5) ||
        (daysBeforeCheckinEnd >= 0 && daysBeforeCheckinEnd <= 5)
      ) {
        return false;
      }

      // Ensure the selected range does not overlap with an existing booking
      if (
        (startDate >= checkInDate && startDate <= checkOutDate) ||
        (endDate >= checkInDate && endDate <= checkOutDate)
      ) {
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
        dispatch(
          setErrorMessage(
            "There must be at least 5 nights between your bookings at this property."
          )
        );
        dispatch(clearPartial());
        if (onDateSelect) onDateSelect(undefined);
        return;
      }
      dispatch(setStartDate(newStartDate));
      dispatch(setStartDateSelected(true));

      if (isBookingTooCloseToCheckin(newStartDate)) {
        dispatch(
          setErrorMessage(
            "Booking must be made at least 24 hours before the check-in time"
          )
        );
        dispatch(clearPartial());
        if (onDateSelect) onDateSelect(undefined);
        return;
      }

      const lastMinuteBooking = isLastMinuteBooking(newStartDate);

      if (lastMinuteBooking && !isRegularBookingSelected) {
        if (!newEndDate) {
          setTempDateRange({ from: newStartDate, to: undefined });
          setIsLastMinutePopupOpen(true);
          return;
        } else {
          const nightsSelected =
            (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24);
          if (
            nightsSelected >
            calendarData.bookingRules.lastMinuteBooking.maxNights
          ) {
            dispatch(
              setErrorMessage(
                `Maximum ${calendarData.bookingRules.lastMinuteBooking.maxNights} nights allowed for last-minute bookings`
              )
            );
            return;
          }
        }
      }

      const peakSeasonStart = new Date(
        selectedPropertyDetails.peakSeasonStartDate
      );
      const peakSeasonEnd = new Date(selectedPropertyDetails.peakSeasonEndDate);
      let peakNights = 0;
      let offNights = 0;
      let peakHolidayNights = 0;
      let offHolidayNights = 0;

      if (newEndDate) {
        for (
          let d = new Date(newStartDate);
          d < newEndDate;
          d.setDate(d.getDate() + 1)
        ) {
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

        if (
          peakNights >
          selectedPropertyDetails.details[selectedYear]?.peakRemainingNights
        ) {
          dispatch(
            setErrorMessage(
              `You don't have sufficient peak-season remaining nights to select this checkout date`
            )
          );
          return;
        }

        if (
          offNights >
          selectedPropertyDetails.details[selectedYear]?.offRemainingNights
        ) {
          dispatch(
            setErrorMessage(
              `You don't have sufficient off-season remaining nights to select this checkout date`
            )
          );
          return;
        }

        if (
          peakHolidayNights >
          selectedPropertyDetails.details[selectedYear]
            ?.peakRemainingHolidayNights
        ) {
          dispatch(
            setErrorMessage(
              `You don't have sufficient peak-season holiday remaining nights to select this checkout date`
            )
          );
          return;
        }

        if (
          offHolidayNights >
          selectedPropertyDetails.details[selectedYear]
            ?.offRemainingHolidayNights
        ) {
          dispatch(
            setErrorMessage(
              `You don't have sufficient off-season holiday remaining nights to select this checkout date`
            )
          );
          return;
        }
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
          dispatch(
            setErrorMessage(
              "Cannot select over booked dates. Please clear and try again."
            )
          );
        } else {
          const nightsSelected =
            (newEndDate.getTime() - newStartDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (lastMinuteBooking && !isRegularBookingSelected) {
            if (
              nightsSelected <
              calendarData.bookingRules.lastMinuteBooking.minNights
            ) {
              dispatch(
                setErrorMessage(
                  `Minimum ${calendarData.bookingRules.lastMinuteBooking.minNights} nights required for last-minute bookings`
                )
              );
            } else if (
              nightsSelected >
              calendarData.bookingRules.lastMinuteBooking.maxNights
            ) {
              dispatch(
                setErrorMessage(
                  `Maximum ${calendarData.bookingRules.lastMinuteBooking.maxNights} nights allowed for last-minute bookings`
                )
              );
            } else if (
              selectedPropertyDetails.details[selectedYear]
                ?.lastMinuteRemainingNights < nightsSelected
            ) {
              dispatch(
                setErrorMessage(
                  `You don't have sufficient last-minute remaining nights to select this checkout date`
                )
              );
            } else {
              dispatch(setErrorMessage(null));
              const newDateRange = {
                from: newStartDate,
                to: newEndDate,
                isLastMinuteBooking: true,
              };
              dispatch(setDateRange(newDateRange));
              if (onDateSelect) onDateSelect(newDateRange);
            }
          } else {
            if (
              nightsSelected <
              calendarData.bookingRules.regularBooking.minNights
            ) {
              dispatch(
                setErrorMessage(
                  `Minimum ${calendarData.bookingRules.regularBooking.minNights} nights required`
                )
              );
            } else if (
              nightsSelected >
              selectedPropertyDetails?.details[selectedYear]?.maximumStayLength
            ) {
              dispatch(
                setErrorMessage(
                  "Your booking request has exceeded the maximum stay length"
                )
              );
            } else {
              dispatch(setErrorMessage(null));
              const newDateRange = {
                from: newStartDate,
                to: newEndDate,
                isLastMinuteBooking: false,
              };
              dispatch(setDateRange(newDateRange));
              if (onDateSelect) onDateSelect(newDateRange);
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
        const newDateRange = {
          from: newStartDate,
          to: newEndDate,
          isLastMinuteBooking: lastMinuteBooking && !isRegularBookingSelected,
        };
        dispatch(setDateRange(newDateRange));
        if (onDateSelect) onDateSelect(newDateRange);
      }

      if (newStartDate && !newEndDate) {
        dispatch(setIsCalendarOpen(true));
      } else if (newStartDate && newEndDate) {
        dispatch(setIsCalendarOpen(false));
      }
    } else {
      dispatch(clearDates());
      setIsRegularBookingSelected(false);
      if (onDateSelect) onDateSelect(undefined);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "d MMM");
  };

  const handleLastMinuteChoice = (choice: "lastMinute" | "regular") => {
    setIsLastMinutePopupOpen(false);
    setIsRegularBookingSelected(choice === "regular");
    if (tempDateRange?.from) {
      const isLastMinute = choice === "lastMinute";
      dispatch(
        setDateRange({
          from: tempDateRange.from,
          to: undefined,
          isLastMinuteBooking: isLastMinute,
        })
      );
      dispatch(setIsCalendarOpen(true));
    }
  };

  return (
    <div className={cn("gri flex flex-column calendar", className)}>
      <div className="calendarDiv">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange || currentBookingDates}
          onSelect={isViewOnly ? undefined : handleDateChange}
          isViewOnly={true}
          numberOfMonths={2}
          fromDate={today}
          toDate={endDate}
          disabled={disableDates}
          locale={customLocale}
          modifiers={{
            booked: bookedDates,
            unavailable: unavailableDates,
            blue: blueDates,
            holiday: seasonHolidays.map((h) => ({
              from: new Date(h.holiday.startDate),
              to: new Date(h.holiday.endDate),
            })),
            currentBooking:
              isEditMode && currentBookingDates
                ? [
                    {
                      from: currentBookingDates.from,
                      to: currentBookingDates.to,
                    },
                  ]
                : [],
          }}
          modifiersClassNames={{
            booked: disableStrikethrough
              ? "booked-date-no-strike"
              : "booked-date",
            unavailable: "unavailable-date",
            blue: "blue-date",
            holiday: "holiday-date",
            currentBooking: "current-booking-date",
            selectable: "selectable-date",
          }}
        />
        <div className="error-msg-container ml-5 flex justify-start">
          <div className="error-msg">
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            {validationMessage && (
              <div className="text-yellow-600">{validationMessage}</div>
            )}
          </div>
        </div>
      </div>
      <style>{`
         .booked-date {
          color: gray;
          text-decoration: line-through;
        }



.selectable-date {
  text-decoration: none !important;
}

        .booked-date-no-strike {
          color: white;
          // background-color: ${propertyColor} !important;
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
      {showEndCalendar && (
        <div className="flex items-center justify-between end-calendar">
          <div className="stay-length">
          <div className="flex items-center space-x-4">
            <Moon className="h-6 w-6 text-orange-300" />
            <div className="info">
              <p className="text-m leading-none">Nights</p>
              <p className="text-l font-bold">Peak: {selectedPropertyDetails?.details[
                selectedYear || new Date().getFullYear()
              ]?.peakRemainingNights || "0"}
              <span className="text-gray-500 font-normal"> | </span> 
               Off: {selectedPropertyDetails?.details[
                selectedYear || new Date().getFullYear()
              ]?.offRemainingNights || "0"}
              </p>
            </div>
            </div>
          <div className="flex items-center space-x-4 pl-4">
            <CalendarArrowUp className="h-6 w-6 text-orange-300" />
              <div className="info">
              <p className="text-sm font-medium leading-none">Peak Season</p> 
              <p className="text-l font-bold">
              {formatDate(
                selectedPropertyDetails?.details[
                  selectedYear || new Date().getFullYear()
                ]?.peakSeasonStartDate
              )}{" "}
              -{" "}
              {formatDate(
                selectedPropertyDetails?.details[
                  selectedYear || new Date().getFullYear()
                ]?.peakSeasonEndDate
              )}
              {" "}
              </p>
            </div>
            </div>
            <div className="flex items-center space-x-4 pl-4">
            <Clock className="h-6 w-6 text-orange-300" />
            <div className="info">
              <p className="text-sm font-medium leading-none">Max Stay</p>
              <p className="text-l font-bold">{selectedPropertyDetails?.details[
                selectedYear || new Date().getFullYear()
              ]?.maximumStayLength || "0"} Nights</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className="text-sm cursor-pointer hover:bg-gray-100"
            onClick={clearDatesHandler}
          >
            Clear dates
          </Badge>
        </div>
          
        </div>
      )}
      <LastMinuteBookingDialog
        isOpen={isLastMinutePopupOpen}
        onClose={() => setIsLastMinutePopupOpen(false)}
        onChoice={handleLastMinuteChoice}
      />
    </div>
  );
}
