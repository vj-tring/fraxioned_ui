import React, { useState, useEffect } from 'react';
import { Typography, Box, Tabs, Tab, Button, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from "@mui/icons-material/FilterList";
import BookingGrid from "@/components/grid/BookingGrid";
import BookingCalendar from "@/components/booking-calendar";
import TrackingMyNigts from "./trackingMyNights";
import PropertyList from "../home/propertyList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { BookingData, fetchUserBookings } from "@/store/slice/auth/bookingSlice";
import { format } from "date-fns";
import { cancelBooking } from '@/api';
import CustomizedSnackbar from '@/components/customized-snackbar';

const Booking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" >("error");
  const user = useSelector((state: RootState) => state.auth.user);
  const userBookings = useSelector((state: RootState) => state.bookings.userBookings || []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string, severity: "error" | "info" | "warning" = "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [user, dispatch]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM do, yyyy hh:mm a");
  };

  const details = (Array.isArray(userBookings) ? userBookings : [])
    .filter((booking: BookingData) => {
      if (activeTab === 0) return !booking.isCancelled && booking.isCompleted !== 1;
      if (activeTab === 1) return booking.isCompleted === 1;
      if (activeTab === 2) return booking.isCancelled;
      return true; 
    })
    .map((booking: BookingData) => {
      const guestDetails = `${booking.noOfAdults} Adults, ${booking.noOfChildren} Children, ${booking.noOfPets} Pet${booking.noOfPets > 1 ? "s" : ""}`;
      return {
        ...booking,
        property: booking.property.propertyName,
        guest: guestDetails,
        checkinDate: formattedDate(booking.checkinDate),
        checkoutDate: formattedDate(booking.checkoutDate),
        createdAt: formattedDate(booking.createdAt),
      };
    });

  const handleEdit = (id: number) => {
    console.log(`Edit clicked for booking id: ${id}`);
  };

  const handleCancel = async (id: number) => {
    if (user && user.id) {
      try {
        await cancelBooking(id, user.id);
        // After successful cancellation, refetch the bookings
        dispatch(fetchUserBookings(user.id));
        // Show success snackbar
        setSnackbarMessage("Booking successfully canceled.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error canceling booking:', error);
        // Show error snackbar
        setSnackbarMessage("Error canceling booking. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenCalendar = () => {
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  return (
    <>
      <Box sx={{ width: "90%", margin: "auto" }}>
        <Typography variant="h4" className="my-Book mt-5 monsterrat mb-3" gutterBottom>
          My Bookings
        </Typography>
        <div className="d-flex justify-between">
          <Tabs
            disableRipple
            value={activeTab}
            onChange={handleTabChange}
            className="monsterrat"
            sx={{
              "& .MuiTab-root": { color: "black" },
              "& .MuiTab-root.Mui-selected": { color: "black !important" },
            }}
          >
            <Tab disableRipple label="Upcoming" className="monsterrat Up" />
            <Tab disableRipple label="Completed" className="monsterrat Com" />
            <Tab disableRipple label="Cancelled" className="monsterrat Can" />
            <Tab disableRipple label="All" className="monsterrat All" />
          </Tabs>
          <div>
            <Button
              disableRipple
              variant="contained"
              onClick={handleOpenCalendar}
              style={{
                marginLeft: "16px",
                borderRadius: "10px",
                backgroundColor: "#88CDD4",
                textTransform: "capitalize",
              }}
            >
              View as Calendar
            </Button>
            <Button
              variant="outlined"
              disableRipple
              color="primary"
              startIcon={<FilterListIcon />}
              style={{
                marginLeft: "16px",
                border: "1px solid #88CDD4",
                color: "black",
                borderRadius: "10px",
                textTransform: "capitalize",
              }}
            >
              Filter
            </Button>
          </div>
        </div>

        <BookingGrid
          bookings={details}
          onEdit={handleEdit}
          onCancel={handleCancel}
          activeTab={activeTab}
        />

        <div className="TrackingMyNight mt-5">
          <TrackingMyNigts />
        </div>

        <div className="NewBook">
          <h1 style={{ fontSize: "20px", fontWeight: "600", width: "80%", marginTop: "50px" }}>
            Create New Bookings
          </h1>
          <PropertyList paddingLeft />
        </div>
      </Box>

      <Modal
        open={isCalendarOpen}
        onClose={handleCloseCalendar}
        // hideBackdrop={true}
        aria-labelledby="calendar-modal-title"
        aria-describedby="calendar-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '97%',
          height: '60%',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: '10px',
          overflow: 'auto',
          padding: '20px',
          // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          
        }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseCalendar}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <BookingCalendar />
        </Box>
      </Modal>
      <CustomizedSnackbar
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
    
  );
};

export default Booking;