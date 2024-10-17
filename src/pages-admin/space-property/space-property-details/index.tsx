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
import { fetchAmenities } from "@/store/slice/auth/amenitySlice";
import {
  deleteImagesBatch,
  fetchImagesByPropertySpaceId,
  selectSpaceImages,
} from "@/store/slice/spaceImagesSlice";
import AmenitiesTab from "./property-space-tabs/amenities-tab";
import PhotosTab from "./property-space-tabs/photos-tab";
import BedTypesTab from "./property-space-tabs/bed-type-tab";
import { ArrowLeft, CircleArrowLeft, MoveLeft, Trash2 } from "lucide-react";
import BathTypesTab from "./property-space-tabs/bath-type-tab";
import { deleteExistingSpaceProperty } from "@/store/slice/spacePropertySlice";
import { createOrDeletePropertySpaceBeds, fetchAllPropertySpaceBeds, fetchAllPropertySpaceBedsByPropertySpace } from "@/store/slice/bedSlice";
import { createOrDeletePropertySpaceBathrooms, fetchAllPropertySpaceBathroomsByPropertySpace } from "@/store/slice/bathroom-slice";

export default function Component({ initialSpace = {} }) {
  const location = useLocation();
  const { space = initialSpace } = location.state || {};
  const navigate = useNavigate();
  const { id: propertyId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const showBedTypesTab = space?.space?.isBedTypeAllowed ?? false;
  const showBathTypesTab = space?.space?.isBathroomTypeAllowed ?? false;
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const {
    amenities: allAmenities,
    status: amenitiesStatus,
    error: amenitiesError,
  } = useSelector((state: RootState) => state.amenities);
  const {
    amenities: propertySpaceAmenities,
    loading: propertyAmenitiesLoading,
    error: propertyAmenitiesError,
  } = useSelector((state: RootState) => state.propertyAmenities);
  const spaceImages = useSelector(selectSpaceImages);
  const spaceImageLoading = useSelector(
    (state: RootState) => state.spaceImage.loading
  );
  const spaceImageError = useSelector(
    (state: RootState) => state.spaceImage.error
  );
  const { propertySpaceBeds, loading: bedTypesLoading, error: bedTypesError } = useSelector((state: RootState) => state.bed);
  const { propertySpaceBathrooms, loading: bathTypesLoading, error: bathTypesError } = useSelector(
    (state: RootState) => state.bathroom
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const [updatedAmenities, setUpdatedAmenities] = useState<number[]>([]);
  const [localPropertyAmenities, setLocalPropertyAmenities] = useState<
    typeof propertySpaceAmenities
  >([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [combinedImages, setCombinedImages] = useState<
    Array<{ id?: number; url: string; isNew?: boolean }>
  >([]);

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
    if (space?.id) {
      dispatch(getByPropertySpaceId(space.id));
      dispatch(fetchImagesByPropertySpaceId(space.id));
      dispatch(fetchAllPropertySpaceBedsByPropertySpace(space.id));
      dispatch(fetchAllPropertySpaceBathroomsByPropertySpace(space.id));

    }
    dispatch(fetchAmenities());
  }, [space, dispatch]);

  useEffect(() => {
    if (propertySpaceAmenities.length > 0) {
      setUpdatedAmenities(
        propertySpaceAmenities.map((amenity) => amenity.amenity.id)
      );
      setLocalPropertyAmenities(propertySpaceAmenities);
    }
  }, [propertySpaceAmenities]);

  useEffect(() => {
    const fetchedImages = spaceImages.map((img) => ({
      id: img.id,
      url: img.url,
    }));
    const newImages = photoPreviews.map((url, index) => ({
      url,
      isNew: true,
      id: `new-${index}`,
    }));
    setCombinedImages([...fetchedImages, ...newImages]);
  }, [spaceImages, photoPreviews]);

  const amenityGroups = allAmenities.reduce((groups, amenity) => {
    const groupName = amenity.amenityGroup.name;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(amenity);
    return groups;
  }, {} as Record<string, typeof allAmenities>);

  const propertyAmenityGroups = localPropertyAmenities.reduce(
    (groups, amenity) => {
      const groupName = amenity.amenity.amenityGroup.name;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(amenity);
      return groups;
    },
    {} as Record<string, typeof localPropertyAmenities>
  );

  const handleAddAmenity = () => {
    if (selectedAmenity) {
      const amenityId = parseInt(selectedAmenity);
      setUpdatedAmenities((prev) => [...prev, amenityId]);
      const newAmenity = allAmenities.find(
        (amenity) => amenity.id === amenityId
      );
      if (newAmenity) {
        setLocalPropertyAmenities((prev) => [
          ...prev,
          {
            amenity: newAmenity,
            propertySpace: { id: space.id },
            createdBy: { id: userId },
          },
        ]);
      }
      setSelectedAmenity("");
    }
  };

  const handleRemoveAmenity = (amenityId: number) => {
    setUpdatedAmenities((prev) => prev.filter((id) => id !== amenityId));
    setLocalPropertyAmenities((prev) =>
      prev.filter((amenity) => amenity.amenity.id !== amenityId)
    );
  };

  const saveAmenityChanges = () => {
    if (space?.id && userId) {
      const updateData = {
        property: { id: space.property.id },
        propertySpace: { id: space.id },
        amenities: updatedAmenities.map((id) => ({ id })),
        updatedBy: { id: userId },
      };
      dispatch(updatePropertyAmenities(updateData));
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({
      ...prev,
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
      dispatch(fetchImagesByPropertySpaceId(space.id));
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
        navigate(`/admin/property/${propertyId}/rooms`);
      } catch (error) {
        console.error("Failed to delete property space:", error);
      }
    }
  };

  const handleSaveBedTypes = (
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
      dispatch(createOrDeletePropertySpaceBeds(data));
    }
  };

  const handleSaveBathTypes = (updatedBathTypes: Array<{ id: number; count: number }>) => {
    if (space?.id) {
      const data = {
        propertySpace: { id: space.id },
        spaceBathroomTypes: updatedBathTypes.map(bath => ({
          spaceBathroomType: { id: bath.id },
          count: bath.count,
        })),
        updatedBy: { id: userId }
      };
      dispatch(createOrDeletePropertySpaceBathrooms(data));
    }
  };

  const handleback = () => {
    navigate(`/admin/property/${space.property.id}/rooms`);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto bg-[#fff] text-black h-full rounded-lg">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold">
          {space?.space?.name || "Space Name"} {space?.instanceNumber}
        </CardTitle>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#00636D] m-0">
              <Trash2 size={20} />
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
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="photos" className="space-y-4">
          <TabsList className={`grid w-full grid-cols-${tabsList.length}`}>
            {tabsList.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
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
            propertyAmenitiesLoading={propertyAmenitiesLoading}
            amenitiesError={amenitiesError}
            propertyAmenitiesError={propertyAmenitiesError}
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
              propertySpaceBeds={propertySpaceBeds}
              loading={bedTypesLoading}
              error={bedTypesError}
              onSave={handleSaveBedTypes}
            />
          )}
          {showBathTypesTab && (
            <BathTypesTab
              bathTypes={propertySpaceBathrooms}
              loading={bathTypesLoading}
              error={bathTypesError}
              onSave={handleSaveBathTypes}
            />
          )}
        </Tabs>
      </CardContent>
      <div className="flex justify-center px-6 py-0 pb-2 items-center">
        <Button
          onClick={handleback}
          className="w-1/2 border-solid border-2 border-[#000]-500 text-center text-[#000000aa] display-flex gap-1 rounded"
        >
          <MoveLeft size={20} color='#000000aa' /> Back to rooms
        </Button>
      </div>
    </Card>
  );
}
