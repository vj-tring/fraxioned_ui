import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import {
  getByPropertySpaceId,
  updatePropertyAmenities,
} from "@/store/slice/auth/propertyamenities";
import { propertySpaceImageuploadapi } from "@/api/api-endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchAmenities } from "@/store/slice/amenity";
import {
  deleteImagesBatch,
  fetchImagesByPropertySpaceId,
  selectSpaceImages,
} from "@/store/slice/space/images";
import AmenitiesTab from "./property-space-tabs/amenities-tab";
import PhotosTab from "./property-space-tabs/photos-tab";
import BedTypesTab from "./property-space-tabs/bed-type-tab";
import { ChevronLeft, Trash2 } from "lucide-react";
import BathTypesTab from "./property-space-tabs/bath-type-tab";
import { deleteExistingSpaceProperty } from "@/store/slice/space/property";
import { createOrDeletePropertySpaceBeds, fetchAllSpaceBedTypes } from "@/store/slice/bedSlice";
import { createOrDeletePropertySpaceBathrooms, fetchAllSpaceBathroomTypes } from "@/store/slice/bathroom-slice";
import { fetchAllSpaces } from "@/store/slice/space/actions";
import { fetchPropertyAllRooms } from "@/store/slice/properties/propertyallrooms/action";
import CustomizedSnackbars from "@/components/customized-snackbar";

export default function Component({ initialSpace = {} }) {
  const location = useLocation();
  const { space = initialSpace } = location.state || {};
  const navigate = useNavigate();
  const { id: propertyId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const showBedTypesTab = space?.isBedType ?? false;
  const showBathTypesTab = space?.isBathroomType ?? false;
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const spaceData = useSelector((state: RootState) => state.spaces.spaces || []);
  const {
    amenities: allAmenities,
    status: amenitiesStatus,
    error: amenitiesError,
  } = useSelector((state: RootState) => state.amenities);


  const spaceImages = useSelector(selectSpaceImages);
  const spaceImageLoading = useSelector(
    (state: RootState) => state.spaceImage.loading
  );
  const spaceImageError = useSelector(
    (state: RootState) => state.spaceImage.error
  );
  const properbed = space.propertySpaceBeds || []
  const properbath = space.propertySpaceBathrooms || []

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const [updatedAmenities, setUpdatedAmenities] = useState<number[]>([]);
  const [localPropertyAmenities, setLocalPropertyAmenities] = useState<any[]>([]);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [combinedImages, setCombinedImages] = useState<
    Array<{ id?: number; url: string; isNew?: boolean }>
  >([]);
  const propertyAmenityGroup = space.amenityGroups || []
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "info" | "warning" | "error";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    dispatch(fetchAllSpaces());
  }, [dispatch])

  const generateTabsList = () => {
    const tabs = [
      { value: "photos", label: "Photos" },
      { value: "amenities", label: "Amenities" },
    ];

    if (showBathTypesTab) {
      tabs.splice(1, 0, { value: "bathTypes", label: "Bath Types" });
    }

    if (showBedTypesTab) {
      tabs.splice(1, 0, { value: "bedTypes", label: "Bed Types" });
    }

    return tabs;
  };
  const tabsList = generateTabsList();

  useEffect(() => {
    if (space?.spaceId) {
      dispatch(fetchAllSpaceBedTypes());
      dispatch(fetchAllSpaceBathroomTypes());
    }
    dispatch(fetchAmenities());
  }, [space, dispatch]);

  useEffect(() => {
    dispatch(fetchPropertyAllRooms(Number(propertyId)));
  }, [])


  useEffect(() => {
    if (propertyAmenityGroup.length > 0) {
      setUpdatedAmenities(
        propertyAmenityGroup.flatMap((group) => group.amenities.map((amenity) => amenity.amenityId))
      );
      setLocalPropertyAmenities(propertyAmenityGroup);
    }
  }, [propertyAmenityGroup]);


  useEffect(() => {
    const fetchedImages = space.propertySpaceImages.map((img) => ({
      id: img.id,
      url: img.url,
    }));
    const newImages = photoPreviews.map((url, index) => ({
      url,
      isNew: true,
      id: `new-${index}`,
    }));
    setCombinedImages([...fetchedImages, ...newImages]);
  }, [space, photoPreviews]);

  const amenityGroups = allAmenities.reduce((groups, amenity) => {
    const groupName = amenity.amenityGroup.name;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(amenity);
    return groups;
  }, {} as Record<string, typeof allAmenities>);

  const propertyAmenityGroups = localPropertyAmenities.reduce(
    (groups, { name, amenities }) => {
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(...amenities);
      return groups;
    },
    {} as Record<string, any[]>
  );
  console.log("mapping id", propertyAmenityGroups);

  const handleAddAmenity = () => {
    if (selectedAmenity) {
      const amenityId = parseInt(selectedAmenity, 10);
      const newAmenity = allAmenities.find((amenity) => amenity.id === amenityId);
      if (newAmenity) {
        setUpdatedAmenities((prev) => [...prev, amenityId]);
        setLocalPropertyAmenities((prev) => [
          ...prev,
          {
            name: newAmenity.amenityGroup.name,
            amenities: [newAmenity],
            propertySpace: { id: space.id },
            createdBy: { id: userId },
            property: { id: { propertyId } }
          },
        ]);
      } else {
        console.warn("New amenity not found", amenityId);
      }
      setSelectedAmenity(""); // Clear the selection
    }
  };


  const handleRemoveAmenity = (amenityId: number) => {
    // Update the updatedAmenities state
    setUpdatedAmenities((prev) => prev.filter((id) => id !== amenityId));

    // Remove the amenity from localPropertyAmenities and filter out empty categories
    setLocalPropertyAmenities((prev) =>
      prev
        .map((category) => ({
          ...category,
          amenities: category.amenities.filter((amenity) => amenity.amenityId !== amenityId), // Filter out the specific amenity
        }))
        .filter((category) => category.amenities.length > 0) // Remove categories that have no amenities left
    );
  };


  const saveAmenityChanges = async () => {
    if (space?.spaceId && userId) {
      const updateData = {
        property: { id: Number(propertyId) },
        propertySpace: { id: space.id },
        amenities: updatedAmenities.map((id) => ({ id })),
        updatedBy: { id: userId },
      };
      const response = await dispatch(updatePropertyAmenities(updateData)).unwrap();
      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        await dispatch(fetchPropertyAllRooms(Number(propertyId)));
      }
      else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "error",
        });
      }
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      // ...prev,
      [category]: !prev[category],
    }));
  };
  const handleDeletePhoto = (imageId: number | string) => {
    if (typeof imageId === "number") {
      setImagesToDelete((prev) => [...prev, imageId]);
      setCombinedImages((prev) => prev.filter((img) => img.id !== imageId));
    } else {
      const index = parseInt(imageId.split("-")[1]);
      setPhotos((prev) => prev.filter((_, i) => i !== index));
      setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
      setCombinedImages((prev) => prev.filter((img) => img.id !== imageId));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const filePreviews = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPhotoPreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
    }
  };

  const handleUploadImages = async () => {
    setIsUploading(true);
    setUploadError(null);

    try {
      if (imagesToDelete.length > 0) {
        await dispatch(deleteImagesBatch({ ids: imagesToDelete })).unwrap();
      }

      if (photos.length > 0) {
        const formData = new FormData();
        const propertySpaceImages = photos.map((photo, index) => ({
          description: photo.name,
          displayOrder: index + 1,
          propertySpace: { id: space.id },
          createdBy: { id: userId },
        }));
        formData.append(
          "propertySpaceImages",
          JSON.stringify(propertySpaceImages)
        );
        photos.forEach((photo) => {
          formData.append("imageFiles", photo);
        });
        await propertySpaceImageuploadapi(formData);
      }

      console.log("Images updated successfully");
      setSnackbar({
        open: true,
        message: 'Images updated successfully',
        severity: "success",
      });
      await dispatch(fetchImagesByPropertySpaceId(space.id));
      await dispatch(fetchPropertyAllRooms(Number(propertyId)));
      setIsUploading(false);
      setPhotos([]);
      setPhotoPreviews([]);
      setImagesToDelete([]);
    } catch (error) {
      console.error("Error updating images:", error);
      setIsUploading(false);
      setUploadError("Failed to update images. Please try again.");
    }
  };


  const handleDeletePropertySpace = async () => {
    if (space?.id) {
      try {
        await dispatch(deleteExistingSpaceProperty(space.id)).unwrap();
        console.log("Property space deleted successfully");
        setDeleteDialogOpen(false);
        navigate(`/admin/property/${Number(propertyId)}/rooms`);
      } catch (error) {
        console.error("Failed to delete property space:", error);
      }
    }
  };

  const handleSaveBedTypes = async (
    updatedBedTypes: Array<{ id: number; count: number }>
  ) => {
    if (space?.id) {
      const data = {
        propertySpace: { id: space.id },
        spaceBedTypes: updatedBedTypes.map((bed) => ({
          spaceBedType: { id: bed.id },
          count: bed.count,
        })),
        updatedBy: { id: userId }
      };
      const response = await dispatch(createOrDeletePropertySpaceBeds(data)).unwrap();
      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        await dispatch(fetchPropertyAllRooms(Number(propertyId)));
      }
      else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "error",
        });
      }
      return response;
    }
  };

  const handleSaveBathTypes = async (updatedBathTypes: Array<{ id: number; count: number }>) => {
    if (space?.id) {
      const data = {
        propertySpace: { id: space.id },
        spaceBathroomTypes: updatedBathTypes.map(bath => ({
          spaceBathroomType: { id: bath.id },
          count: bath.count,
        })),
        updatedBy: { id: userId }
      };

      const response = await await dispatch(createOrDeletePropertySpaceBathrooms(data)).unwrap();
      if (response.success) {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "success",
        });
        await dispatch(fetchPropertyAllRooms(Number(propertyId)));
      }
      else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "error",
        });
      }
      return response;
    }
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };


  const handleback = () => {
    navigate(`/admin/property/${Number(propertyId)}/rooms`);
  };

  return (
    <>
      <Card className="w-full m-0 bg-[#fff] text-black h-full rounded-lg flex flex-column justify-between gap-3">
        <CardHeader className="flex flex-row justify-between items-center py-1 px-3">
          <CardTitle className="text-2xl font-bold">
            {space?.propertySpaceName || "Space Name"}
          </CardTitle>
          <div className="flex justify-between items-center m-0 gap-2 text-sm h-7 ">
            <Button
              onClick={handleback}
              variant="ghost"
              className="w-[1/2] h-100 border-solid border-1 border-[#00636D]-500 text-center text-sm text-[#00636D] flex justify-center items-center rounded px-2 py-1"
            >
              <ChevronLeft style={{ height: '100%', width: '100%' }} /> Back to rooms
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-100 w-[1/2] border-solid border-1 border-[#00636D]-500 text-center text-sm text-[#00636D] flex justify-center items-center rounded px-3 py-1 gap-1">
                  <Trash2 size={12} />Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Are you sure you want to delete this room or space?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the
                    room or space and remove all associated data.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeletePropertySpace();
                      setDeleteDialogOpen(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pb-2 h-full">
          <Tabs defaultValue="photos" className="flex flex-column h-[30rem]">
            <TabsList className="flex flex-wrap">
              {tabsList.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 min-w-[100px]"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <PhotosTab
              combinedImages={combinedImages}
              spaceImageLoading={spaceImageLoading}
              spaceImageError={spaceImageError}
              handleDeletePhoto={handleDeletePhoto}
              handlePhotoUpload={handlePhotoUpload}
              handleUploadImages={handleUploadImages}
              photos={photos}
              imagesToDelete={imagesToDelete}
              isUploading={isUploading}
              uploadError={uploadError}
            />
            <AmenitiesTab
              amenitiesStatus={amenitiesStatus}
              amenitiesError={amenitiesError}
              amenityGroups={amenityGroups}
              propertyAmenityGroups={propertyAmenityGroups}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedAmenity={selectedAmenity}
              setSelectedAmenity={setSelectedAmenity}
              handleAddAmenity={handleAddAmenity}
              handleRemoveAmenity={handleRemoveAmenity}
              saveAmenityChanges={saveAmenityChanges}
              openCategories={openCategories}
              toggleCategory={toggleCategory}
            />
            {showBedTypesTab && (
              <BedTypesTab
                propertySpaceBeds={properbed}
                onSave={handleSaveBedTypes}
              />
            )}
            {showBathTypesTab && (
              <BathTypesTab
                bathTypes={properbath}
                onSave={handleSaveBathTypes}
              />
            )}
          </Tabs>
        </CardContent>
      </Card>

      <CustomizedSnackbars
        open={snackbar.open}
        handleClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
}

