import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import Box from "@mui/material/Box";
import { confirmBooking, setNotes } from "@/store/slice/auth/bookingSlice";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store";
import {
  Button,
  CircularProgress,
  SvgIcon,
  Typography,
  Skeleton,
} from "@mui/material";
import CustomizedSnackbars from "../../components/customized-snackbar";
import { keyframes } from "@mui/system";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { clearDates } from "@/store/slice/datePickerSlice";
import {
  selectSelectedPropertyDetails,
  User,
} from "@/store/slice/auth/property-slice";
import { propertyImageapi } from "@/api";
import { CheckCircle } from "lucide-react";

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

interface Property {
  id: number;
  name?: string;
  address?: string;
  propertyShare?: string;
  houseDescription?: string;
  state?: string;
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
}

// Interface for space details
interface Space {
  id: number;
  name: string;
}

// Interface for space type details
interface SpaceType {
  id: number;
  name: string;
  space: Space;
}

export interface Image {
  createdAt: string;
  updatedAt: string;
  id: number;
  imageUrl: string;
  imageName: string;
  displayOrder: number;
  spaceType: SpaceType;
  property: Property;
  createdBy: User;
  updatedBy: User;
}

const CheckIcon: React.FC = () => (
  <SvgIcon
    viewBox="0 0 24 24"
    sx={{ fontSize: 40, color: "#4CAF50", marginRight: "3px" }}
  >
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
  const { currentBooking } = useSelector((state: RootState) => state.bookings);
  const currentBookingId = useSelector(
    (state: RootState) => state.properties.selectedCard?.id
  );

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
  const [imageDetails, setImageDetails] = useState<Image[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState(false); // New state for booking success
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const response = await propertyImageapi();
        const filterById = response.data.data.filter(
          (image: Image) =>
            image.property?.id === currentBookingId && image.displayOrder
        );
        const sortedImages = filterById.sort(
          (a: Image, b: Image) => a.displayOrder - b.displayOrder
        );
        setImageDetails(sortedImages);
      } catch (error) {
        console.error("Error fetching property images:", error);
      }
    };

    fetchPropertyImages();
  }, [currentBookingId]);

  const handleBookingCancel = () => {
    dispatch(resetLimits());
    dispatch(clearDates());
    navigate("/");
  };

  const handleBookingConfirm = async () => {
    setIsLoading(true);
    try {
      dispatch(setNotes(notes));
      const { season, totalAmountDue, ...bookingPayload } = booking;
      const result = await dispatch(
        confirmBooking({ ...bookingPayload, notes })
      ).unwrap();

      setBookingSuccess(true);
      setIsVisible(true);
      setTimeout(() => {
        navigate("/bookings");
      }, 1000);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      {isLoading && !isVisible && !bookingSuccess && (
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
            backgroundColor: "rgb(255, 255, 255, 0.5)",
            zIndex: 1000,
          }}
        >
          <CircularProgress
            size="50px"
            sx={{
              color: "#DC9751"
            }}
          />
        </Box>
      )}

      {isVisible && bookingSuccess && (
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
            backgroundColor: "white",
            zIndex: 1000,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 2s ease",
          }}
          // className={`transition-transform duration-1000 ease-out ${
          //   isVisible ? "translate-y-0" : "translate-y-full"
          // }`}
        >
          <Box className="relative BookedCheck">
            <CheckCircle size={100} className="text-green-500" />
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Box className="w-8 h-8 bg-green-500 rounded-full animate-ping " />
            </Box>
          </Box>
          <div className="BookConfirm">Booking Confirmed</div>
        </Box>
      )}
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
          borderTopRightRadius: "15px",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          position: "relative",
        }}
      >
        <CustomizedSnackbars
          open={showSnackbar}
          handleClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />

        <div className="Booking-Summary">
          <div className="SummaryImg">
            <Row className="RowImg">
              <Col sm={11}>
                {isLoading ? (
                  <Skeleton variant="rectangular" width="100%" height={200} />
                ) : imageDetails[0] ? (
                  <img
                    src={imageDetails[0].imageUrl}
                    alt={`Image ${imageDetails[0].displayOrder}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "240px",
                      objectFit: "cover",
                    }}
                    className="PropImgHeadHeight"
                  />
                ) : (
                  <div className="placeholder-image">No Image</div>
                )}
              </Col>
            </Row>
            <Row className="mt-3 SumImg">
              {/* {isLoading ? (
                <>
                  <Col sm={4}>
                    <Skeleton variant="rectangular" width="100%" height={150} />
                  </Col>
                  <Col sm={4}>
                    <Skeleton variant="rectangular" width="100%" height={150} />
                  </Col>
                  <Col sm={4}>
                    <Skeleton variant="rectangular" width="100%" height={150} />
                  </Col>
                </>
              ) : ( */}
              {
                imageDetails.slice(1, 4).map((image, index) => (
                  <Col sm={4} key={index}>
                    <img
                      src={image.imageUrl}
                      alt={`Image ${image.displayOrder}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      className="PropImgHeight"
                    />
                  </Col>
                ))
              }
              {/* )} */}
            </Row>
          </div>

          <div className="BookSum">
            <h1 className="SummaryHead">BOOKING SUMMARY</h1>
            <div className="ListSum mt-3">
              {/* {isLoading ? (
                <>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="40%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                </>
              ) : ( */}
                <>
                  <div>
                    <div className="property">Property</div>
                    <div className="colon">:</div>
                    <div className="value">
                      {selectedPropertyDetails?.propertyName || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="property">Check-in</div>
                    <div className="colon">:</div>
                    <div className="value">
                      {formatDate(new Date(checkinDate))}
                    </div>
                  </div>
                  <div>
                    <div className="property">Check-out</div>
                    <div className="colon">:</div>
                    <div className="value">
                      {formatDate(new Date(checkoutDate))}
                    </div>
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
                    <div className="value">{booking.season || "N/A"}</div>
                  </div>
                </>
              {/* )} */}
            </div>
          </div>

          <div className="PaySum">
            <h1 className="SummaryHead">PAYMENTS SUMMARY</h1>
            <div className="ListSum mt-3">
              {/* {isLoading ? (
                <>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="40%" height={16} sx={{ mt: 1 }} />
                  <Skeleton width="50%" height={16} sx={{ mt: 1 }} />
                </>
              ) : ( */}
                <>
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
                    <div className="value">${booking.totalAmountDue}</div>
                  </div>
                  <div>
                    <div className="property">Date of Charge</div>
                    <div className="colon">:</div>
                    <div className="value">{formatDate(new Date())}</div>
                  </div>
                </>
              {/* )} */}
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
                variant="outlined"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                disableRipple
                onClick={handleBookingConfirm}
                className="confirmBtn"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? "Confirming..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        </div>
      </Box>
    </>
  );
};

export default BookingSummaryForm;
