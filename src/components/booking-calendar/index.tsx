import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './booking-calendar.css';
import { fetchProperties } from '@/store/slice/auth/property-slice';
import { fetchUserBookings } from '@/store/slice/auth/bookingSlice';
import { AppDispatch } from '@/store';
import { Property } from '@/store/model';
import { Calendar } from '../ui/calendar';

const predefinedColors = ['#87CEEB', '#FFA500', '#b94ccf', '#FF33A1', '#A133FF', '#33FFA1', '#33A1FF', '#A1FF33'];

const BookingCalendar = ({ properties }: { properties: Property[] }) => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: any) => state.auth.user?.id);
  const { userBookings, isLoading: bookingsLoading } = useSelector((state: any) => state.bookings);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProperties(userId));
      dispatch(fetchUserBookings(userId));
    }
  }, [dispatch, userId]);

  if (bookingsLoading) {
    return <div>Loading...</div>;
  }

  const propertiesWithColors = properties.map((property: any, index: number) => ({
    ...property,
    color: predefinedColors[index % predefinedColors.length], 
  }));

  const getBookedDatesForProperty = (propertyId: number) => {
    if (!Array.isArray(userBookings)) {
      console.warn('userBookings is not an array:', userBookings);
      return [];
    }
  
    return userBookings
      .filter((booking: any) => booking.property.id === propertyId && !booking.isCancelled)
      .flatMap((booking: any) => {
        const start = new Date(booking.checkinDate);
        const end = new Date(booking.checkoutDate);
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      });
  };

  const renderPropertyCalendar = (property: any, isLast: boolean, isOdd: boolean) => (
    <div 
      key={property.id} 
      className={`property-calendar-color ${isLast && isOdd ? 'last-odd' : ''}`}
    >
      <h3 style={{ color: property.color, textAlign: 'left', marginLeft: '20px' }}>
        {property.name}
      </h3>
      <Calendar
        mode="range"
        showOutsideDays={false}
        defaultMonth={new Date()}
        numberOfMonths={2}
        classNames={{
          head_cell: "text-rounded-md h-9 w-10 font-semibold text-[13px] text-center p-2",
          day_today: "text-accent-foreground",
          day: "h-10 w-10 p-0 font-semibold text-[12px] aria-selected:opacity-100 text-black",
          cell: "h-8 w-10 text-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-full [&:has([aria-selected].day-range-start)]:rounded-l-full [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",

        }}
        modifiers={{
          booked: getBookedDatesForProperty(property.id),
        }}
        modifiersStyles={{
          booked: {
            backgroundColor: property.color,
            color: 'white',
          },
        }}
        disabled={getBookedDatesForProperty(property.id)}
        footer={null}
      />
    </div>
  );

  const renderCalendarRows = () => {
    const rows = [];
    const isOdd = propertiesWithColors.length % 2 !== 0;

    for (let i = 0; i < propertiesWithColors.length; i += 2) {
      const isLastRow = i === propertiesWithColors.length - 1 || i === propertiesWithColors.length - 2;
      rows.push(
        <div key={i} className={`calendars-row ${isLastRow && isOdd ? 'last-odd-row' : ''}`}>
          {renderPropertyCalendar(propertiesWithColors[i], isLastRow, isOdd)}
          {propertiesWithColors[i + 1] && renderPropertyCalendar(propertiesWithColors[i + 1], isLastRow, isOdd)}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="booking-calendar">
      <div className="header-container">
        <div className="calendar-heading">My Bookings Calendar</div>
      </div>
      <div className="calendars-container">
        {renderCalendarRows()}
      </div>
    </div>
  );
};

export default BookingCalendar;