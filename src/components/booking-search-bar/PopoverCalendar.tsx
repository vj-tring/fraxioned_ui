import React, { useState } from 'react'
import './bookingbar.css'
import Region from '../region'
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from '../calender'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PopoverCalendarProps {
  withBorder?: boolean;
  paddingTop?: boolean;
  dateRange: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

const PopoverCalendar: React.FC<PopoverCalendarProps> = ({ 
  withBorder = false, 
  paddingTop = false,
  dateRange,
  onSelect
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'check-in' | 'check-out' | null>(null)

  const handleDateSelect = (range: DateRange | undefined) => {
    onSelect(range)
    if (range?.from && !range.to) {
      setActiveDate('check-in')
    } else if (range?.from && range?.to) {
      setActiveDate('check-out')
    }
  }

  const handleRegionClick = (type: 'check-in' | 'check-out') => {
    setIsCalendarOpen(true)
    setActiveDate(type)
  }

  return (
    <div className="MainCard1 d-flex" style={{
      border: withBorder ? '1px solid #ccc' : 'none', 
      padding: paddingTop ? '7px' : '0px',
      justifyContent: "space-around"
    }}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <div>
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
            selectingFrom={activeDate === 'check-in'} propertyColor={''}          />
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
              isActive={isCalendarOpen && activeDate === 'check-out'}
            />
          </div>
        </PopoverTrigger>
      </Popover>
    </div>
  )
}

export default PopoverCalendar