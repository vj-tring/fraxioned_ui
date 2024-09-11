import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import Box from "@mui/material/Box";
// import { useSnackbar } from "../../components/snackbar-provider";
import { confirmBooking, setNotes } from "@/store/slice/auth/bookingSlice";
import { useNavigate } from "react-router-dom";
// import Loader from "../../components/loader/index";
import { AppDispatch } from "@/store";
import { Button, CircularProgress, SvgIcon, Typography } from "@mui/material";
import CustomizedSnackbars from "../../components/customized-snackbar";
import { keyframes } from "@mui/system";
// import { css } from '@emotion/react';

// import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import img1 from "../../assests/bear-lake-bluffs.jpg";
import img2 from "../../assests/blue-bear-lake.jpg";
import img3 from "../../assests/crown-jewel.jpg";
import img4 from "../../assests/lake-escape.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { clearDates } from "@/store/slice/datePickerSlice";
import { selectSelectedPropertyDetails } from "@/store/slice/auth/property-slice";
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
  totalAmountDue: 0,
};

const CheckIcon: React.FC = () => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 40, color: "#4CAF50" ,            marginRight:"3px"
  }}>
    <path d="M10 15.172l-3.707-3.707 1.414-1.414L10 12.343l7.293-7.293 1.414 1.414L10 15.172z" />
  </SvgIcon>
);

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const BookingSummaryForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { showSnackbar, SnackbarComponent } = useSnackbar();
  const { currentBooking } = useSelector((state: RootState) => state.bookings);

  const [notes, setNotesValue] = useState<string>(currentBooking?.notes || "");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const booking = currentBooking || mockBooking;
  const checkinDate = new Date(booking.checkinDate);
  const checkoutDate = new Date(booking.checkoutDate);
  const totalNights = Math.ceil(
    (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleBookingCancel = () => {
    dispatch(resetLimits());
    dispatch(clearDates());
    navigate("/home");
  };
  const handleBookingConfirm = async () => {
    setIsLoading(true);
    try {
      dispatch(setNotes(notes));
      dispatch(setNotes(notes));
      const { season, totalAmountDue, ...bookingPayload } = booking; // Exclude season and totalAmountDue
      const result = await dispatch(confirmBooking({ ...bookingPayload, notes })).unwrap();
      // setTimeout(() => {
        setIsLoading(false);
        setShowConfirmation(true);
        setSnackbarMessage(result.message);


        setTimeout(() => {
          navigate("/home/booking");
        }, 3000);
      // }, 5000);
    } catch (error) {
      setSnackbarMessage((error as string) || "Failed to confirm booking");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };


//   const fadeInLeftToRight = keyframes`
//   0% {
//     opacity: 0;
//     transform: translateX(-20px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateX(0);
//   }
// `;

// Define the animation CSS
// const animationStyle = css`
//   animation: ${fadeInLeftToRight} 1s ease-out;
// `;
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short", // Abbreviated weekday (e.g., Wed)
      month: "short", // Abbreviated month (e.g., Sep)
      day: "2-digit", // Two-digit day (e.g., 04)
      year: "numeric", // Full numeric year (e.g., 2024)
    });
  };
  return (
    <Box
      my={2}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 2,
        paddingTop: 2,
        paddingBottom: 2,
        width: "90%",
        marginLeft: "5%",
        // borderRadius: "5px",
        borderTopRightRadius:"15px",

        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      {isLoading && !showConfirmation && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
            backgroundColor: "rgba(255, 255,    255, 0.8)",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {/* {SnackbarComponent} */}

      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      {showConfirmation && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "#4CAF50",
            animation: `${fadeIn} 1s ease-in-out`,
          }}
        >
          <Typography variant="h2" component="h1" sx={{ marginTop: 2 ,
            fontSize:"24px",
          }}>
          <CheckIcon />
          Booking Successful
          </Typography>
        </Box>
      )}

      {/* {!isLoading && ( */}
      <>
        <div className="SummaryImg ">
          <Row className=" RowImg">
            <Col sm={11}>
              <img src={img1} alt="Image 1" />
            </Col>
          </Row>
          <Row className="mt-3 ">
            <Col sm={4}>
              <img src={img2} alt="Image 2" />
            </Col>
            <Col sm={4}>
              <img src={img3} alt="Image 3" />
            </Col>
            <Col sm={4}>
              <img src={img4} alt="Image 4" />
            </Col>
          </Row>
        </div>

        {/* </div> */}

        <div className="BookSum">
          <h1 className="SummaryHead">BOOKING SUMMARY</h1>
          <div className="ListSum mt-3">
            <div>
              <div className="property">Property</div>{" "}
              <div className="colon">:</div>
              <div className="value">
                {selectedPropertyDetails.propertyName}
                {/* {!booking.data
                    ? booking.property.id
                    : booking.data.property.id} */}
              </div>
            </div>
            <div>
              <div className="property">Check-in</div>
              <div className="colon">:</div>
              <div className="value">{formatDate(new Date(checkinDate))}</div>
            </div>
            <div>
              <div className="property">Check-out</div>
              <div className="colon">:</div>

              <div className="value">{formatDate(new Date(checkoutDate))}</div>
            </div>
            <div>
              <div className="property">Total Nights</div>
              <div className="colon">:</div>

              <div className="value">{totalNights}</div>
            </div>
            <div>
              <div className="property">Adults</div>
              <div className="colon">:</div>

              <div className="value">{booking.noOfAdults}</div>
            </div>
            <div>
              <div className="property">Children</div>
              <div className="colon">:</div>

              <div className="value">{booking.noOfChildren}</div>
            </div>
            <div>
              <div className="property">Pets</div>
              <div className="colon">:</div>

              <div className="value">{booking.noOfPets}</div>
            </div>
            <div>
              <div className="property">Season</div>
              <div className="colon">:</div>

              <div className="value">
                {booking.season} Season
              </div>
            </div>
          </div>
        </div>

        <div className="PaySum">
          <h1 className="SummaryHead">PAYMENTS SUMMARY</h1>
          <div className="ListSum mt-3">
            <div>
              <div className="property">Cleaning Fee</div>
              <div className="colon">:</div>

              <div className="value">${booking.cleaningFee}</div>
            </div>
            <div>
              <div className="property">Pet Fee</div>
              <div className="colon">:</div>

              <div className="value">${booking.petFee}</div>
            </div>
            <div>
              <div className="property">Total Amount Due</div>
              <div className="colon">:</div>

              <div className="value">
                ${booking.totalAmountDue}
              </div>
            </div>
            <div>
              <div className="property">Date of Charge</div>
              <div className="colon">:</div>

              <div className="value">{formatDate(new Date())}</div>
            </div>
          </div>

          <div className="Notes">
            <h1 className="SummaryHead">NOTES</h1>
            <textarea
              id="Textarea"
              rows={1}
              className="p-3 w-100"
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
      {/* )} */}
    </Box>
  );
};

export default BookingSummaryForm;