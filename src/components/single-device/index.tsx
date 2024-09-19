import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  ListItem,
  Box,
  Button,
} from "@mui/material";
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
  LocalBar,
} from "@mui/icons-material";
import Bedroom1Image from "../../assets/images/bedroom1.jpg"; // Ensure these paths are correct
import KingBedImage from "../../assets/images/bedroom1.jpg"; // Ensure these paths are correct
import CustomPagination from "../custom-pagination";
import "./single-device.css";
interface Room {
  name: string;
  image: string;
  Bed?: string; // Optional description for bed type
}

interface Amenities {
  amenities: { name: string; icon: React.ReactNode }[];
}

const allRooms: Room[] = [
  { name: "Bedroom 1", image: Bedroom1Image, Bed: "King size Bed" },
  { name: "King Bed", image: KingBedImage, Bed: "King size Bed" },
  { name: "Living Room", image: Bedroom1Image, Bed: "Spacious Living Area" },
  { name: "Guest Room", image: KingBedImage, Bed: "Comfortable Guest Bed" },
];

const allAmenities: Amenities = {
  amenities: [
    { name: "Kitchen", icon: <Kitchen /> },
    { name: "Air Conditioning", icon: <AcUnit /> },
    { name: "Wi-Fi", icon: <Wifi /> },
    { name: "Parking", icon: <LocalParking /> },
    { name: "TV", icon: <Tv /> },
    { name: "Pool", icon: <Pool /> },
    { name: "Spa", icon: <Spa /> },
    { name: "Fitness Center", icon: <FitnessCenter /> },
    { name: "Smoke-Free", icon: <SmokeFree /> },
    { name: "Bar", icon: <LocalBar /> },
  ],
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

  const paginatedRooms = allRooms.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(allRooms.length / ITEMS_PER_PAGE);

  const displayedAmenities = showAllAmenities
    ? allAmenities.amenities
    : allAmenities.amenities.slice(0, AMENITIES_PER_PAGE);

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 10 }} 
    className="singleDevice"
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, width: "50%" }}

        className="RoomsRes"
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component="div"
            className="monsterrat checkIn"
          >
            Rooms
          </Typography>
          <Box>
            <CustomPagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {paginatedRooms.map((room, index) => (
            <Box
              key={index}
              sx={{
                flex: "1 1 calc(50% - 1rem)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "70%",
                  width: "100%",
                }}
              >
                <CardMedia
                  component="img"
                  height="100%"
                  image={room.image}
                  alt={room.name}
                  sx={{ objectFit: "cover" }}
                />
              </Card>
              <CardContent sx={{ padding: 1, paddingTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: 15, fontWeight: 600 }}
                  className="monsterrat"
                >
                  {room.name}
                </Typography>
                {room.Bed && (
                  <Typography
                    variant="body1"
                    sx={{ fontSize: 12 }}
                    className="monsterrat"
                  >
                    {room.Bed}
                  </Typography>
                )}
              </CardContent>
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        
        <Typography variant="h6" className="monsterrat checkIn">
          Amenities
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}
         className="AmenRes"
        >
          <Box sx={{ flex: 1 }}>
            {displayedAmenities.slice(0, 5).map((amenity, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
                >
                  {amenity.icon}
                </Box>
                <div className="monsterrat">{amenity.name}</div>
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1 }}>
            {displayedAmenities.slice(5, 10).map((amenity, index) => (
              <Box
                key={index}
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", marginRight: 2 }}
                >
                  {amenity.icon}
                </Box>
                <div className="monsterrat">{amenity.name}</div>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          {!showAllAmenities ? (
            <Button
              disableRipple
              onClick={handleShowMoreClick}
              className="ShowMoreAmenities "
              sx={{ border: "1px solid grey" }}
            >
              show all 60 Amenities
            </Button>
          ) : (
            <Button
              disableRipple
              onClick={handleShowLessClick}
              className="ShowMoreAmenities"
              sx={{ border: "1px solid grey" }}
            >
              Show Less Amenities
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SingleDevice;
