import { useState, useEffect } from "react";
import "./propertylisting.css";
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
  Skeleton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "../../assets/images/fraxionedpng.png";
import AvailableNights from "../../components/available-nights";

import SingleDevice from "../../components/single-device";
import MapEmbed from "../../components/map-embed";
import Showmore from "../../components/show-more";
import ThingsToKnow from "../../components/things-to-know";
import DatePicker from "../../components/date-picker-card";
import { DatePickerWithRange } from "@/components/calender";
import { useDispatch, useSelector } from "react-redux";
import { mockProperties } from "../home/mockData";
import {
  fetchProperties,
  selectProperty,
} from "@/store/slice/auth/property-slice";
import { AppDispatch } from "@/store";
import { Session, User } from "@/store/model";
import { propertyImageapi } from "@/api";
import { PiDotsNineBold } from "react-icons/pi";

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
}

const PropertyListingPage = () => {
  const [loading, setLoading] = useState(true);

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
  const [imageDetails, setImageDetails] = useState<Image[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user.id);

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
      // setLoading(false);
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

  const handleCheckAvailability = () => {
    console.log("Check availability:", { checkInDate, checkOutDate, guests });
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <div className="container-fluid d-flex flex-column gap-4 px-14">
      <div className="img-row pt-4 px-12">
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
           {loading && (
          <Skeleton variant="rectangular" width="100%" height="200px" />
        )}
              {imageDetails.slice(0, 1).map((image, index) => (
                <img
                  key={index}
                  src={image.imageUrl}
                  alt={image.imageName}
                  // loading="lazy"
                  onLoad={handleImageLoad}
                  className={`img-fluid img1 cornertop ${
                    currentImage === index ? "active" : ""
                  }`}
                  style={{
                    display: loading ? "none" : "block",
                    objectFit: "cover",
                  }}
                  onClick={() => setCurrentImage(index)}
                />
              ))
}
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={1}>
              {loading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={6} key={index}>
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={100}
                      />
                    </Grid>
                  ))
                : imageDetails.slice(1, 5).map((image, index) => (
                    <Grid item xs={6} key={index}>
                      <img
                        src={image.imageUrl}
                        alt={image.imageName}
                        onLoad={handleImageLoad}
                        // loading="lazy"
                        className={`img-fluid image ${
                          currentImage === index + 1 ? "active" : ""
                        }`}
                        style={{
                          display: loading ? "none" : "block",
                          objectFit: "cover",
                        }}
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
        {loading ? (
          <>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="40%" height={30} />
          </>
        ) : (
          selectedProperty && (
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
                  // loading="lazy"
                />
                <Typography
                  variant="h6"
                  className="PropertyAddress monsterrat"
                  style={{ opacity: 0.9, fontWeight: "bolder" }}
                >
                  {selectedProperty.address || "Property Address"}
                </Typography>
              </Box>
            </>
          )
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

        <div className="d-flex pt-2 h-100  PropertyFlex">
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
              <DatePickerWithRange />
            </div>
          </div>

          <div className="py-4 GridWidth1 position-relative">
            <DatePicker
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
              {imageDetails.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <img
                      src={image.imageUrl}
                      alt={image.imageName}
                      style={{ width: "100%", height: "auto" }}
                      // loading="lazy"
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
