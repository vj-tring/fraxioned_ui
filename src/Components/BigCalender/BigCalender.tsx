import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from "moment";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material"; import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './BigCalender.css'

const localizer = momentLocalizer(moment);

interface Event {
    title: string;
    start: Date;
    end: Date;
    desc: string;
}

const Calendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
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
        <div className="calendar-container">
            <BigCalendar
                localizer={localizer}
                events={events}
                views={["month", "week", "day", "agenda"]}
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
                        multiline
                        rows={4}
                        defaultValue={desc}
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
                    {eventActions}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Calendar;