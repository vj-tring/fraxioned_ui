import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { TabsContent } from "@/components/ui/tabs";
import { AlertTriangle, Camera, Loader2, Save, X } from "lucide-react";

interface PhotosTabProps {
  combinedImages: Array<{ id?: number; url: string; isNew?: boolean }>;
  spaceImageLoading: boolean;
  spaceImageError: string | null;
  handleDeletePhoto: (imageId: number | string) => void;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUploadImages: () => void;
  photos: File[];
  imagesToDelete: number[];
  isUploading: boolean;
  uploadError: string | null;
}

const PhotosTab: React.FC<PhotosTabProps> = ({
  combinedImages,
  spaceImageLoading,
  spaceImageError,
  handleDeletePhoto,
  handlePhotoUpload,
  handleUploadImages,
  photos,
  imagesToDelete,
  isUploading,
  uploadError,
}) => {
  return (
    <TabsContent value="photos" className="space-y-4 h-100 rounded-md border">
      <div className="h-full flex flex-column justify-between gap-3">
        <ScrollArea className="h-100 w-full p-4 overflow-scroll">
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
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-4">
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
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-[#333] hover:bg-[#000]"
                      onClick={() => handleDeletePhoto(image.id!)}
                      aria-label={`Delete photo ${image.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

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
        <div className="flex justify-center mt-0">
          <Button
            onClick={handleUploadImages}
            disabled={
              (photos.length === 0 && imagesToDelete.length === 0) || isUploading
            }
            className="w-1/2 border-solid border-2 border-[#c7eaee] text-center bg-[#4b7a7f] text-[#fff] rounded"
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Photos Changes
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default PhotosTab;
