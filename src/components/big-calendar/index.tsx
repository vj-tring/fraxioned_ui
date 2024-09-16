import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calender.css';
import { fetchBookings } from '@/store/slice/auth/bookingSlice';
import PropertySearchBar from '../property-search';
import { Property } from '@/store/model';

const localizer = momentLocalizer(moment);

const Calendar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const [openSlot, setOpenSlot] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: null,
    end: null,
    desc: '',
  });

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleSlotSelect = (slotInfo) => {
    setNewEvent({
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      desc: '',
    });
    setOpenSlot(true);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpenEvent(true);
  };

  const handleClose = () => {
    setOpenSlot(false);
    setOpenEvent(false);
    setSelectedEvent(null);
    setNewEvent({
      title: '',
      start: null,
      end: null,
      desc: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time, type) => {
    setNewEvent((prev) => ({
      ...prev,
      [type]: time ? time.toDate() : null,
    }));
  };

  const handleSelectProperty = (property: Property) => {
    console.log('Selected Property:', property);
    setSelectedProperty(property);
  };

  const getPropertyName = (booking) => {
    if (selectedProperty) {
      return selectedProperty.propertyName || selectedProperty.name || 'Selected Property';
    } else if (booking.property && booking.property.propertyName) {
      return booking.property.propertyName;
    } else if (booking.propertyName) {
      return booking.propertyName;
    } else if (booking.property && booking.property.name) {
      return booking.property.name;
    } else {
      console.log('Booking with missing property info:', booking);
      return '';
    }
  };

  const filteredEvents = useMemo(() => {
    return bookings
      .filter((booking) => 
        !selectedProperty || booking.property?.id === selectedProperty.id
      )
      .map((booking) => {
        const propertyName = getPropertyName(booking);
        return {
          title: `Booked ${propertyName}`,
          start: new Date(booking.checkinDate),
          end: new Date(booking.checkoutDate),
          desc: `Property: ${propertyName}\nAdults: ${booking.noOfAdults}, Children: ${booking.noOfChildren}, Pets: ${booking.noOfPets}`,
          booking: booking,
        };
      });
  }, [bookings, selectedProperty]);

  return (
    <div className={`calendar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className='mb-2'>
        <PropertySearchBar onSelectProperty={handleSelectProperty} />
      </div>
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        views={['month', 'week', 'day']}
        defaultView="month"
        selectable
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
      />

      <Dialog open={openSlot} onClose={handleClose}>
        <DialogTitle>Add New Booking</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            value={newEvent.title}
            onChange={handleInputChange}
          />
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
              label="Start Time"
              value={moment(newEvent.start)}
              onChange={(time) => handleTimeChange(time, 'start')}
            />
            <TimePicker
              label="End Time"
              value={moment(newEvent.end)}
              onChange={(time) => handleTimeChange(time, 'end')}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            name="desc"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newEvent.desc}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} color="primary">Add Booking</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEvent} onClose={handleClose}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <>
              {/* <TextField
                margin="dense"
                label="Title"
                fullWidth
                value={selectedEvent.title}
                InputProps={{ readOnly: true }}
              /> */}
              <TextField
                margin="dense"
                label="Property"
                fullWidth
                value={selectedEvent.desc.split('\n')[0].replace('Property: ', '')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Check-in"
                fullWidth
                value={moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Check-out"
                fullWidth
                value={moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Details"
                fullWidth
                value={selectedEvent.desc.split('\n').slice(1).join('\n')}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendar;