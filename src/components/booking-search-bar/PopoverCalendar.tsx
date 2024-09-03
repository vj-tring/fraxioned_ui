//@ts-nocheck
import React, { useState } from 'react'
import './bookingbar.css'
import Region from '../region'
// import PropertyCarousel from '../property-carousel'
// import GuestSelector from '../guest-selector'
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from '../calender'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { maxWidth } from '@mui/system'
import { useSelector } from "react-redux";


interface PopoverCalendarProps {
  withBorder?: boolean;
  paddingTop?: boolean;
}

const PopoverCalendar: React.FC<PopoverCalendarProps> = ({ withBorder = false, paddingTop = false }) => {

  const userId = ''
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const dateRange1 = useSelector((state: RootState) => state.datePicker.dateRange);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDate, setActiveDate] = useState<'check-in' | 'check-out' | null>(null)

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range)
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
    <div className=" MainCard1 d-flex" style={{
      border: withBorder ? '1px solid #ccc' : 'none', padding: paddingTop ? '7px' : '0px',
      justifyContent: "space-around"
    }}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} disableRipple>
        <PopoverTrigger asChild disableRipple >
          <div>
            <Region
              label="Check In"
              date={dateRange?.from || dateRange1?.from}
              onClick={() => handleRegionClick('check-in')}
              isActive={isCalendarOpen && activeDate === 'check-in'}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="calendar-popover"

          align="start">
          <DatePickerWithRange
            onSelect={handleDateSelect}
            initialRange={dateRange}
            selectingFrom={activeDate === 'check-in'}
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
              date={dateRange?.to || dateRange1?.to}
              onClick={() => handleRegionClick('check-out')}
              isActive={isCalendarOpen && activeDate === 'check-out'}
            />
          </div>
        </PopoverTrigger>
      </Popover>
      {/* <div className="vl"></div> */}
    </div>
  )
}

export default PopoverCalendar
