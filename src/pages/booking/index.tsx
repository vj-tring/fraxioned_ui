import React, { useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import './booking.css'; // Import custom CSS
import buildingImage from '../../assets/images/building.jpg';
import unsplashImage1 from '../../assets/images/building1.jpg';
import unsplashImage2 from '../../assets/images/building2.jpg';
import unsplashImage3 from '../../assets/images/buildingnew.jpg';
import unsplashImage4 from '../../assets/images/buildingnew.jpg';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Card, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Logo from '../../assets/images/fraxioned.png';
import AvailableNights from '../../components/available-nights';
import BasicRangeShortcuts from '../../components/basic-range-shortcuts';
import SingleDevice from '../../components/single-device';
import MapEmbed from '../../components/map-embed';
import Showmore from '../../components/show-more';
import ThingsToKnow from '../../components/things-to-know';
import DatePickerCard from '../../components/date-picker-card';
import { Element, Link } from 'react-scroll';

const images = [
  { src: buildingImage, alt: 'Exterior of Blue Bear Lake home' },
  { src: unsplashImage1, alt: 'Aerial view of Blue Bear Lake home' },
  { src: unsplashImage2, alt: 'Living room in Blue Bear Lake home' },
  { src: unsplashImage3, alt: 'Game room in Blue Bear Lake home' },
  { src: unsplashImage4, alt: 'Game room in Blue Bear Lake home' },
];

const Booking = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [guests, setGuests] = useState<number>(1);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCheckAvailability = () => {
    console.log('Check availability:', { checkInDate, checkOutDate, guests });
  };

  return (
    <Scrollbars style={{ height: '100vh' }}>
      <div className="container mt-5">
        <div className="img-row mt-4">
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <img
                src={images[0].src}
                alt={images[0].alt}
                className={`img-fluid img1 cornertop ${currentImage === 0 ? 'active' : ''}`}
                onClick={() => setCurrentImage(0)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <img
                src={images[2].src}
                alt={images[2].alt}
                className={`img-fluid image ${currentImage === 1 ? 'active' : ''}`}
                onClick={() => setCurrentImage(1)}
              />
              <img
                src={images[2].src}
                alt={images[2].alt}
                className={`img-fluid image mt-1 ${currentImage === 2 ? 'active' : ''}`}
                onClick={() => setCurrentImage(2)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <div className="image-container">
                <img
                  src={images[3].src}
                  alt={images[3].alt}
                  className={`img-fluid image cornertopright ${currentImage === 3 ? 'active' : ''}`}
                  onClick={() => setCurrentImage(3)}
                />
                <div className="show-more-overlay">
                  <Typography variant="button" onClick={handleClickOpen} className="show-more-text">
                    Show More Photos
                  </Typography>
                </div>
                <img
                  src={images[4].src}
                  alt={images[4].alt}
                  className={`img-fluid image mt-1 cornerbottomright ${currentImage === 4 ? 'active' : ''}`}
                  onClick={() => setCurrentImage(4)}
                />
              </div>
            </Grid>
          </Grid>
        </div>

        <Typography variant="h5" className="mt-4 PropertyName monsterrat">Blue Bear Lake</Typography>

        <Box display="flex" alignItems="center" className="monsterrat">
          <img src={Logo} alt="Logo" style={{ width: 20, height: 26, marginRight: 8 }} />
          <Typography variant="h6" className='PropertyAddress monsterrat mt-2'>
            537 Blue Lake St, Garden City, UT 80428
          </Typography>
        </Box>

        <div className="Blue-row mt-5">
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Link to="myShare" smooth={true} duration={500}>
                <Typography className='Blue-rowshare'>My Share</Typography>
              </Link>
            </Grid>
            {/* <Grid item xs={2}>
              <Link to="rooms" smooth={true} duration={500}>
                <Typography className='Blue-rowshare'>Rooms</Typography>
              </Link>
            </Grid> */}
            <Grid item xs={2}>
              <Link to="rooms" smooth={true} duration={500}>
                <Typography className='Blue-rowshare'>Amenities</Typography>
              </Link>
            </Grid>
            <Grid item xs={2}>
              <Link to="location" smooth={true} duration={500}>
                <Typography className='Blue-rowshare'>Location</Typography>
              </Link>
            </Grid>
            <Grid item xs={2}>
              <Link to="info" smooth={true} duration={500}>
                <Typography className='Blue-rowshare'>Info</Typography>
              </Link>
            </Grid>
          </Grid>
        </div>

        <hr />

        <div className="row mt-3">
          <Grid item xs={12} md={7} sx={{ Height: '40' }}>
            <Element name="myShare">
              <Showmore />
            </Element>
            <hr style={{ width: '110%' }} />
            <Element name="availableNights">
              <AvailableNights />
            </Element>
            <hr style={{ width: '110%' }} />
            <Element name="basicRangeShortcuts">
              <BasicRangeShortcuts />
            </Element>
          </Grid>

          <Grid item xs={12} md={5} sx={{ position: 'sticky', top: 0 }}>
            <DatePickerCard
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guests={guests}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              setGuests={setGuests}
              onCheckAvailability={handleCheckAvailability}
            />
          </Grid>
        </div>

        <hr style={{ width: '50%' }} />

        <Element name="rooms">
          <SingleDevice />
        </Element>
        <Element name="location">
          <MapEmbed />
        </Element>
        <Element name="info">
          <ThingsToKnow />
        </Element>

        <Dialog
          open={dialogOpen}
          onClose={handleClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle className='d-flex justify-content-between'>
            <Typography variant="h6">More Photos</Typography>
            <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {images.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <img src={image.src} alt={image.alt} style={{ width: '100%', height: 'auto' }} />
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
    </Scrollbars>
  );
};

export default Booking;
