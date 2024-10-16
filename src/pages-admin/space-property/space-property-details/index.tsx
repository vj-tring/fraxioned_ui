import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import {
  getByPropertySpaceId,
  updatePropertyAmenities,
} from "@/store/slice/auth/propertyamenities";
import { propertySpaceImageuploadapi } from "@/api";
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
import BedTypesTab from "./property-space-tabs/type-tab";
import { Trash2 } from "lucide-react";

export default function Component({ initialSpace = {} }) {
  const location = useLocation();
  const { space = initialSpace } = location.state || {};
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    if (space?.id) {
      dispatch(getByPropertySpaceId(space.id));
      dispatch(fetchImagesByPropertySpaceId(space.id));
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
      // Delete marked images
      if (imagesToDelete.length > 0) {
        await dispatch(deleteImagesBatch({ ids: imagesToDelete })).unwrap();
      }

      // Upload new images
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

  const [bedTypes, setBedTypes] = useState([
    { id: 1, name: "Single Bed", count: 0 },
    { id: 2, name: "Double Bed", count: 0 },
    { id: 3, name: "Queen Bed", count: 0 },
    { id: 4, name: "King Bed", count: 0 },
    { id: 5, name: "Bunk Bed", count: 0 },
  ]);

  const handleBedCountChange = (id: number, increment: number) => {
    setBedTypes((prevBedTypes) =>
      prevBedTypes.map((bed) =>
        bed.id === id
          ? { ...bed, count: Math.max(0, bed.count + increment) }
          : bed
      )
    );
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          {space?.space?.name || "Space Name"} {space?.instanceNumber}
        </CardTitle>
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-5 w-5" />
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
                  // Implement delete logic here
                  console.log("Deleting room or space");
                  setDeleteDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="photos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="bedTypes">Bed Types</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
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
          <BedTypesTab
            bedTypes={bedTypes}
            handleBedCountChange={handleBedCountChange}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
}
