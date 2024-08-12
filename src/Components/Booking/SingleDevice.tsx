import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  ListItem,
  Box,
  Button
} from '@mui/material';
import {
  Kitchen,
  AcUnit,
  Wifi,
  LocalParking,
  Tv,
  Pool,
  Spa,
  FitnessCenter,
  SmokeFree,
  LocalBar
} from '@mui/icons-material';
import Bedroom1Image from '../../assets/bedroom1.jpg';  // Ensure these paths are correct
import KingBedImage from '../../assets/bedroom1.jpg';    // Ensure these paths are correct
import CustomPagination from './CustomPagination '
import './SingleDevice.css';
interface Room {
  name: string;
  image: string;
  Bed?: string; // Optional description for bed type
}

interface Amenities {
  amenities: { name: string; icon: React.ReactNode }[];
}

const allRooms: Room[] = [
  { name: 'Bedroom 1', image: Bedroom1Image, Bed: 'King size Bed' },
  { name: 'King Bed', image: KingBedImage, Bed: 'King size Bed' },
  { name: 'Living Room', image: Bedroom1Image, Bed: 'Spacious Living Area' },
  { name: 'Guest Room', image: KingBedImage, Bed: 'Comfortable Guest Bed' }
];

const allAmenities: Amenities = {
  amenities: [
    { name: 'Kitchen', icon: <Kitchen /> },
    { name: 'Air Conditioning', icon: <AcUnit /> },
    { name: 'Wi-Fi', icon: <Wifi /> },
    { name: 'Parking', icon: <LocalParking /> },
    { name: 'TV', icon: <Tv /> },
    { name: 'Pool', icon: <Pool /> },
    { name: 'Spa', icon: <Spa /> },
    { name: 'Fitness Center', icon: <FitnessCenter /> },
    { name: 'Smoke-Free', icon: <SmokeFree /> },
    { name: 'Bar', icon: <LocalBar /> }
  ]
};

const ITEMS_PER_PAGE = 2;
const AMENITIES_PER_PAGE = 12;

const SingleDevice: React.FC = () => {
  const [page, setPage] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Adjusted to match the expected signature
  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const handleShowMoreClick = () => {
    setShowAllAmenities(true);
  };

  const handleShowLessClick = () => {
    setShowAllAmenities(false);
  };

  const paginatedRooms = allRooms.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(allRooms.length / ITEMS_PER_PAGE);

  const displayedAmenities = showAllAmenities
    ? allAmenities.amenities
    : allAmenities.amenities.slice(0, AMENITIES_PER_PAGE);

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <span className='d-flex flex-row justify-content-between mb-3'>
                <Typography variant="h5" component="div"  className='monsterrat'>
                  Rooms
                </Typography>
                <Box sx={{ marginBottom: 2 }}>
                  <CustomPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </Box>
              </span>

              <Grid container spacing={2}>
                {paginatedRooms.map((room, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card sx={{ display: 'flex', flexDirection: 'column',height: '70%',width:'100%' }}>
                      <CardMedia
                        component="img"
                        height="100%"
                        image={room.image}
                        alt={room.name}
                        sx={{ objectFit: 'cover' }}
                      />
                     
                    </Card>
                    <CardContent sx={{ padding: 1, paddingTop: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 500 }} className='monsterrat'>
                          {room.name}
                        </Typography>
                        {room.Bed && (
                          <Typography variant="body2" color="textSecondary" sx={{ fontSize: 10 }} className='monsterrat'>
                            {room.Bed}
                          </Typography>
                        )}
                      </CardContent>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Amenities Section */}
            <Grid item xs={12} sm={6} style={{paddingLeft:'100px'}} >
              <Typography variant="h6" gutterBottom className='monsterrat ' >
                Amenities
              </Typography>
              <Grid container spacing={0} className='mt-4'>
                {displayedAmenities.map((amenity, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <ListItem sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                        {amenity.icon}
                      </Box>
                      <div  className='monsterrat' >{amenity.name} </div>
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2,
              
               }}>
                {!showAllAmenities ? (
                  <Button disableRipple onClick={handleShowMoreClick} className='ShowMoreAmenities monsterrat '
                  style={{
                    border:'1px solid grey'
                  }}> 
                    show all 60 Amenities
                  </Button>
                ) : (
                  <Button disableRipple onClick={handleShowLessClick} className='ShowMoreAmenities monsterrat'   style={{
                    border:'1px solid grey'
                  }}>
                    Show Less Amenities
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SingleDevice;
