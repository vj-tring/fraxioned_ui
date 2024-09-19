import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './booking-calendar.css';
import { DatePickerWithRange } from '../calender';
import { fetchProperties } from '@/store/slice/auth/property-slice';
import { fetchUserBookings } from '@/store/slice/auth/bookingSlice';

const predefinedColors = ['#87CEEB', '#FFA500', '#b94ccf', '#FF33A1', '#A133FF', '#33FFA1'];

const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeProperty, setActiveProperty] = useState<string | null>(null);
  const dispatch = useDispatch();

  const userId = useSelector((state: any) => state.auth.user?.id);
  const { cards: properties, loading: propertiesLoading } = useSelector((state: any) => state.properties);
  const { userBookings, isLoading: bookingsLoading } = useSelector((state: any) => state.bookings);

  useEffect(() => {
    if (userId) {
      dispatch(fetchProperties(userId));
      dispatch(fetchUserBookings(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    console.log('User Bookings:', userBookings);
  }, [userBookings]);

  if (propertiesLoading || bookingsLoading) {
    return <div>Loading...</div>;
  }

  const propertiesWithColors = properties.map((property: any, index: number) => ({
    ...property,
    color: predefinedColors[index % predefinedColors.length], 
  }));

  // Function to get booked dates for a specific property
  const getBookedDatesForProperty = (propertyId: number) => {
    const bookedDates = userBookings
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
    
    return bookedDates;
  };

  return (
    <div className="booking-calendar">
      <div className="header-container">
        <div className="calendar-heading">My Bookings Calendar</div>
        <div className="properties-legend">
          {propertiesWithColors.map((property: any) => (
            <span 
              key={property.id} 
              className="property-name" 
              style={{ color: property.color }}
              onClick={() => setActiveProperty(property.id)}
            >
              {property.name}
            </span>
          ))}
        </div>
      </div>

      <div className="calendars-container">
        <div className="calendars-row">
          {propertiesWithColors.slice(0, 2).map((property: any) => (
            <div key={property.id} className="property-calendar">
              <DatePickerWithRange
                key={`${property.id}-${selectedDate.getTime()}`}
                userId={userId}
                onSelect={(range) => {
                  console.log(`Selected range for ${property.name}:`, range);
                }}
                showEndCalendar={false}
                fetchBookingsOnMount={activeProperty === property.id}
                externalBookedDates={getBookedDatesForProperty(property.id)}
                hideBookedDates={getBookedDatesForProperty(property.id).length === 0}
                propertyColor={property.color}
                disableStrikethrough={true}
              />
            </div>
          ))}
        </div>
        <div className="calendars-row scrollable">
          {propertiesWithColors.slice(2).map((property: any) => (
            <div key={property.id} className="property-calendar">
              <DatePickerWithRange
                key={`${property.id}-${selectedDate.getTime()}`}
                userId={userId}
                initialRange={{
                  from: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
                  to: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
                }}
                onSelect={(range) => {
                  console.log(`Selected range for ${property.name}:`, range);
                }}
                showEndCalendar={false}
                fetchBookingsOnMount={activeProperty === property.id}
                externalBookedDates={getBookedDatesForProperty(property.id)}
                hideBookedDates={getBookedDatesForProperty(property.id).length === 0}
                propertyColor={property.color}
                disableStrikethrough={true}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;