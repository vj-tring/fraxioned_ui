import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropertyAmenity, fetchAmenities } from '../../store/slice/amenitiesSlice';
import {
  Box,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CustomPagination from '../custom-pagination';
import './single-device.css';
import { AppDispatch } from '@/store';
import { RootState } from '@/store/reducers';
import Bedroom1Image from "../../assets/images/bedroom1.jpg";
import KingBedImage from "../../assets/images/bedroom1.jpg";

interface SingleDeviceProps {
  propertyId: number;
}

interface Room {
  image: string;
  name: string;
  Bed?: string;
}

const ITEMS_PER_PAGE = 2;
const AMENITIES_PER_PAGE = 12;

const allRooms: Room[] = [
  { name: "Bedroom 1", image: Bedroom1Image, Bed: "King size Bed" },
  { name: "King Bed", image: KingBedImage, Bed: "King size Bed" },
  { name: "Living Room", image: Bedroom1Image, Bed: "Spacious Living Area" },
  { name: "Guest Room", image: KingBedImage, Bed: "Comfortable Guest Bed" },
];

const groupAmenitiesByGroup = (data: PropertyAmenity[]) => {
  return data.reduce((acc, propertyAmenity) => {
    const groupName = propertyAmenity.amenity.amenityGroup.name;
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(propertyAmenity.amenity);
    return acc;
  }, {} as { [key: string]: PropertyAmenity['amenity'][] });
};

const SingleDevice: React.FC<SingleDeviceProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { propertyAmenities, loading, error } = useSelector((state: RootState) => state.amenities);
  const [page, setPage] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAmenities(propertyId));
  }, [dispatch, propertyId]);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const handleShowMoreClick = () => {
    setOpen(true);
  };

  const handleShowLessClick = () => {
    setOpen(false);
  };

  const paginatedRooms = allRooms.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allRooms.length / ITEMS_PER_PAGE);

  const groupedAmenities = groupAmenitiesByGroup(propertyAmenities);
  const allAmenities = propertyAmenities.map(pa => pa.amenity);
  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities.slice(0, AMENITIES_PER_PAGE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 10 }} className="singleDevice">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '50%' }} className="RoomsRes">
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" className="monsterrat checkIn">
            Rooms
          </Typography>
          <Box>
            <CustomPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {paginatedRooms.map((room: Room, index: number) => (
            <Box key={index} sx={{ flex: '1 1 calc(50% - 1rem)', display: 'flex', flexDirection: 'column' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '70%', width: '100%' }}>
                <CardMedia component="img" height="100%" image={room.image} alt={room.name} sx={{ objectFit: 'cover' }} />
              </Card>
              <CardContent sx={{ padding: 1, paddingTop: 2 }}>
                <Typography variant="h6" sx={{ fontSize: 15, fontWeight: 600 }} className="monsterrat">
                  {room.name}
                </Typography>
                {room.Bed && (
                  <Typography variant="body1" sx={{ fontSize: 12 }} className="monsterrat">
                    {room.Bed}
                  </Typography>
                )}
              </CardContent>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h6" className="monsterrat checkIn">
          Amenities
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }} className="AmenRes">
          <Box sx={{ flex: 1 }}>
            {displayedAmenities.slice(0, Math.ceil(displayedAmenities.length / 2)).map((amenity, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography variant="body2" className="monsterrat">{amenity.amenityName}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1 }}>
            {displayedAmenities.slice(Math.ceil(displayedAmenities.length / 2), displayedAmenities.length).map((amenity, index) => (
              <Box key={index} sx={{ marginBottom: 1 }}>
                <Typography variant="body2" className="monsterrat">{amenity.amenityName}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button disableRipple onClick={handleShowMoreClick} className="ShowMoreAmenities" sx={{ border: '1px solid grey' }}>
            show all {allAmenities.length} Amenities
          </Button>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleShowLessClick} fullWidth maxWidth="md">
        <DialogTitle>Amenities</DialogTitle>
        <DialogContent>
          {Object.keys(groupedAmenities).map((groupName) => (
            <Box key={groupName} sx={{ marginBottom: 2 }}>
              <Typography variant="h6" className="monsterrat">{groupName}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {groupedAmenities[groupName].map((amenity, index) => (
                  <Typography key={index} variant="body2" className="monsterrat">
                    {amenity.amenityName}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShowLessClick} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SingleDevice;