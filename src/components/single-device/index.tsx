import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PropertyAmenity,
  fetchAmenities,
} from "../../store/slice/amenitiesSlice";
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
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomPagination from "../custom-pagination";
import "./single-device.css";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import Bedroom1Image from "../../assets/images/bedroom1.jpg";
import KingBedImage from "../../assets/images/bedroom1.jpg";
import { fetchSpacePropertiesById } from "@/store/slice/spacePropertySlice";
import {
  amenitiesapi,
  fetchPropertyImagesByPropertyId,
  getAllSpacePropertyImageById,
} from "@/api/api-endpoints";

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
  }, {} as { [key: string]: PropertyAmenity["amenity"][] });
};

const SingleDevice: React.FC<SingleDeviceProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    propertyAmenities: propertyAmenities,
    loading,
    error,
  } = useSelector((state: RootState) => state.amenitiesID);
  const propertySpace = useSelector(
    (state: RootState) => state.spaceProperties.spaceProperties || []
  );

  const [imagesData, setImagesData] = useState<any[]>([]);
  const [amenitites, setAmenities] = useState<any[]>([]);

  const [page, setPage] = useState(1);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAmenities(propertyId));
    fetchAmenities1();
    console.log("amenties", propertyAmenities);
    dispatch(fetchSpacePropertiesById(propertyId));
  }, [dispatch, propertyId]);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const fetchAmenities1 = async () => {
    try {
      const response = await amenitiesapi();
      setAmenities(response.data.data);
      // console.log("amrnities")
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const imageFetching = async () => {
      try {
        const response = await getAllSpacePropertyImageById(Number(propertyId));
        const sortedImages = response.data.data.sort(
          (a: any, b: any) => a.displayOrder - b.displayOrder
        );
        setImagesData(sortedImages); // Sort images by displayOrder
        console.log("Images fetched and sorted successfully");
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    imageFetching();
  }, [propertyId]); //

  const getImageUrlByPropertyAndSpace = (spaceId: number): string | null => {
    const image = imagesData.find(
      (img) => img.propertySpace?.id === spaceId && img.displayOrder === 1
    );

    return image ? image.url : null;
  };
  const getIconUrlByAmenitiesId = (amenityId: number) => {
    console.log("amenity", amenitites);
    const icons = amenitites.find((icon) => icon.id === amenityId);

    return icons != null && icons.s3_url
      ? icons.s3_url
      : "https://placehold.jp/150x150.png";
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

  const paginatedSpaces = propertySpace.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalspacePages = Math.ceil(propertySpace.length / ITEMS_PER_PAGE);

  const groupedAmenities = groupAmenitiesByGroup(propertyAmenities || []);
  const allAmenities = propertyAmenities
    ? propertyAmenities.map((pa) => pa.amenity)
    : [];
  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities.slice(0, AMENITIES_PER_PAGE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", gap: 10 }}
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
            Spaces for Property
          </Typography>
          <Box>
            <CustomPagination
              page={page}
              totalPages={totalspacePages}
              onPageChange={handlePageChange}
            />
          </Box>
        </Box>

        {propertySpace.length === 0 ? (
          <Typography variant="body1">
            No spaces available for this property.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {paginatedSpaces.map((space, index) => (
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
                    height: "200px",
                    alignContent: "center",
                    width: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    // height="100px"
                    image={
                      getImageUrlByPropertyAndSpace(space.space.id) ||
                      "https://via.placeholder.com/100"
                    } // Placeholder for space image
                    alt={space.space.name}
                    sx={{ objectFit: "cover", height: "200px" }}
                  />
                </Card>
                <CardContent sx={{ padding: 1, paddingTop: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: 15, fontWeight: 600 }}
                    className="monsterrat"
                  >
                    {space.space.name} {space.instanceNumber}
                  </Typography>
                  {space.space.isBedTypeAllowed && (
                    <Typography
                      variant="body1"
                      sx={{ fontSize: 12 }}
                      className="monsterrat"
                    >
                      Bed Type Available
                    </Typography>
                  )}
                  {space.space.isBathroomTypeAllowed && (
                    <Typography
                      variant="body1"
                      sx={{ fontSize: 12 }}
                      className="monsterrat"
                    >
                      Bathroom Available
                    </Typography>
                  )}
                </CardContent>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{ width: "50%", display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography variant="h6" className="monsterrat checkIn">
          Amenities
        </Typography>
        {propertyAmenities && propertyAmenities.length > 0 ? (
          <Box
            sx={{ display: "flex", flexDirection: "column" }}
            className="AmenRes"
          >
            <Box>
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {displayedAmenities.map((amenity, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography
                      variant="body2"
                      className="monsterrat d-flex gap-3"
                    >
                      <img
                        src={getIconUrlByAmenitiesId(amenity.id)}
                        className="ImgIcons"
                      />
                      <div className="pt-1">{amenity.amenityName}</div>
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* <Box sx={{ flex: 1 }}>
              {displayedAmenities
                .slice(
                  Math.ceil(displayedAmenities.length / 2),
                  displayedAmenities.length
                )
                .map((amenity, index) => (
                  <Box key={index} sx={{ marginBottom: 1 }}>
                    <Typography variant="body2" className="monsterrat">
                      {amenity.amenityName}
                    </Typography>
                  </Box>
                ))}
            </Box> */}
          </Box>
        ) : (
          <Typography variant="body1">No amenities available.</Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Button
            disableRipple
            onClick={handleShowMoreClick}
            className="ShowMoreAmenities"
            sx={{ border: "1px solid grey" }}
          >
            show all {allAmenities.length} Amenities
          </Button>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={handleShowLessClick}
        fullWidth
        maxWidth="md"
        className="aminityPopup"
      >
        <DialogTitle
          sx={
            {
              // background:'red',
            }
          }
        >
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleShowLessClick}
            aria-label="close"
            sx={{
              position: "absolute",
              right: 18,
              top: 16,
              marginRight: "10px",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Typography variant="h3" className="aminityPopupTitle">
          Amenities
        </Typography>
        <DialogContent>
          {Object.keys(groupedAmenities).map((groupName) => (
            <Box key={groupName} sx={{ marginBottom: 2 }}>
              <Typography variant="h6" className="monsterrat amenityGroupName">
                {groupName}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {groupedAmenities[groupName].map((amenity, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    className="monsterrat amenityName d-flex gap-4 "
                  >
                    <img
                      src={getIconUrlByAmenitiesId(amenity.id)}
                      className="ImgIcons"
                    />
                    <div className="pt-1"> {amenity.amenityName}</div>
                    <div className="line mt-4"></div>
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SingleDevice;
