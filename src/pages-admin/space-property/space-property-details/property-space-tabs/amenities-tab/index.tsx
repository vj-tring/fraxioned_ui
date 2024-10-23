import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Plus, X, Save } from "lucide-react";
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
  amenitiesError: string | null;
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
  amenitiesError,
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

  const [choosenCategory, SetChoosenCategory] = useState<string>('All')

  const renderAmenities = () => {
    if (choosenCategory === "All") {
      return Object.entries(propertyAmenityGroups).map(([category, amenities]) => (
        <div key={category} className="flex flex-wrap py-1">
          <div className="flex gap-1 flex-wrap">
            {Array.isArray(amenities) && amenities.length > 0 && (
              amenities.map((amenity) => (
                <Badge
                  key={amenity.amenityId}
                  variant="default"
                  className="text-xs py-1 px-2 flex items-center justify-between rounded bg-[#f29011] hover:bg-[#E28F00]"
                >
                  <span className="text-md">{amenity.amenityName}</span>
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAmenity(amenity.amenityId);
                    }}
                  />
                </Badge>
              )))
            }
          </div>
        </div>
      ));
    } else {
      return Object.entries(propertyAmenityGroups).map(([category, amenities]) =>
        openCategories[category] && (
          <div key={category} className="space-y-2">
            <div className="flex gap-1 flex-wrap">
              {amenities.map((amenity) => (
                <Badge
                  key={amenity.amenityId}
                  variant="default"
                  className="text-xs py-1 px-2 flex items-center justify-between rounded bg-[#f29011] hover:bg-[#E28F00]"
                >
                  <span className="text-md">{amenity.amenityName}</span>
                  <X
                    className="h-3 w-3 ml-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAmenity(amenity.amenityId);
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )
      );
    }
  };

  return (
    <TabsContent value="amenities" className="space-y-4 h-100 rounded-md border">
      <div className="h-full flex flex-col">
        {amenitiesStatus === "loading" ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : amenitiesStatus === "failed" ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {amenitiesError || "Failed to load amenities. Please try again later."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-2 gap-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
                    amenityGroups[selectedCategory]?.map((amenity) => (
                      <SelectItem key={amenity.id} value={amenity.id.toString()}>
                        {amenity.amenityName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddAmenity}
                disabled={!selectedAmenity}
                className="w-full sm:w-auto text-[#00636d] m-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <ScrollArea className="h-[400px] w-full py-2 px-3">
              <div className="flex flex-column h-full gap-6">
                <div className="flex text-xs flex-wrap gap-2">
                  <div
                    className={`cursor-pointer p-2 border rounded text-xs ${choosenCategory === "All" ? "bg-gray-100 font-semibold" : ""
                      }`}
                    onClick={() => {
                      SetChoosenCategory("All");
                      toggleCategory("All");
                    }}
                  >
                    <h3 className="text-xs">All</h3>
                  </div>

                  {Object.keys(propertyAmenityGroups).map((category) => (
                    <div
                      key={category}
                      className={`cursor-pointer p-2 border rounded text-xs ${openCategories[category] ? "bg-gray-100 font-semibold" : ""
                        }`}
                      onClick={() => {
                        SetChoosenCategory('category');
                        toggleCategory(category)
                      }}
                    >
                      <h3 className="text-xs">{category}</h3>
                    </div>
                  ))}
                </div>

                <div className="px-1 m-0">
                  {renderAmenities()}
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-center mt-2 py-2">
              <Button
                onClick={saveAmenityChanges}
                className="w-1/2 border-2 border-[#c7eaee] bg-[#4b7a7f] text-white rounded"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Amenities Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </TabsContent>
  );
};

export default AmenitiesTab;
