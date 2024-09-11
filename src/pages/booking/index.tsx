import { useState, useEffect } from "react";
import "./booking.css";
import { Typography, Box, Tabs, Tab, Button } from "@mui/material";
import BookingGrid from "@/components/grid/BookingGrid";
import {
  BookingData,
  fetchBookings,
  fetchUserBookings,
} from "@/store/slice/auth/bookingSlice";
import { AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { format } from "date-fns";
import PropertyList from "../home/propertyList";
import TrackingMyNigts from "./trackingMyNights";
import BookingBar from "./booking-bar";
import FilterListIcon from "@mui/icons-material/FilterList";

const Booking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const bookingdetails = useSelector(
    (state: RootState) => state.bookings.bookings
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const userBookings = useSelector(
    (state: RootState) => state.bookings.userBookings
  );

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserBookings(user.id));
    }
  }, [user, dispatch]);

  const formattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM do, yyyy hh:mm a");
  };

  const details = userBookings.map((booking: BookingData) => {
    const guestDetails = `${booking.noOfAdults} Adults, ${
      booking.noOfChildren
    } Children, ${booking.noOfPets} Pet${booking.noOfPets > 1 ? "s" : ""}`;
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

  const handleCancel = (id: number) => {
    console.log(`Cancel clicked for booking id: ${id}`);
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Box
        sx={{
          width: "90%",
          margin: "auto",
        }}
      >
        <Typography
          variant="h4"
          className="my-Book mt-5 monsterrat mb-3"
          gutterBottom
        >
          My Bookings
        </Typography>
        <div className="d-flex justify-between">
          <Tabs
            disableRipple
            value={activeTab}
            onChange={handleTabChange}
            className="monsterrat"
            sx={{
              "& .MuiTab-root": {
                color: "black", // Default color
              },
              "& .MuiTab-root.Mui-selected": {
                color: "black !important", // Color for the active tab
              },
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
          <PropertyList />
        </div>
      </Box>
    </>
  );
};

export default Booking;
