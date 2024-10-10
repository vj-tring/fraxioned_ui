import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import FilterListIcon from "@mui/icons-material/FilterList";
import BookingGrid from "@/components/grid/BookingGrid";
import BookingCalendar from "@/components/booking-calendar";
import TrackingMyNigts from "./trackingMyNights";
import PropertyList from "../home/propertyList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  BookingData,
  fetchUserBookings,
} from "@/store/slice/auth/bookingSlice";
import { format } from "date-fns";
import { cancelBooking } from "@/api";
import "../booking/booking.css";
import EditBookingModal from "./bookingEdit";
import { fetchProperties } from "@/store/slice/auth/property-slice";
import { RootState } from "@/store/reducers";
import Loader from "../../components/loader";
import CustomizedSnackbars from "@/components/customized-snackbar";

const Booking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const userBookings = useSelector(
    (state: RootState) => state.bookings.userBookings || []
  );
  const properties = useSelector(
    (state: RootState) => state.properties.cards || []
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (
    message: string,
    severity: "error" | "info" | "warning" = "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (user && user.id) {
      console.log("user", user);

      dispatch(fetchUserBookings(user.id));
      dispatch(fetchProperties(user.id));
    }
  }, [user, dispatch]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const details = (Array.isArray(userBookings) ? userBookings : [])
    .filter((booking: BookingData) => {
      if (activeTab === 0)
        return !booking.isCancelled && booking.isCompleted !== 1;
      if (activeTab === 1) return booking.isCompleted === 1;
      if (activeTab === 2) return booking.isCancelled;
      return true;
    })
    .map((booking: BookingData) => {
      const guestDetails = `${booking.noOfAdults} Adults, ${
        booking.noOfChildren
      } Children, ${booking.noOfPets} Pet${booking.noOfPets > 1 ? "s" : ""}`;
      return {
        ...booking,
        property: booking.property.propertyName,
        propertyId: booking.property.id,
        guest: guestDetails,
        checkinDate: formattedDate(booking.checkinDate),
        checkoutDate: formattedDate(booking.checkoutDate),
        createdAt: formattedDate(booking.createdAt),
      };
    });

  const handleEdit = (id: number) => {
    const bookingToEdit = userBookings.find(
      (booking: BookingData) => booking.id === id
    );
    if (bookingToEdit) {
      setSelectedBooking(bookingToEdit);
      setEditModalOpen(true);
    }
  };

  const handleEditSuccess = () => {
    // if (user && user.id) {
    //   dispatch(fetchUserBookings(user.id));
    //   showSnackbar("Booking successfully updated.", "success");
    // }
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleCancel = async (id: number) => {
    if (user && user.id) {
      setLoading(true); // Show loader
      try {
        const response = await cancelBooking(id, user.id);
        if (response.data && response.data.status === 400) {
          setSnackbarMessage(
            response.data.message || "Failed to cancel booking"
          );

          setSnackbarSeverity("error");
        } else {
          dispatch(fetchUserBookings(user.id));
          setSnackbarMessage("Booking successfully cancelled.");
          setSnackbarSeverity("success");
        }
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error canceling booking:", error);

        let errorMessage =
          "An unexpected error occurred while cancelling the booking.";

        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          const customError = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          errorMessage =
            customError.response?.data?.message ||
            customError.message ||
            errorMessage;
        }

        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
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
        {/* <div className="bookImg">
          <span>My Bookings</span>{" "}
        </div> */}
        <Typography
          variant="h4"
          className="my-Book mt-5 monsterrat mb-3"
          gutterBottom
        >
          My Bookings
        </Typography>
        <div className="d-flex justify-between BookHeader">
          <Tabs
            // disableRipple
            value={activeTab}
            onChange={handleTabChange}
            className="monsterrat "
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
                borderRadius: "5px",
                backgroundColor: "#808080",
                textTransform: "capitalize",
              }}
              className="calendarView"
            >
              View as Calendar
            </Button>
            {/* <Button
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
              className='FilterView'
            >
              Filter
            </Button> */}
          </div>
        </div>

        <BookingGrid
          bookings={details}
          onCancel={handleCancel}
          activeTab={activeTab}
        />

        <div className="TrackingMyNight mt-5">
          <TrackingMyNigts />
        </div>

        <div className="NewBook">
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "600",
              width: "80%",
              marginTop: "50px",
            }}
          >
            Create New Bookings
          </h1>
          <PropertyList paddingLeft />
        </div>
      </Box>
      <Modal
        open={isCalendarOpen}
        onClose={handleCloseCalendar}
        aria-labelledby="calendar-modal-title"
        aria-describedby="calendar-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: properties.length === 1 ? "47%" : "93%",
            height: properties.length === 1 ? "62%" : "67%",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "10px",
            overflow: "auto",
            padding: "20px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleCloseCalendar}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <BookingCalendar properties={properties} />
        </Box>
      </Modal>
      {selectedBooking && (
        <EditBookingModal
          open={editModalOpen}
          initialBooking={selectedBooking}
          handleClose={handleEditModalClose}
          onEditSuccess={handleEditSuccess}
        />
      )}
      <CustomizedSnackbars
        open={snackbarOpen}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      {loading && <Loader />} {/* Display loader */}
    </>
  );
};

export default Booking;
