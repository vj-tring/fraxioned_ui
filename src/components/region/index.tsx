import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../calender';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import './region.css';
const Region = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.to) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div 
            className="d-flex align-items-start flex-column pt-3 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="DateHead1 monsterrat">Check In</span>
            <p className="property1 monsterrat">
              {date?.from ? date.from.toLocaleDateString() : "Add Dates"}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DatePickerWithRange 
            className="w-[300px]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Region;
