import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useSnackbar } from "../../components/snackbar-provider";
import { confirmBooking, setNotes } from "@/store/slice/auth/bookingSlice";
import { useNavigate } from "react-router-dom";
import "./booking-summary.css";
import Loader from  "../../components/loader/index";
import { AppDispatch } from "@/store";

const mockBooking = {
  property: { id: "3" },
  checkinDate: new Date().toISOString(),
  checkoutDate: new Date(
    new Date().setDate(new Date().getDate() + 2)
  ).toISOString(),
  noOfAdults: 2,
  noOfChildren: 1,
  noOfPets: 0,
  isLastMinuteBooking: false,
  cleaningFee: 100,
  petFee: 0,
};

const BookingSummaryForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { currentBooking, isLoading } = useSelector(
    (state: RootState) => state.bookings
  );

  const [notes, setNotesValue] = useState<string>(currentBooking?.notes || "");

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
    try {
      dispatch(setNotes(notes));
      const result = await dispatch(confirmBooking({ ...booking, notes })).unwrap();
      showSnackbar(result.message, 'success');
      setTimeout(() => {
        navigate('/dashboard');
    }, 2000);    } catch (error) {
      showSnackbar(error as string || 'Failed to confirm booking', 'error');
    }
  };
  
  return (
    <Box
      height={900}
      width={700}
      my={5}
      gap={4}
      sx={{
        marginLeft: "28%",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <div className="BookSum">
        <h1 className="pt-4 pb-4 mb-5 SummaryHead BookHead">BOOKING SUMMARY</h1>
        <div className="ListSum">
          <div>
            <div className="property">Property:</div>
            <div className="colon">:</div>
            <div className="value">{!(booking.data) ? booking.property.id : booking.data.property.id }</div>
          </div>
          <div>
            <div className="property">Check-in:</div>
            <div className="colon">:</div>
            <div className="value">{checkinDate.toDateString()}</div>
          </div>
          <div>
            <div className="property">Check-out:</div>
            <div className="colon">:</div>
            <div className="value">{checkoutDate.toDateString()}</div>
          </div>
          <div>
            <div className="property">Total-Nights:</div>
            <div className="colon">:</div>
            <div className="value">{totalNights}</div>
          </div>
          <div>
            <div className="property">Adults:</div>
            <div className="colon">:</div>
            <div className="value">{booking.noOfAdults}</div>
          </div>
          <div>
            <div className="property">Children:</div>
            <div className="colon">:</div>
            <div className="value">{booking.noOfChildren}</div>
          </div>
          <div>
            <div className="property">Pets:</div>
            <div className="colon">:</div>
            <div className="value">{booking.noOfPets}</div>
          </div>
          <div>
            <div className="property">Season:</div>
            <div className="colon">:</div>
            <div className="value">
              {booking.isLastMinuteBooking ? "Last Minute" : "Regular"}
            </div>
          </div>
        </div>
      </div>

      <div className="PaySum">
        <h1 className="mt-4 mb-5 SummaryHead">PAYMENTS SUMMARY</h1>
        <div className="ListSum">
          <div>
            <div className="property">Cleaning Fee:</div>
            <div className="colon">:</div>
            <div className="value">${booking.cleaningFee}</div>
          </div>
          <div>
            <div className="property">Pet Fee:</div>
            <div className="colon">:</div>
            <div className="value">${booking.petFee}</div>
          </div>
          <div>
            <div className="property">Total Amount Due:</div>
            <div className="colon">:</div>
            <div className="value">${booking.cleaningFee + booking.petFee}</div>
          </div>
          <div>
            <div className="property">Date of Charge:</div>
            <div className="colon">:</div>
            <div className="value">{new Date().toDateString()}</div>
          </div>
        </div>

        <div className="PaySum">
          <h1 className="mt-4 mb-3 SummaryHead">NOTES</h1>
          <div className="ListSum">
            <textarea
              id="Textarea"
              rows={4}
              cols={60}
              className="p-3"
              placeholder="Add any notes here..."
              value={notes}
              onChange={(e) => setNotesValue(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="Btun p-4 mt-4">
          <Button
            disableRipple
            onClick={handleBookingCancel}
            className="cancelBtn"
          >
            Cancel
          </Button>
          <Button
            disableRipple
            className="confirmBtn"
            onClick={handleBookingConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Confirming..." : "Confirm Booking"}
          </Button>
        </div>
      </div>
      {isLoading && <Loader />} {/* Conditionally render the Loader */}
      {SnackbarComponent}
    </Box>
  );
};

export default BookingSummaryForm;
