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
import './calender.css';
import calendarData from './calendarData.json';

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date()
  const endDate = new Date(today.getFullYear() + 5 , 11, 31); 
  const checkInEndDate = addDays(today, 730);
  const checkOutEndDate = addYears(today, 5); 
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 0),
  })
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [startDateSelected, setStartDateSelected] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const bookedDates = calendarData.bookedDates.map(date => new Date(date));
  const unavailableDates = calendarData.unavailableDates.map(date => new Date(date));
  const blueDates = calendarData.blueDates.map(date => new Date(date));

  const clearDates = () => {
    setDate(undefined);
    setStartDate(null);
    setStartDateSelected(false);
    setErrorMessage(null);
  };

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
    (unavailableDate) =>
      date.getTime() > unavailableDate.getTime()
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
      (bookedDate) =>
        date.getTime() > bookedDate.getTime()
    );
  };

  const disableDates = (date: Date) => {
    if (startDateSelected && startDate) {
      const nextBookedDate = bookedDates.find(bookedDate => bookedDate > startDate);
      const nextUnavailableDate = unavailableDates.find(unavailableDate => unavailableDate > startDate);
      return date < startDate || isBookedDate(date) || isUnavailableDate(date) || date > checkOutEndDate || 
               (nextBookedDate && date > nextBookedDate) ||
               (nextUnavailableDate && date > nextUnavailableDate);
    } else {
      return (date < today && date.toDateString() !== today.toDateString()) || 
             date > checkInEndDate || 
             isBookedDate(date) || 
             isUnavailableDate(date) || 
             (!meetsConsecutiveStayRule(date) && date.toDateString() !== today.toDateString());
    }
  };

  const isDateSpanningBookedDates = (start: Date, end: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate > start && bookedDate < end
    );
  }

  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays = (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays;
  }

  const meetsConsecutiveStayRule = (date: Date) => {
    if (date.toDateString() === today.toDateString()) {
      return true;
    }
    const previousCheckOutDate = bookedDates.reduce((latest, bookedDate) => {
      return bookedDate < date && bookedDate > latest ? bookedDate : latest;
    }, new Date(0));
    
    const nightsBetween = Math.floor((date.getTime() - previousCheckOutDate.getTime()) / (1000 * 60 * 60 * 24));
    return nightsBetween >= 5;
  };

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      const newStartDate = range.from;
      let newEndDate = range.to;

      if (!meetsConsecutiveStayRule(newStartDate)) {
        setErrorMessage('Minimum 5 nights required between bookings');
        setDate(undefined);
        setStartDate(null);
        setStartDateSelected(false);
        return;
      }
  
      setStartDate(newStartDate);
      setStartDateSelected(true);
  
      const lastMinuteBooking = isLastMinuteBooking(newStartDate);

      if (newEndDate) {
        const nextBookedDate = bookedDates.find(bookedDate => bookedDate > newStartDate);
        const nextUnavailableDate = unavailableDates.find(unavailableDate => unavailableDate > newStartDate);
        if ((nextBookedDate && newEndDate > nextBookedDate) || (nextUnavailableDate && newEndDate > nextUnavailableDate)) {
          newEndDate = undefined;
          setErrorMessage('Cannot select over booked dates. Please clear and try again.');
        } else {
          const nightsSelected = (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24);
          if (lastMinuteBooking) {
            if (nightsSelected < calendarData.bookingRules.lastMinuteBooking.minNights) {
              setErrorMessage(`Minimum ${calendarData.bookingRules.lastMinuteBooking.minNights} night(s) required for last-minute bookings`);
            } else if (nightsSelected > calendarData.bookingRules.lastMinuteBooking.maxNights) {
              setErrorMessage(`Maximum ${calendarData.bookingRules.lastMinuteBooking.maxNights} nights allowed for last-minute bookings`);
            } else {
              setErrorMessage(null);
            }
          } else {
            if (nightsSelected < calendarData.bookingRules.regularBooking.minNights) {
              setErrorMessage(`Minimum ${calendarData.bookingRules.regularBooking.minNights} nights required`);
            } else if (nightsSelected > calendarData.bookingRules.regularBooking.maxNights) {
              setErrorMessage('Maximum nights exceeded');
            } else {
              setErrorMessage(null);
            }
          }
        }
        setStartDateSelected(false);
      } else {
        if (isDayBeforeBookedDate(newStartDate) || isDayBeforeUnavailableDate(newStartDate)) {
          setErrorMessage('Check out only');
        } else {
          setErrorMessage(null);
        }
      }
  
      setDate({ from: newStartDate, to: newEndDate });
    } else {
      setDate(undefined);
      setStartDate(null);
      setStartDateSelected(false);
      setErrorMessage(null);
    }
  }

  const customLocale = {
    code: calendarData.locale.code,
    localize: {
      day: (n) => calendarData.locale.days[n],
      month: (n) => calendarData.locale.months[n],
    },
    formatLong: {
      date: () => calendarData.locale.dateFormat,
    },
  }

  return (
    <div className={cn("grid gap-2 flex", className)}>
      {/* First Calendar */}
      <div className="calendar">
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
        <div className="flex items-center justify-end end-calendar">
        <div className='stay-length'>
            <div className='misl'>Minimum Stay Length : {calendarData.bookingRules.regularBooking.minNights} Nights</div>
            <div className='masl'>Maximum Stay Length : {calendarData.bookingRules.regularBooking.maxNights} Nights</div>
        </div>
        <div onClick={clearDates} className="ml-auto btn-clear">
            Clear
          </div>
        </div>
      </div>
      {/* Second Calendar */}
      {/* <div className="calendar2">  
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
      </div>  */}
    </div>
  )
}