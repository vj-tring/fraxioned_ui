import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { AppDispatch } from '@/store';
import { getByPropertySpaceId } from '@/store/slice/auth/propertyamenities';
import { propertySpaceImageuploadapi } from "@/api";
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, X, Camera, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/src/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/src/components/ui/collapsible";
import { uploadPropertySpaceImages } from "@/api";
import { VscTrash } from "react-icons/vsc";

interface AmenityGroup {
  id: number;
  name: string;
  amenities: string[];
}

const SpacePropertyDetails: React.FC = () => {
  const location = useLocation();
  const { space } = location.state || {};
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { amenities: propertyAmenities } = useSelector(
    (state: RootState) => state.propertyAmenities
  );

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [amenityGroups, setAmenityGroups] = useState<AmenityGroup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedAmenity, setSelectedAmenity] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (space?.id) {
      dispatch(getByPropertySpaceId(space.id));
    }
  }, [space, dispatch]);

  useEffect(() => {
    if (propertyAmenities.length > 0) {
      const groupedAmenities = propertyAmenities.reduce((acc: AmenityGroup[], item) => {
        const groupIndex = acc.findIndex(group => group.id === item.amenity.amenityGroup.id);
        if (groupIndex === -1) {
          acc.push({
            id: item.amenity.amenityGroup.id,
            name: item.amenity.amenityGroup.name,
            amenities: [item.amenity.amenityName]
          });
        } else {
          acc[groupIndex].amenities.push(item.amenity.amenityName);
        }
        return acc;
      }, []);
      setAmenityGroups(groupedAmenities);
      
      const initialExpandedState = groupedAmenities.reduce((acc, group) => {
        acc[group.name] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setOpenCategories(initialExpandedState);
    }
  }, [propertyAmenities]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
      const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPhotoPreviews((prevPreviews) => [...prevPreviews, ...filePreviews]);
    }
  };

  const handleDeletePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setPhotoPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    setIsUploading(true);
    const formData = new FormData();
    const propertySpaceImages = photos.map((photo, index) => ({
      description: photo.name,
      displayOrder: index + 1,
      propertySpace: { id: space.id },
      createdBy: { id: userId }
    }));
    formData.append('propertySpaceImages', JSON.stringify(propertySpaceImages));
    photos.forEach((photo) => {
      formData.append('imageFiles', photo);
    });
    try {
      await propertySpaceImageuploadapi(formData);
      console.log('Images uploaded successfully');
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading images:', error);
      setIsUploading(false);
    }
  };

  const addAmenity = () => {
    if (selectedCategory && selectedAmenity) {
      setAmenityGroups(prev => prev.map(group => 
        group.name === selectedCategory 
          ? { ...group, amenities: [...group.amenities, selectedAmenity] }
          : group
      ));
      setSelectedAmenity("");
    }
  };

  const removeAmenity = (category: string, amenity: string) => {
    setAmenityGroups(prev => prev.map(group => 
      group.name === category 
        ? { ...group, amenities: group.amenities.filter(a => a !== amenity) }
        : group
    ));
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">{space?.space.name || "Space Name"} {space?.instanceNumber}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="photos" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>
          <TabsContent value="photos" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence>
                {photoPreviews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="relative aspect-square"
                  >
                    <img src={preview} alt={`Room photo ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 rounded-full"
                      onClick={() => handleDeletePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {photoPreviews.length < 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="outline"
                    className="h-full w-full aspect-square flex flex-col items-center justify-center text-muted-foreground"
                    onClick={() => document.getElementById('photo-upload')?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 mb-2" />
                        <span>Add Photo</span>
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
                  />
                </motion.div>
              )}
            </div>
            <Button onClick={handleUploadImages} disabled={photos.length === 0 || isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Upload Photos
            </Button>
          </TabsContent>
          <TabsContent value="amenities" className="space-y-4">
            <div className="flex space-x-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {amenityGroups.map((group) => (
                    <SelectItem key={group.id} value={group.name}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={selectedAmenity}
                onValueChange={setSelectedAmenity}
                disabled={!selectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Amenity" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory &&
                    amenityGroups.find(group => group.name === selectedCategory)?.amenities.map((amenity) => (
                      <SelectItem key={amenity} value={amenity}>
                        {amenity}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button onClick={addAmenity} disabled={!selectedAmenity}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {amenityGroups.map((group) => (
                  <Collapsible
                    key={group.id}
                    open={openCategories[group.name]}
                    onOpenChange={() => toggleCategory(group.name)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between">
                        {group.name}
                        {openCategories[group.name] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <AnimatePresence>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {group.amenities.map((amenity) => (
                            <motion.div
                              key={amenity}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Badge variant="secondary" className="text-sm py-1 px-2">
                                {amenity}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-2"
                                  onClick={() => removeAmenity(group.name, amenity)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <Button variant="destructive" className="w-full mt-6">
          <Trash2 className="mr-2 h-4 w-4" /> Delete room or space
        </Button>
      </CardContent>
    </Card>
  );
};

export default SpacePropertyDetails;