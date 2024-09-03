import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import Box from "@mui/material/Box";
import { useSnackbar } from "../../components/snackbar-provider";
import { confirmBooking, setNotes } from "@/store/slice/auth/bookingSlice";
import { useNavigate } from "react-router-dom";
// import Loader from "../../components/loader/index";
import { AppDispatch } from "@/store";
import { Button, CircularProgress, SvgIcon } from "@mui/material";

const mockBooking = {
  property: { id: "3" },
  checkinDate: new Date().toISOString(),
  checkoutDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
  noOfAdults: 2,
  noOfChildren: 1,
  noOfPets: 0,
  isLastMinuteBooking: false,
  cleaningFee: 100,
  petFee: 0,
};


const CheckIcon: React.FC = () => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{ fontSize: 60, color: "#4CAF50" }}
  >
    <path d="M10 15.172l-3.707-3.707 1.414-1.414L10 12.343l7.293-7.293 1.414 1.414L10 15.172z" />
  </SvgIcon>
);
const BookingSummaryForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { currentBooking } = useSelector((state: RootState) => state.bookings);

  const [notes, setNotesValue] = useState<string>(currentBooking?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const booking = currentBooking || mockBooking;
  const checkinDate = new Date(booking.checkinDate);
  const checkoutDate = new Date(booking.checkoutDate);
  const totalNights = Math.ceil(
    (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleBookingCancel = () => {
    navigate("/dashboard");
  };

  const handleBookingConfirm = async () => {
    setIsLoading(true);
    try {
      dispatch(setNotes(notes));
      const result = await dispatch(confirmBooking({ ...booking, notes })).unwrap();
  

      showSnackbar(result.message, 'success');
      setShowConfirmation(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      showSnackbar(error as string || 'Failed to confirm booking', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      my={5}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 4,
        padding: 2,
        width: "80%",
        marginLeft: '10%',
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
         {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {SnackbarComponent}
      {showConfirmation && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            color: '#4CAF50',
          }}
        >
          <CheckIcon />
          <h1>Booking Successful</h1>
        </Box>
      )}

      {!showConfirmation && (
        <>
          <div className="BookSum">
            <h1 className="SummaryHead">BOOKING SUMMARY</h1>
            <div className="ListSum">
              <div><div className="property">Property:</div> <div className="value">{!(booking.data) ? booking.property.id : booking.data.property.id }</div></div>
              <div><div className="property">Check-in:</div><div className="value">{checkinDate.toDateString()}</div></div>
              <div><div className="property">Check-out:</div><div className="value">{checkoutDate.toDateString()}</div></div>
              <div><div className="property">Total Nights:</div><div className="value">{totalNights}</div></div>
              <div><div className="property">Adults:</div><div className="value">{booking.noOfAdults}</div></div>
              <div><div className="property">Children:</div><div className="value">{booking.noOfChildren}</div></div>
              <div><div className="property">Pets:</div><div className="value">{booking.noOfPets}</div></div>
              <div><div className="property">Season:</div><div className="value">{booking.isLastMinuteBooking ? "Last Minute" : "Regular"}</div></div>
            </div>
          </div>

          <div className="PaySum">
            <h1 className="SummaryHead">PAYMENTS SUMMARY</h1>
            <div className="ListSum">
              <div><div className="property">Cleaning Fee:</div><div className="value">${booking.cleaningFee}</div></div>
              <div><div className="property">Pet Fee:</div><div className="value">${booking.petFee}</div></div>
              <div><div className="property">Total Amount Due:</div><div className="value">${booking.cleaningFee + booking.petFee}</div></div>
              <div><div className="property">Date of Charge:</div><div className="value">{new Date().toDateString()}</div></div>
            </div>

            <div className="Notes">
              <h1 className="SummaryHead">NOTES</h1>
              <textarea
                id="Textarea"
                rows={1}
                className="p-3"
                placeholder="Add any notes here..."
                value={notes}
                onChange={(e) => setNotesValue(e.target.value)}
              />
            </div>

            <div className="Btun mt-3">
              <Button
                disableRipple
                onClick={handleBookingCancel}
                className="cancelBtn"
              >
                Cancel
              </Button>
              <Button
                disableRipple
                onClick={handleBookingConfirm}
                className="confirmBtn"
                disabled={isLoading}
              >
                {isLoading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};

export default BookingSummaryForm;
