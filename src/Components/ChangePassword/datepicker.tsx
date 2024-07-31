//@ts-nocheck
"use client"

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
} from "@/components/ui/popover"

const bookedDates = [
  new Date(2024, 7, 20),
  new Date(2024, 7, 21),
  new Date(2024, 7, 22),
]

const unavailableDates = [
  new Date(2024, 8, 4),
  new Date(2024, 8, 5),
  new Date(2024, 8, 6),
]

const blueDates = [
  new Date(2024, 8, 12),
  new Date(2024, 8, 13),
  new Date(2024, 8, 14),
]

export function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const today = new Date()
  const endDate = new Date(today.getFullYear() + 2, 11, 31); 
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 0),
  })
  const [startDate, setStartDate] = React.useState<Date | null>(null)
  const [startDateSelected, setStartDateSelected] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Clears the selected dates and resets the state
  const clearDates = () => {
    setDate(undefined);
    setStartDate(null);
    setStartDateSelected(false);
    setErrorMessage(null);
  };

  // Checks if a date is a booked date
  const isBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate()
    );
  };

  // Checks if a date is an unavailable date
  const isUnavailableDate = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        date.getFullYear() === unavailableDate.getFullYear() &&
        date.getMonth() === unavailableDate.getMonth() &&
        date.getDate() === unavailableDate.getDate()
    );
  };

  // Checks if a date is the day before a booked date
  const isDayBeforeBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getFullYear() === bookedDate.getFullYear() &&
        date.getMonth() === bookedDate.getMonth() &&
        date.getDate() === bookedDate.getDate() - 1
    );
  };

  // Checks if a date is after a booked date
  const isAfterBookedDate = (date: Date) => {
    return bookedDates.some(
      (bookedDate) =>
        date.getTime() > bookedDate.getTime()
    );
  };

  // Disables dates based on various conditions
  const disableDates = (date: Date) => {
    if (startDateSelected && startDate) {
      const nextBookedDate = bookedDates.find(bookedDate => bookedDate > startDate);
      return isBookedDate(date) || isUnavailableDate(date) || date > endDate || 
             (nextBookedDate && date > nextBookedDate);
    } else {
      return date < today || date > endDate || isBookedDate(date) || isUnavailableDate(date);
    }
  }

  // Checks if a date range spans over any booked dates
  const isDateSpanningBookedDates = (start: Date, end: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate > start && bookedDate < end
    );
  }

  // Checks if a booking is a last-minute booking within 3 days
  const isLastMinuteBooking = (checkInDate: Date) => {
    const diffInDays = (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 3;
  }

  // Handles the change in selected date range and handles error messages
  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      const newStartDate = range.from;
      let newEndDate = range.to;
  
      setStartDate(newStartDate);
      setStartDateSelected(true);
  
      const lastMinuteBooking = isLastMinuteBooking(newStartDate);

      if (newEndDate) {
        const nextBookedDate = bookedDates.find(bookedDate => bookedDate > newStartDate);
        if (nextBookedDate && newEndDate > nextBookedDate) {
          newEndDate = undefined;
          setErrorMessage('Cannot select over booked dates. Please clear and try again.');
        } else {
          const nightsSelected = (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60 * 24);
          if (lastMinuteBooking) {
            if (nightsSelected < 1) {
              setErrorMessage('Minimum one night required for last-minute bookings');
            } else if (nightsSelected > 3) {
              setErrorMessage('Maximum three nights allowed for last-minute bookings');
            } else {
              setErrorMessage(null);
            }
          } else {
            if (nightsSelected < 3) {
              setErrorMessage('Minimum three nights required');
            } else if (nightsSelected >= 14) {
              setErrorMessage('Maximum nights exceeded');
            } else {
              setErrorMessage(null);
            }
          }
        }
        setStartDateSelected(false);
      } else {
        if (isDayBeforeBookedDate(newStartDate)) {
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
  
  return (
    <div className={cn("grid gap-2", className)}>
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
            modifiers={{
              booked: bookedDates,
              unavailable: unavailableDates,
              blue: blueDates,
              afterNextBooked: (date: Date) => {
                if (startDateSelected && startDate) {
                  const nextBookedDate = bookedDates.find(bookedDate => bookedDate > startDate);
                  return nextBookedDate && date > nextBookedDate;
                }
                return false;
              }
            }}
            modifiersClassNames={{
              booked: 'booked-date',
              unavailable: 'unavailable-date',
              blue: 'blue-date',
              afterNextBooked: 'after-booked-date'
            }}
          />
          <div className="flex items-center justify-end ml-5 mb-2">
            {errorMessage && (
              <div className="text-red-600 mr-4">
                {errorMessage}
              </div>
            )}
            <Button onClick={clearDates} className="ml-auto mr-2">
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>

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
    </div>
  )
}