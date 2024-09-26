import { useState, useEffect } from "react";
import "./propertylisting.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../../assets/images/fraxionedpng.png";
import AvailableNights from "../../components/available-nights";
import SingleDevice from "../../components/single-device";
import MapEmbed from "../../components/map-embed";
import Showmore from "../../components/show-more";
import ThingsToKnow from "../../components/things-to-know";
import { DatePickerWithRange } from "@/components/calender";
import { useDispatch, useSelector } from "react-redux";
import { mockProperties } from "../home/mockData";
import {
  fetchProperties,
  selectProperty,
  selectSelectedPropertyDetails,
} from "@/store/slice/auth/property-slice";
import { AppDispatch } from "@/store";
import { Session, User } from "@/store/model";
import { propertyImageapi } from "@/api";
import { PiDotsNineBold } from "react-icons/pi";
import { bookingSummary, saveBooking } from "@/store/slice/auth/bookingSlice";
import CustomizedSnackbar from "@/components/customized-snackbar";
import calendarData from "@/components/calender/calendarData.json";
import { DateRange } from "react-day-picker";
import DatePickerCard from "../../components/date-picker-card";
import { Skeleton } from "@mui/material"; // Ensure you have this import

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

interface Space {
  id: number;
  name: string;
}

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

interface RootState {
  auth: any;
  properties: {
    cards: Property[];
    loading: boolean;
    error: string | null;
  };
  bookings: {
    bookings: [];
    currentBooking: null;
    error: null;
    successMessage: string | null;
    isLoading: false;
  };
  users: {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
  };
  datePicker: {
    errorMessage: string | null;
  };
}

const PropertyListingPage = () => {
  const { cards: properties } = useSelector(
    (state: RootState) => state.properties
  );
  const displayProperties = properties.length ? properties : mockProperties;
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [guests, setGuests] = useState<number>(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [imageDetails, setImageDetails] = useState<Image[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "error"
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);
  const calendarError = useSelector(
    (state: RootState) => state.datePicker.errorMessage
  );
  const [isAvailable, setIsAvailable] = useState(false);
  const counts = useSelector((state: RootState) => state.limits.counts);

  const [loadingImages, setLoadingImages] = useState(true); // Step 1: Loading state

  useEffect(() => {
    dispatch(fetchProperties(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (displayProperties.length > 0) {
      if (id) {
        const propertyId = parseInt(id, 10);
        const property = displayProperties.find((p) => p.id === propertyId);
        setSelectedProperty(property || null);
        dispatch(selectProperty(propertyId));
      } else {
        setSelectedProperty(displayProperties[0]);
      }
    }
  }, [displayProperties, id, dispatch]);

  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const propertyId = parseInt(id, 10);
        if (isNaN(propertyId)) {
          console.error("Invalid propertyId:", id);
          return;
        }
        const response = await propertyImageapi();
        const filterById = response.data.data.filter(
          (image: Image) =>
            image.property?.id === propertyId && image.displayOrder
        );
        const sortedImages = filterById.sort(
          (a: Image, b: Image) => a.displayOrder - b.displayOrder
        );
        setImageDetails(sortedImages);
        setLoadingImages(false);
      } catch (error) {
        console.error("Error fetching property images:", error);
      }
    };
    fetchPropertyImages();
  }, [id]);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

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

  const isLastMinuteBooking = (checkInDate: Date) => {
    const today = new Date();
    const diffInDays =
      (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays;
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleCheckAvailability = async () => {
    if (calendarError) {
      showSnackbar(
        "You can't book the date you have selected. Please choose a valid date range.",
        "error"
      );
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      showSnackbar("Please select both check-in and check-out dates.");
      return;
    }

    if (!currentUser) {
      showSnackbar("User is not logged in. Please log in to make a booking.");
      return;
    }

    if (!selectedPropertyDetails) {
      showSnackbar("No property selected. Please select a property to book.");
      return;
    }

    const checkinDate = new Date(
      Date.UTC(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        12,
        0,
        0
      )
    );

    const checkoutDate = new Date(
      Date.UTC(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        12,
        0,
        0
      )
    );

    const bookingData = {
      user: { id: currentUser.id },
      property: { id: selectedPropertyDetails.id },
      createdBy: { id: currentUser.id },
      checkinDate: checkinDate.toISOString(),
      checkoutDate: checkoutDate.toISOString(),
      noOfGuests: counts.Adults + counts.Children,
      noOfPets: counts.Pets,
      isLastMinuteBooking: isLastMinuteBooking(checkinDate),
      noOfAdults: counts.Adults,
      noOfChildren: counts.Children,
      notes: "",
    };

    try {
      console.log("Submitting booking data:", bookingData);
      const result = await dispatch(bookingSummary(bookingData)).unwrap();

      if (result && !result.error) {
        console.log("Booking summary created successfully:", result);

        const updatedBookingData = {
          ...bookingData,
          season: result.season,
          cleaningFee: result.cleaningFee,
          petFee: result.petFee,
          totalAmountDue: result.totalAmountDue,
        };

        await dispatch(saveBooking(updatedBookingData));
        setIsAvailable(true);
      } else {
        throw new Error(
          result.message || "An error occurred while processing your booking."
        );
      }
    } catch (error: any) {
      console.error("Error during booking process:", error);
      if (error.statusCode === 403) {
        showSnackbar(
          error.message ||
            "An error occurred while processing your booking. Please check your try again.",
          "error"
        );
      } else {
        showSnackbar(
          error.message ||
            "An error occurred while processing your booking. Please try again.",
          "error"
        );
      }
    }
  };

  const handleNavigateToSummary = () => {
    navigate("/home/booking-summary");
  };

  return (
    <div className="container-fluid d-flex flex-column gap-4 px-14">
      <div className="img-row pt-4 px-12">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            {loadingImages ? ( // Step 2: Display Skeleton
              <Skeleton variant="rectangular" width="100%" height={400} />
            ) : (
              imageDetails
                .slice(0, 1)
                .map((image, index) => (
                  <img
                    key={index}
                    src={image.imageUrl}
                    alt={image.imageName}
                    loading="lazy"
                    className={`img-fluid img1 cornertop ${
                      currentImage === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {loadingImages // Step 2: Display Skeleton for thumbnails
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={6} key={index}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={195}
                      />
                    </Grid>
                  ))
                : imageDetails.slice(1, 5).map((image, index) => (
                    <Grid item xs={6} key={index}>
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        loading="lazy"
                        className={`img-fluid image ${
                          currentImage === index + 1 ? "active" : ""
                        }`}
                        onClick={() => setCurrentImage(index + 1)}
                      />
                    </Grid>
                  ))}
              {imageDetails.length > 5 && (
                <Grid item xs={12}>
                  <div className="image-container">
                    <div className="show-more-overlay">
                      <PiDotsNineBold
                        style={{ fontSize: ".87rem", fontWeight: "bolder" }}
                      />
                      <Typography
                        variant="button"
                        onClick={handleClickOpen}
                        className="show-more-text"
                      >
                        Show all photos
                      </Typography>
                    </div>
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className="px-12 d-flex flex-column">
        {selectedProperty && (
          <>
            <Typography variant="h4" className="PropertyName monsterrat">
              {selectedProperty &&
              (selectedProperty.id === 1 || selectedProperty.id === 2)
                ? "Paradise Shores"
                : selectedProperty?.name || "Property Name"}
            </Typography>
            <Box
              display="flex"
              alignItems="flex-end"
              gap={0.5}
              className="monsterrat location"
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ width: 26, height: 26 }}
                loading="lazy"
              />
              <Typography
                variant="h6"
                className="PropertyAddress monsterrat "
                style={{ opacity: 0.9, fontWeight: "bolder" }}
              >
                
                <div>{selectedProperty.address || "Property Address"}</div>,
                <div>{selectedProperty.city || "Property Address"}</div>,
                <div>{selectedProperty.state || "Property Address"}</div>,
                <div>{selectedProperty.country || "Property Address"}</div>,
                <div>{selectedProperty.zipcode || "Property Address"}</div>
              </Typography>
            </Box>
          </>
        )}
        <div className="Blue-row pb-3 pt-5">
          <div>
            <a href="#myShare" smooth={true} duration={200}>
              <h1 className="Blue-rowshare" style={{ fontWeight: "bolder" }}>
                My Share
              </h1>
            </a>
          </div>
          <div>
            <a href="#rooms" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Amenities</h1>
            </a>
          </div>
          <div>
            <a href="#location" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Location</h1>
            </a>
          </div>
          <div>
            <a href="#info" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Info</h1>
            </a>
          </div>
        </div>
        <div className="d-flex pt-2 h-100">
          <div className="col-6 col-md-7 GridWidth h-100">
            <div id="myShare" className="mt-4">
              <Showmore
                description={
                  selectedProperty ? selectedProperty?.houseDescription : ""
                }
              />
            </div>
            <div id="availableNights">
              <AvailableNights />
            </div>
            <div id="basicRangeShortcuts" className="mt-5 mb-3 normalcalendar">
              <h1 className="checkIn mb-3">Select check-in date</h1>
              <DatePickerWithRange
                onSelect={handleDateRangeSelect}
                initialRange={dateRange}
                propertyColor={""}
              />
            </div>
          </div>
          <div className="py-4 GridWidth1 position-relative">
            <DatePickerCard
              guests={guests}
              setGuests={setGuests}
              onCheckAvailability={handleCheckAvailability}
              isAvailable={isAvailable}
              onNavigateToSummary={handleNavigateToSummary}
              dateRange={dateRange}
              onDateRangeSelect={handleDateRangeSelect}
            />
          </div>
        </div>
        <hr
          style={{
            width: "100%",
            backgroundColor: "black",
            height: 1.2,
            opacity: 0.1,
          }}
        />
        <div id="rooms" className="mt-5">
          <SingleDevice />
        </div>
        <div id="location">
          <MapEmbed
            city={selectedProperty ? selectedProperty?.city : "Garden City"}
            state={selectedProperty ? selectedProperty?.state : "Utah"}
            country={
              selectedProperty ? selectedProperty?.country : "United State"
            }
          />
        </div>
        <div id="info">
          <ThingsToKnow />
        </div>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle className="d-flex justify-content-between">
            <Typography variant="h6">More Photos</Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {!loadingImages
                ? Array.from({ length: 6 }).map((_, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={200}
                      />
                    </Grid>
                  ))
                : imageDetails.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card>
                        <img
                          src={image.imageUrl}
                          alt={image.imageName}
                          style={{ width: "100%", height: "auto" }}
                          loading="lazy"
                        />
                      </Card>
                    </Grid>
                  ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <CustomizedSnackbar
          open={snackbarOpen}
          handleClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </div>
    </div>
  );
};

export default PropertyListingPage;
