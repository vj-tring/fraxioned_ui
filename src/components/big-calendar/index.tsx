import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BookingButton from "../bookingbutton";
import PropertyDropdown from "../property-dropdown";
import { getBookings } from '@/api';
import './big-calender.css';

const localizer = momentLocalizer(moment);

interface Booking {
    id: number;
    bookingId: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    property: {
        id: number;
        propertyName: string;
    };
}

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    desc: string;
    propertyId: number;
}

const propertyColors: { [key: number]: string } = {
    1: '#88cdd4',
    2: '#e28f25',
    3: '#c7eaee',
    4: '#88cdd4',
    5: '#33FFF1',
    6: '#F1FF33',
};

const Calendar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
    const [openEvent, setOpenEvent] = useState(false);
    const [clickedEvent, setClickedEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (selectedProperty !== null) {
            fetchBookings();
        }
    }, [selectedProperty]);

    const fetchBookings = async () => {
        try {
            const response = await getBookings();
            const bookings: Booking[] = response.data;
            const filteredBookings = bookings.filter(booking => booking.property.id === selectedProperty);

            const newEvents: Event[] = filteredBookings.map(booking => ({
                id: booking.id,
                title: `${booking.bookingId} : ${booking.property.propertyName}`,
                start: new Date(booking.checkinDate),
                end: new Date(booking.checkoutDate),
                desc: `Guests: ${booking.noOfGuests}, Nights: ${booking.totalNights}`,
                propertyId: booking.property.id,
            }));

            setEvents(newEvents);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleEventSelected = (event: Event) => {
        setOpenEvent(true);
        setClickedEvent(event);
    };

    const handleClose = () => {
        setOpenEvent(false);
    };

    const eventStyleGetter = (event: Event) => {
        const backgroundColor = propertyColors[event.propertyId] || '#999999';
        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className={`calendar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <PropertyDropdown onPropertySelect={setSelectedProperty} />
            <BookingButton />
            <BigCalendar
                localizer={localizer}
                events={events}
                views={["month", "week", "day"]}
                defaultView="month"
                defaultDate={new Date()}
                onSelectEvent={(event: Event) => handleEventSelected(event)}
                eventPropGetter={eventStyleGetter}
            />

            <Dialog
                open={openEvent}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Booking Details
                </DialogTitle>
                <DialogContent>
                    {clickedEvent && (
                        <>
                            <p><strong>Property:</strong> {clickedEvent.title.split(': ')[1]}</p>
                            <p><strong>Check-in:</strong> {moment(clickedEvent.start).format('MMMM Do YYYY, h:mm a')}</p>
                            <p><strong>Check-out:</strong> {moment(clickedEvent.end).format('MMMM Do YYYY, h:mm a')}</p>
                            <p>{clickedEvent.desc}</p>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Calendar;