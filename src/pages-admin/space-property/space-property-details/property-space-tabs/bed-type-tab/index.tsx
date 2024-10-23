import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchAllSpaceBedTypes } from "@/store/slice/bedSlice";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { RootState } from "@/store/reducers";
import { Bed } from "@/store/model/property-all-rooms.types";

interface BedType {
  id: number;
  name: string;
  count: number;
}

interface BedTypesTabProps {
  propertySpaceBeds: Bed[] | null;
  onSave: (updatedBedTypes: Array<{ id: number; count: number }>) => void;
}

const BedTypesTab: React.FC<BedTypesTabProps> = ({
  propertySpaceBeds: initialBedTypes,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const spaceBedTypes = useSelector((state: RootState) => state.bed.spaceBedTypes);
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAllSpaceBedTypes());
  }, [dispatch]);

  useEffect(() => {
    setHasChanges(checkForChanges());
  }, [bedTypes, initialBedTypes]);

  const checkForChanges = () => {
    return bedTypes.some((bed) => {
      const initialBed = initialBedTypes?.find(
        (initial) => initial.spaceBedTypeId === bed.id
      );
      return !initialBed || initialBed.count !== bed.count;
    });
  };

  useEffect(() => {
    if (Array.isArray(spaceBedTypes) && spaceBedTypes.length > 0) {
      const initialCounts = new Map(
        (initialBedTypes || []).map((bed) => [bed.spaceBedTypeId, bed.count])
      );

      const types = spaceBedTypes.map((type) => ({
        id: type.id,
        name: type.bedType,
        count: initialCounts.get(type.id) || 0,
      }));

      setBedTypes(types);
    }
  }, [spaceBedTypes, initialBedTypes]);

  const handleBedCountChange = (id: number, increment: number) => {
    setBedTypes((prevBedTypes) =>
      prevBedTypes.map((bed) =>
        bed.id === id
          ? { ...bed, count: Math.max(0, bed.count + increment) }
          : bed
      )
    );
  };

  const handleSave = async () => {
    const updatedBedTypes = bedTypes
      .map((bed) => ({
        id: bed.id,
        count: bed.count,
      }))
      .filter((bed) => bed.count > 0); // Exclude beds with count 0

    if (updatedBedTypes.length === 0) {
      alert("No valid bed types to save.");
      return;
    }

    const isSuccess: any = await onSave(updatedBedTypes);
    if (isSuccess.success) {
      setHasChanges(false);
    }
  };

  if (spaceBedTypes.length === 0) {
    return (
      <TabsContent value="bedTypes" className="space-y-4 h-full rounded-md border">
        <div className="h-full flex flex-column justify-center items-center">
          <p>No bed types available.</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="bedTypes" className="space-y-4 h-full rounded-md border">
      <div className="h-full flex flex-column">
        <ScrollArea className="h-100 w-full py-2 px-3">
          <div className="space-y-4">
            {bedTypes.map((bed) => (
              <div key={bed.id} className="flex items-center justify-between">
                <span className="text-md">{bed.name}</span>
                <div className="flex items-center space-x-2 text-md">
                  <Button
                    size="icon"
                    onClick={() => handleBedCountChange(bed.id, -1)}
                    disabled={bed.count === 0}
                    className="h-full w-5 rounded-none"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-md">{bed.count}</span>
                  <Button
                    size="icon"
                    className="h-full w-5 rounded-none"
                    onClick={() => handleBedCountChange(bed.id, 1)}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-center mt-0 py-1">
          <Button
            className="w-1/2 border-solid border-2 border-[#c7eaee] text-center bg-[#4b7a7f] text-[#fff] rounded cursor-pointer"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Bed Types
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default BedTypesTab;
