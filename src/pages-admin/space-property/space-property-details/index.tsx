import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { AppDispatch } from "@/store";
import { getByPropertySpaceId, updatePropertyAmenities } from "@/store/slice/auth/propertyamenities";
import { propertySpaceImageuploadapi } from "@/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  X,
  Camera,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/src/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchAmenities } from "@/store/slice/auth/amenitySlice";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { deleteImagesBatch, fetchImagesByPropertySpaceId, selectSpaceImages, uploadImages } from "@/store/slice/spaceImagesSlice";

export default function Component({ initialSpace = {} }) {
    
    const location = useLocation();
    const { space = initialSpace } = location.state || {};
    const dispatch = useDispatch<AppDispatch>();
  
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const { amenities: allAmenities, status: amenitiesStatus, error: amenitiesError } = useSelector(
      (state: RootState) => state.amenities
    );
    const { amenities: propertySpaceAmenities, loading: propertyAmenitiesLoading, error: propertyAmenitiesError } = useSelector(
      (state: RootState) => state.propertyAmenities
    );
    const spaceImages = useSelector(selectSpaceImages);
    const spaceImageLoading = useSelector((state: RootState) => state.spaceImage.loading);
    const spaceImageError = useSelector((state: RootState) => state.spaceImage.error);

    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedAmenity, setSelectedAmenity] = useState<string>("");
    const [updatedAmenities, setUpdatedAmenities] = useState<number[]>([]);
    const [localPropertyAmenities, setLocalPropertyAmenities] = useState<typeof propertySpaceAmenities>([]);
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
    const [combinedImages, setCombinedImages] = useState<Array<{ id?: number; url: string; isNew?: boolean }>>([]);

  useEffect(() => {
    if (space?.id) {
      dispatch(getByPropertySpaceId(space.id));
      dispatch(fetchImagesByPropertySpaceId(space.id));
    }
    dispatch(fetchAmenities());
  }, [space, dispatch]);

  useEffect(() => {
    if (propertySpaceAmenities.length > 0) {
      setUpdatedAmenities(propertySpaceAmenities.map(amenity => amenity.amenity.id));
      setLocalPropertyAmenities(propertySpaceAmenities);
    }
  }, [propertySpaceAmenities]);

  useEffect(() => {
    const fetchedImages = spaceImages.map(img => ({ id: img.id, url: img.url }));
    const newImages = photoPreviews.map((url, index) => ({ url, isNew: true, id: `new-${index}` }));
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

  const propertyAmenityGroups = localPropertyAmenities.reduce((groups, amenity) => {
    const groupName = amenity.amenity.amenityGroup.name;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(amenity);
    return groups;
  }, {} as Record<string, typeof localPropertyAmenities>);

  const handleAddAmenity = () => {
    if (selectedAmenity) {
      const amenityId = parseInt(selectedAmenity);
      setUpdatedAmenities(prev => [...prev, amenityId]);
      const newAmenity = allAmenities.find(amenity => amenity.id === amenityId);
      if (newAmenity) {
        setLocalPropertyAmenities(prev => [
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
    setUpdatedAmenities(prev => prev.filter(id => id !== amenityId));
    setLocalPropertyAmenities(prev => prev.filter(amenity => amenity.amenity.id !== amenityId));
  };

  const saveAmenityChanges = () => {
    if (space?.id && userId) {
      const updateData = {
        property: { id: space.property.id },
        propertySpace: { id: space.id },
        amenities: updatedAmenities.map(id => ({ id })),
        updatedBy: { id: userId }
      };
      dispatch(updatePropertyAmenities(updateData));
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  const handleDeletePhoto = (imageId: number | string) => {
    if (typeof imageId === 'number') {
      setImagesToDelete(prev => [...prev, imageId]);
      setCombinedImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      const index = parseInt(imageId.split('-')[1]);
      setPhotos(prev => prev.filter((_, i) => i !== index));
      setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
      setCombinedImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
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
            formData.append("propertySpaceImages", JSON.stringify(propertySpaceImages));
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
    setBedTypes(prevBedTypes =>
      prevBedTypes.map(bed =>
        bed.id === id ? { ...bed, count: Math.max(0, bed.count + increment) } : bed
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
          <TabsContent value="photos" className="space-y-4">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {spaceImageLoading ? (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
) : spaceImageError ? (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{spaceImageError}</AlertDescription>
  </Alert>
) : (
  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
    <AnimatePresence>
      {combinedImages.map((image) => (
        <motion.div
          key={image.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative aspect-square"
        >
          <img
            src={image.url}
            alt={`Room photo ${image.id}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full"
            onClick={() => handleDeletePhoto(image.id!)}
            aria-label={`Delete photo ${image.id}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </motion.div>
      ))}
    </AnimatePresence>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        className="h-full w-full aspect-square flex flex-col items-center justify-center text-muted-foreground"
        onClick={() => document.getElementById("photo-upload")?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Camera className="h-6 w-6 mb-1" />
            <span className="text-xs">Add Photo</span>
          </>
        )}
      </Button>
      <input
        id="photo-upload"
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handlePhotoUpload}
        aria-label="Upload photos"
      />
    </motion.div>
  </div>
)}
            </ScrollArea>
        {uploadError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={handleUploadImages}
          disabled={photos.length === 0 && imagesToDelete.length === 0 || isUploading}
          className="w-full mt-4"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Photos Changes
        </Button>
      </TabsContent>
          <TabsContent value="amenities" className="space-y-4">
            {amenitiesStatus === 'loading' || propertyAmenitiesLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : amenitiesStatus === 'failed' || propertyAmenitiesError ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {amenitiesError || propertyAmenitiesError || "Failed to load amenities. Please try again later."}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(amenityGroups).map((groupName) => (
                        <SelectItem key={groupName} value={groupName}>
                          {groupName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedAmenity}
                    onValueChange={setSelectedAmenity}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Amenity" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory &&
                        amenityGroups[selectedCategory].map((amenity) => (
                          <SelectItem key={amenity.id} value={amenity.id.toString()}>
                            {amenity.amenityName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleAddAmenity}
                    disabled={!selectedAmenity}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {Object.entries(propertyAmenityGroups).map(([category, amenities]) => (
                      <div key={category} className="space-y-2">
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleCategory(category)}
                        >
                          <h3 className="text-lg font-semibold">{category}</h3>
                          {openCategories[category] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                        {openCategories[category] && (
                          <div className="grid grid-cols-2 gap-2">
                            {amenities.map((amenity) => (
                              <Badge
                                key={amenity.amenity.id}
                                variant="default"
                                className="text-sm py-1 px-2 flex items-center justify-between"
                              >
                                <span>{amenity.amenity.amenityName}</span>
                                <X
                                  className="h-3 w-3 ml-2 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAmenity(amenity.amenity.id);
                                  }}
                                />
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Button
          onClick={saveAmenityChanges}
          disabled={propertyAmenitiesLoading}
          className="w-full mt-4"
        >
          {propertyAmenitiesLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Amenities Changes
        </Button>
              </>
            )}
          </TabsContent>
          <TabsContent value="bedTypes" className="space-y-4">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {bedTypes.map((bed) => (
                  <div key={bed.id} className="flex items-center justify-between">
                    <span className="text-lg">{bed.name}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBedCountChange(bed.id, -1)}
                        disabled={bed.count === 0}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{bed.count}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleBedCountChange(bed.id, 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button className="w-full mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Bed Types
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
