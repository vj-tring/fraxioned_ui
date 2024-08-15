import React, { useState } from 'react'
import './bookingbar.css'
import Region from '../region'
import PropertyCarousel from '../property-carousel'
import GuestSelector from '../guest-selector'
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from '../calender'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const BookingSearchBar: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'check-in' | 'check-out'>('check-in')

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && !range.to) {
      setActiveDate('check-out')
    } else if (range?.from && range?.to) {
      setActiveDate('check-in')
    }
  }

  const handleRegionClick = (type: 'check-in' | 'check-out') => {
    setIsCalendarOpen(true)
    setActiveDate(type)
  }

  return (
    <div className="MainCard">
      <div className="card">
        <PropertyCarousel />
        <div className="vl p-0"></div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div>
              <Region 
                label="Check In"
                date={dateRange?.from}
                onClick={() => handleRegionClick('check-in')}
                isActive={activeDate === 'check-in'}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="calendar-popover" align="start">
            <DatePickerWithRange 
              onSelect={handleDateSelect} 
              initialRange={dateRange}
              selectingFrom={activeDate === 'check-in'}
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
                onClick={() => handleRegionClick('check-out')}
                isActive={activeDate === 'check-out'}
              />
            </div>
          </PopoverTrigger>
        </Popover>
        <div className="vl"></div>
        <GuestSelector />
      </div>
    </div>
  ) 
}

export default BookingSearchBar