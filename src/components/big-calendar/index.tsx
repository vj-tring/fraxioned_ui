import React, { useEffect } from 'react';
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

const localizer = momentLocalizer(moment);

const Calendar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings.bookings);
  const [openSlot, setOpenSlot] = React.useState(false);
  const [openEvent, setOpenEvent] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    start: null,
    end: null,
    desc: '',
  });

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleSlotSelect = (slotInfo: { start: any; end: any; }) => {
    setNewEvent({
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      desc: '',
    });
    setOpenSlot(true);
  };

  const handleEventSelect = (event: React.SetStateAction<null>) => {
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

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (time: moment.Moment | null, type: string) => {
    setNewEvent((prev) => ({
      ...prev,
      [type]: time ? time.toDate() : null,
    }));
  };

  const events = bookings.map((booking: { property: { id: any; }; checkinDate: string | number | Date; checkoutDate: string | number | Date; noOfAdults: any; noOfChildren: any; noOfPets: any; }) => ({
    title: `Booking: ${booking.property?.id || 'Unknown Property'}`,
    start: new Date(booking.checkinDate),
    end: new Date(booking.checkoutDate),
    desc: `Adults: ${booking.noOfAdults}, Children: ${booking.noOfChildren}, Pets: ${booking.noOfPets}`,
  }));

  return (
    <div className={`calendar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <BigCalendar
        localizer={localizer}
        events={events}
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
              <TextField
                margin="dense"
                label="Title"
                fullWidth
                value={selectedEvent.title}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Start"
                fullWidth
                value={moment(selectedEvent.start).format('MMMM Do YYYY, h:mm a')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="End"
                fullWidth
                value={moment(selectedEvent.end).format('MMMM Do YYYY, h:mm a')}
                InputProps={{ readOnly: true }}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={selectedEvent.desc}
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