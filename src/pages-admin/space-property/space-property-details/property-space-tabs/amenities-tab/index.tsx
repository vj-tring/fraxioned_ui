import React from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  Plus,
  ChevronUp,
  ChevronDown,
  X,
  Save,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";

interface AmenitiesTabProps {
  amenitiesStatus: string;
  propertyAmenitiesLoading: boolean;
  amenitiesError: string | null;
  propertyAmenitiesError: string | null;
  amenityGroups: Record<string, any>;
  propertyAmenityGroups: Record<string, any>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedAmenity: string;
  setSelectedAmenity: React.Dispatch<React.SetStateAction<string>>;
  handleAddAmenity: () => void;
  handleRemoveAmenity: (amenityId: number) => void;
  saveAmenityChanges: () => void;
  openCategories: Record<string, boolean>;
  toggleCategory: (category: string) => void;
}

const AmenitiesTab: React.FC<AmenitiesTabProps> = ({
  amenitiesStatus,
  propertyAmenitiesLoading,
  amenitiesError,
  propertyAmenitiesError,
  amenityGroups,
  propertyAmenityGroups,
  selectedCategory,
  setSelectedCategory,
  selectedAmenity,
  setSelectedAmenity,
  handleAddAmenity,
  handleRemoveAmenity,
  saveAmenityChanges,
  openCategories,
  toggleCategory,
}) => {
  return (
    <TabsContent value="amenities" className="space-y-4">
      {amenitiesStatus === "loading" || propertyAmenitiesLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : amenitiesStatus === "failed" || propertyAmenitiesError ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {amenitiesError ||
              propertyAmenitiesError ||
              "Failed to load amenities. Please try again later."}
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
          <ScrollArea className="h-[300px] w-full rounded-md border p-4 mt-2">
            <div className="space-y-4">
              {Object.entries(propertyAmenityGroups).map(
                ([category, amenities]) => (
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
                )
              )}
            </div>
          </ScrollArea>
          <div className="flex justify-center mt-4">
            <Button
              onClick={saveAmenityChanges}
              disabled={propertyAmenitiesLoading}
              className="w-1/2 border-solid border-2 border-[#c7eaee] text-center bg-[#4b7a7f] text-[#fff] rounded"
            >
              {propertyAmenitiesLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Amenities Changes
            </Button>
          </div>
        </>
      )}
    </TabsContent>
  );
};

export default AmenitiesTab;
