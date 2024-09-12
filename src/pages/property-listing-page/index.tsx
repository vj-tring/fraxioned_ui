import { useState, useEffect } from "react";
import "./propertylisting.css";
import buildingImage from "../../assests/crown-jewel.jpg";
import unsplashImage1 from "../../assests/bear-lake-bluffs.jpg";
import unsplashImage2 from "../../assests/blue-bear-lake.jpg";
import unsplashImage3 from "../../assests/crown-jewel.jpg";
import unsplashImage4 from "../../assests/lake-escape.jpg";
import unsplashImage5 from "../../assets/images/building.jpg";
import { useParams } from "react-router-dom";

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
import DatePickerCard from "../../components/date-picker-card";
import { Element, Link } from "react-scroll";
import { DatePickerWithRange } from "@/components/calender";
import { useDispatch, useSelector } from "react-redux";
import { mockProperties } from "../home/mockData";
import {
  fetchProperties,
  selectProperty,
} from "@/store/slice/auth/property-slice";
import { AppDispatch } from "@/store";
import { Session, User } from "@/store/model";

const images = [
  { src: buildingImage, alt: "Exterior of Blue Bear Lake home" },
  { src: unsplashImage1, alt: "Aerial view of Blue Bear Lake home" },
  { src: unsplashImage2, alt: "Living room in Blue Bear Lake home" },
  { src: unsplashImage3, alt: "Game room in Blue Bear Lake home" },
  { src: unsplashImage4, alt: "Game room in Blue Bear Lake home" },
  { src: unsplashImage5, alt: "Game room in Blue Bear Lake home" },
];

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
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user.id);

  // const bookingData = useSelector((state: RootState) => state.bookings.bookings);

  useEffect(() => {
    dispatch(fetchProperties(userId));
  }, []);

  useEffect(() => {
    if (displayProperties.length > 0) {
      if (id) {
        const propertyId = parseInt(id, 10);
        console.log("IDp", propertyId);
        const property = displayProperties.find((p) => p.id === propertyId);
        setSelectedProperty(property || null);
        dispatch(selectProperty(propertyId));
      } else {
        setSelectedProperty(displayProperties[0]);
      }
    }
  }, [displayProperties, id]);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCheckAvailability = () => {
    console.log("Check availability:", { checkInDate, checkOutDate, guests });
  };

  return (
    <div className="container-fluid d-flex flex-column gap-4 px-14">
      <div className="img-row pt-4 px-12">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <img
              src={images[1].src}
              alt={images[1].alt}
              className={`img-fluid img1 cornertop ${
                currentImage === 0 ? "active" : ""
              }`}
              onClick={() => setCurrentImage(0)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <img
              src={images[2].src}
              alt={images[2].alt}
              className={`img-fluid image ${
                currentImage === 1 ? "active" : ""
              }`}
              onClick={() => setCurrentImage(1)}
            />
            <img
              src={images[5].src}
              alt={images[5].alt}
              className={`img-fluid image mt-1 ${
                currentImage === 2 ? "active" : ""
              }`}
              onClick={() => setCurrentImage(2)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <div className="image-container">
              <img
                src={images[3].src}
                alt={images[3].alt}
                className={`img-fluid image cornertopright ${
                  currentImage === 3 ? "active" : ""
                }`}
                onClick={() => setCurrentImage(3)}
              />
              <div className="show-more-overlay">
                <Typography
                  variant="button"
                  onClick={handleClickOpen}
                  className="show-more-text"
                >
                  Show More Photos
                </Typography>
              </div>
              <img
                src={images[4].src}
                alt={images[4].alt}
                className={`img-fluid image mt-1 cornerbottomright ${
                  currentImage === 4 ? "active" : ""
                }`}
                onClick={() => setCurrentImage(4)}
              />
            </div>
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
              className="monsterrat"
            >
              <img src={Logo} alt="Logo" style={{ width: 26, height: 26 }} />
              <Typography
                variant="h6"
                className="PropertyAddress monsterrat"
                style={{ opacity: 0.9, fontWeight: "bolder" }}
              >
                {selectedProperty.address || "Property Address"}
              </Typography>
            </Box>
          </>
        )}

        <div className="Blue-row pb-3 pt-5">
          <div>
            <Link to="myShare" smooth={true} duration={200}>
              <h1 className="Blue-rowshare" style={{ fontWeight: "bolder" }}>
                My Share
              </h1>
            </Link>
          </div>

          <div>
            <Link to="rooms" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Amenities</h1>
            </Link>
          </div>
          <div>
            <Link to="location" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Location</h1>
            </Link>
          </div>
          <div>
            <Link to="info" smooth={true} duration={200}>
              <h1 className="Blue-rowshare">Info</h1>
            </Link>
          </div>
        </div>

        <div className="d-flex pt-2 h-100">
          <div className="col-6 col-md-7 GridWidth h-100">
            <Element name="myShare" className="mt-4">
              <Showmore
                description={
                  selectedProperty ? selectedProperty?.houseDescription : ""
                }
              />
            </Element>
            {/* <hr style={{ width: '100%', backgroundColor: 'black', height: 1.2, opacity: 0.1 }} /> */}
            <Element name="availableNights">
              <AvailableNights />
            </Element>
            {/* <hr style={{ width: '100%', backgroundColor: 'black', height: 1.2, opacity: 0.1 }} /> */}
            <Element
              name="basicRangeShortcuts"
              className="mt-5 mb-3 normalcalendar"
            >
              <h1 className="checkIn mb-3">Select check-in date</h1>
              <DatePickerWithRange />
            </Element>
          </div>

          <div className="py-4 GridWidth1 position-relative">
            <DatePickerCard
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guests={guests}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              setGuests={setGuests}
              onCheckAvailability={handleCheckAvailability}
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

        <Element name="rooms" className="mt-5">
          <SingleDevice />
        </Element>
        <Element name="location">
          <MapEmbed
            city={selectedProperty ? selectedProperty?.city : "Garden City"}
            state={selectedProperty ? selectedProperty?.state : "Utah"}
            country={
              selectedProperty ? selectedProperty?.country : "United State"
            }
          />
        </Element>
        <Element name="info">
          <ThingsToKnow />
        </Element>

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
              {images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{ width: "100%", height: "auto" }}
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
      </div>
    </div>
  );
};

export default PropertyListingPage;
