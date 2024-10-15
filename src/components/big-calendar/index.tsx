import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import imageone from "../../assests/bear-lake-bluffs.jpg";
import imagetwo from "../../assests/crown-jewel.jpg";
import imagethree from "../../assests/blue-bear-lake.jpg";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BookingButton from "../../components/bookingbutton";
import PropertyDropdown from "../property-dropdown";
import { getBookings, userdetails } from "@/api";
import "./big-calender.css";
import {
  Edit,
  CalendarToday,
  Person,
  Home,
  CheckCircle,
  CancelOutlined,
  Group,
} from "@mui/icons-material";
import { User, Booking, Event } from './big-calender.types';

const localizer = momentLocalizer(moment);
const propertyColors: { [key: number]: string } = {
  1: "#88cdd4",
  2: "#e28f25",
  3: "#c7eaee",
  4: "#88cdd4",
};

const Calendar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [openEvent, setOpenEvent] = useState(false);
  const [clickedEvent, setClickedEvent] = useState<Event | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllBookings();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedProperty === null) {
      setFilteredEvents(allEvents);
    } else {
      const filtered = allEvents.filter(
        (event) => event.propertyId === selectedProperty
      );
      setFilteredEvents(filtered);
    }
  }, [selectedProperty, allEvents]);

  const fetchAllBookings = async () => {
    try {
      const response = await getBookings();
      const bookings: Booking[] = response.data;

      const newEvents: Event[] = bookings.map((booking) => ({
        id: booking.id,
        title: `${booking.bookingId} : ${booking.property.propertyName}`,
        start: new Date(booking.checkinDate),
        end: new Date(booking.checkoutDate),
        desc: `Guests: ${booking.noOfGuests}, Nights: ${booking.totalNights}`,
        propertyId: booking.property.id,
        userId: booking.user.id,
        createdAt: booking.createdAt,
      }));

      setAllEvents(newEvents);
      setFilteredEvents(newEvents);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userdetails();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEventSelected = (event: Event) => {
    setOpenEvent(true);
    setClickedEvent(event);
  };

  const getPropertyImage = (propertyId: number) => {
    switch (propertyId) {
      case 1:
        return imageone;
      case 2:
        return imagetwo;
      case 3:
        return imagethree;
      default:
        return imageone;
    }
  };

  const handleClose = () => {
    setOpenEvent(false);
  };

  const eventStyleGetter = (event: Event) => {
    const backgroundColor = propertyColors[event.propertyId] || "#999999";
    return {
      style: {
        backgroundColor,
        color: "white",
        border: "none",
        borderRadius: "0px",
        display: "flex",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
    };
  };

  const EventComponent = ({ event }: { event: Event }) => {
    return (
      <div className="custom-event">
        <div className="event-content">{event.title}</div>
      </div>
    );
  };

  const handlePropertySelect = (propertyId: number | null) => {
    setSelectedProperty(propertyId);
  };

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
  };

  const handleEdit = () => {
    console.log("Edit clicked for event:", clickedEvent);
  };

  return (
    <div
      className={`calendar-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
    >
      <div className="calendar-header">
        <PropertyDropdown onPropertySelect={handlePropertySelect} />
        <BookingButton />
      </div>
      <BigCalendar
        localizer={localizer}
        events={filteredEvents}
        views={["month", "week", "day"]}
        defaultView="month"
        defaultDate={new Date()}
        onSelectEvent={(event) => handleEventSelected(event)}
        eventPropGetter={eventStyleGetter}
        className="calendar-view"
        components={{
          event: EventComponent,
        }}
      />

      <Dialog
        open={openEvent}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="booking-dialog"
      >
        <div className="dialog-header">
          <h2 className="dialog-title">Booking Details</h2>
          <button onClick={handleEdit} className="edit-button">
            <Edit
              sx={{
                fontSize: "medium",
              }}
            />
          </button>
        </div>
        <DialogContent className="dialog-content">
          {clickedEvent && (
            <div className="booking-details-container">
              <div className="booking-image">
                <img
                  src={getPropertyImage(clickedEvent.propertyId)}
                  alt="Property"
                />
              </div>
              <div className="booking-info">
                <div className="detail-item">
                  <Home className="detail-icon" />
                  <span className="detail-label">Property</span>
                  <span className="detail-value">
                    {clickedEvent.title.split(": ")[1]}
                  </span>
                </div>
                <div className="detail-item">
                  <Person className="detail-icon" />
                  <span className="detail-label">User</span>
                  <span className="detail-value">
                    {getUserName(clickedEvent.userId)}
                  </span>
                </div>
                <div className="detail-item">
                  <CheckCircle className="detail-icon" />
                  <span className="detail-label">Check-in</span>
                  <span className="detail-value">
                    {moment(clickedEvent.start).format("MMMM Do YYYY, h:mm a")}
                  </span>
                </div>
                <div className="detail-item">
                  <CancelOutlined className="detail-icon" />
                  <span className="detail-label">Check-out</span>
                  <span className="detail-value">
                    {moment(clickedEvent.end).format("MMMM Do YYYY, h:mm a")}
                  </span>
                </div>
                <div className="detail-item">
                  <CalendarToday className="detail-icon" />
                  <span className="detail-label">Booked on</span>
                  <span className="detail-value">
                    {moment(clickedEvent.createdAt).format("MMMM Do YYYY")}
                  </span>
                </div>
                <div className="detail-item detail-description">
                  <Group className="detail-icon" />
                  <span className="detail-label">Additional Info</span>
                  <span className="detail-value">{clickedEvent.desc}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={handleClose}
            color="primary"
            className="close-button"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Calendar;
