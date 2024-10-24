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
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomPagination from "../custom-pagination";
import "./single-device.css";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { fetchSpacePropertiesById } from "@/store/slice/space/property";
import {
  getAllAmenities,
  fetchPropertySpaceImagesByPropertyId,
} from "@/store/services";

interface SingleDeviceProps {
  propertyId: number;
}

const ITEMS_PER_PAGE = 2;
const AMENITIES_PER_PAGE = 3;

const SingleDevice: React.FC<SingleDeviceProps> = ({ propertyId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { propertyAmenities: propertyAmenities } = useSelector(
    (state: RootState) => state.amenitiesID
  );
  const propertySpace = useSelector(
    (state: RootState) => state.spaceProperties.spaceProperties || []
  );

  const [imagesData, setImagesData] = useState<unknown[]>([]);
  const [amenitites, setAmenities] = useState<unknown[]>([]);

  const [page, setPage] = useState(1);
  const [showAllAmenities] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAmenities(propertyId));
    fetchAmenities1();
    dispatch(fetchSpacePropertiesById(propertyId));
  }, [dispatch, propertyId]);

  const handlePageChange = (value: number) => {
    setPage(value);
  };

  const fetchAmenities1 = async () => {
    try {
      const response = await getAllAmenities();
      setAmenities(response.data.data);
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    const imageFetching = async () => {
      try {
        const response = await fetchPropertySpaceImagesByPropertyId(
          Number(propertyId)
        );
        const sortedImages = response.data.data.propertySpaceImages.sort(
          (a: any, b: any) => a.displayOrder - b.displayOrder
        );
        setImagesData(sortedImages); // Sort images by displayOrder
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    imageFetching();
  }, [propertyId]); //

  const organizeAmenitiesByAmenityGroup = (data: { amenityGroup: any[] }) => {
    if (!data || !Array.isArray(data.amenityGroup)) {
      console.warn(
        "Expected an array inside amenityGroup, but received:",
        data
      );
      return {};
    }

    return data.amenityGroup.reduce((acc, group) => {
      const groupName = group.name;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(...group.amenities);
      return acc;
    }, {} as { [key: string]: PropertyAmenity["amenity"][] });
  };

  const getImageUrlByPropertyAndSpace = (spaceId: number): string | null => {
    const image = imagesData.find(
      (img) => img.propertySpace?.id === spaceId && img.displayOrder === 1
    );
    return image ? image.url : null;
  };
  const getIconUrlByAmenitiesId = (amenityId: number) => {
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

  const paginatedSpaces = propertySpace.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalspacePages = Math.ceil(propertySpace.length / ITEMS_PER_PAGE);

  const groupedAmenities = organizeAmenitiesByAmenityGroup(
    propertyAmenities || []
  );
  const allAmenities = Array.isArray(propertyAmenities.amenityGroup)
    ? propertyAmenities.amenityGroup.map((pa) => pa.amenities)
    : [];
  const displayedAmenities = showAllAmenities
    ? allAmenities
    : allAmenities.slice(0, AMENITIES_PER_PAGE);

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
                    // component="img"
                    image={
                      getImageUrlByPropertyAndSpace(space.id) ||
                      "https://via.placeholder.com/100"
                    }
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
        {propertyAmenities.amenityGroup &&
        propertyAmenities.amenityGroup.length > 0 ? (
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
                {displayedAmenities.map((amenity, index) =>
                  amenity.map((data, index1) => {
                    return (
                      <Grid item xs={6} key={index1}>
                        <Typography
                          variant="body2"
                          className="monsterrat d-flex gap-3"
                        >
                          <img
                            src={getIconUrlByAmenitiesId(data.amenityId)}
                            className="ImgIcons"
                          />
                          <div className="pt-1">{data.amenityName}</div>
                        </Typography>
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Box>
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
                      src={getIconUrlByAmenitiesId(amenity.amenityId)}
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
