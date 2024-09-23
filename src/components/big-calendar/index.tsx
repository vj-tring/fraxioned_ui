import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import BookingButton from "../bookingbutton";
import './big-calender.css'

const localizer = momentLocalizer(moment);

interface Event {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    desc: string;
}

const bookedDates: Event[] = [
    {
        id: 1,
        title: "Booked",
        start: new Date("2024-08-01T10:00:00"),
        end: new Date("2024-08-03T11:00:00"),
        desc: "Booked"
    },
    {
        id: 2,
        title: "Booked",
        start: new Date("2024-08-06T18:00:00"),
        end: new Date("2024-08-06T22:00:00"),
        desc: "Party"
    },
    {
        id: 3,
        title: "Booked",
        start: new Date("2024-08-09T17:00:00"),
        end: new Date("2024-08-13T18:30:00"),
        desc: "Personal training"
    }
];

const Calendar: React.FC<{ isSidebarOpen: boolean }> = ({ isSidebarOpen }) => {
    const [events, setEvents] = useState<Event[]>((bookedDates));
    const [title, setTitle] = useState("");
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [desc, setDesc] = useState("");
    const [openSlot, setOpenSlot] = useState(false);
    const [openEvent, setOpenEvent] = useState(false);
    const [clickedEvent, setClickedEvent] = useState<Event | null>(null);

    const handleClose = () => {
        setOpenEvent(false);
        setOpenSlot(false);
    };

    const handleSlotSelected = (slotInfo: { start: Date; end: Date }) => {
        setTitle("");
        setDesc("");
        setStart(slotInfo.start);
        setEnd(slotInfo.end);
        setOpenSlot(true);
    };

    const handleEventSelected = (event: Event) => {
        setOpenEvent(true);
        setClickedEvent(event);
        setStart(event.start);
        setEnd(event.end);
        setTitle(event.title);
        setDesc(event.desc);
    };

    const handleStartTime = (date: moment.Moment | null) => {
        setStart(date?.toDate() || null);
    };

    const handleEndTime = (date: moment.Moment | null) => {
        setEnd(date?.toDate() || null);
    };

    const setNewAppointment = () => {
        if (start && end) {
            const appointment = { title, start, end, desc };
            setEvents([...events, appointment]);
        }
    };

    const updateEvent = () => {
        if (clickedEvent && start && end) {
            const updatedEvents = events.map(event =>
                event === clickedEvent ? { ...event, title, desc, start, end } : event
            );
            setEvents(updatedEvents);
        }
    };

    const deleteEvent = () => {
        const updatedEvents = events.filter(event => event.start !== start);
        setEvents(updatedEvents);
    };

    const eventActions = [
        <Button onClick={handleClose}>Cancel</Button>,
        <Button color="secondary" onClick={() => { deleteEvent(); handleClose(); }}>
            Delete
        </Button>,
        <Button color="primary" onClick={() => { updateEvent(); handleClose(); }}>
            Confirm Edit
        </Button>
    ];

    const appointmentActions = [
        <Button color="secondary" onClick={handleClose}>Cancel</Button>,
        <Button color="primary" onClick={() => { setNewAppointment(); handleClose(); }}>
            Submit
        </Button>
    ];

    return (
        <div className={`calendar-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <BookingButton />
            <BigCalendar
                localizer={localizer}
                events={events}
                views={["month", "week", "day"]}
                timeslots={2}
                defaultView="month"
                defaultDate={new Date()}
                selectable={true}
                onSelectEvent={(event: Event) => handleEventSelected(event)}
                onSelectSlot={(slotInfo: { start: Date; end: Date }) => handleSlotSelected(slotInfo)}
            />

            <Dialog
                open={openSlot}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {`Book an appointment on ${moment(start).format("MMMM Do YYYY")}`}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                        onChange={e => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        onChange={e => setDesc(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                            label="Start Time"
                            value={moment(start)}
                            onChange={handleStartTime}
                        />
                        <TimePicker
                            label="End Time"
                            value={moment(end)}
                            onChange={handleEndTime}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    {appointmentActions}
                </DialogActions>
            </Dialog>

            <Dialog
                open={openEvent}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    {`View/Edit Appointment of ${moment(start).format("MMMM Do YYYY")}`}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                        defaultValue={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        defaultValue={desc}
                        onChange={e => setDesc(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <TimePicker
                            label="Start Time"
                            value={moment(start)}
                            onChange={handleStartTime}
                            className="time-picker"
                        />
                        <TimePicker
                            label="End Time"
                            value={moment(end)}
                            onChange={handleEndTime}
                            className="custom-time-picker"
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    {eventActions}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Calendar;