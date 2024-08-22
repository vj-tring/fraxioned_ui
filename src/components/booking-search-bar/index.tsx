//@ts-nocheck
import React, { useState } from 'react'
import './bookingbar.css'
import Region from '../region'
import PropertyCarousel from '../property-carousel'
import GuestSelector from '../guest-selector'
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from '../calender'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { maxWidth } from '@mui/system'

const BookingSearchBar: React.FC = () => {
  const userId = ''
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'check-in' | 'check-out' | null>(null)

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && !range.to) {
      setActiveDate('check-in')
    } else if (range?.to && range?.from) {
      setActiveDate('check-out')
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
        <div className="vl p-1"></div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} disableRipple>
          <PopoverTrigger asChild disableRipple >
            <div className='mr-2'>
              <Region 
                label="Check In"
                date={dateRange?.from}
                onClick={() => handleRegionClick('check-in')}
                isActive={isCalendarOpen && activeDate === 'check-in'}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="calendar-popover" align="start">
            <DatePickerWithRange 
              onSelect={handleDateSelect} 
              initialRange={dateRange}
              selectingFrom={activeDate === 'check-in'}
              userId={userId}
            />
          </PopoverContent>
        </Popover>
        <div className="vl p-1"></div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <div className='mr-2'>
              <Region 
                label="Check Out"
                date={dateRange?.to}
                onClick={() => handleRegionClick('check-out')}
                isActive={isCalendarOpen && activeDate === 'check-out'}
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