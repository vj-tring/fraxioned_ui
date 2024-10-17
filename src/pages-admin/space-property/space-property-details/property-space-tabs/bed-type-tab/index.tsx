import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchAllSpaceBedTypes } from "@/store/slice/bedSlice";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { RootState } from "@/store/reducers";
import { TypeSpecimen } from "@mui/icons-material";

interface BedType {
  id: number;
  name: string;
  count: number;
}

interface PropertySpaceBed {
  id: number;
  spaceBedType: {
    id: number;
    bedType: string;
  };
  count: number;
}

interface BedTypesTabProps {
  propertySpaceBeds: PropertySpaceBed[] | null;
  loading: boolean;
  error: string | null;
  onSave: (updatedBedTypes: Array<{ id: number; count: number }>) => void;
}

const BedTypesTab: React.FC<BedTypesTabProps> = ({
  propertySpaceBeds: initialBedTypes,
  loading,
  error,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const spaceBedTypes = useSelector((state: RootState) => state.bed.spaceBedTypes);
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);

  useEffect(() => {
    dispatch(fetchAllSpaceBedTypes());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(spaceBedTypes) && spaceBedTypes.length > 0) {
      let types: BedType[];
      if (!initialBedTypes) {
        types = spaceBedTypes.map(type => ({
          id: type.id,
          name: type.bedType,
          count: 0
        }));
      } else {
        const initialCounts = new Map(initialBedTypes.map(bed => [bed.spaceBedType.id, bed.count]));
        types = spaceBedTypes.map(type => ({
          id: type.id,
          name: type.bedType,
          count: initialCounts.get(type.id) || 0
        }));
      }
      setBedTypes(types);

      console.log("types", types);

    }
  }, [spaceBedTypes, initialBedTypes]);

  const handleBedCountChange = (id: number, increment: number) => {
    setBedTypes(prevBedTypes =>
      prevBedTypes.map(bed =>
        bed.id === id ? { ...bed, count: Math.max(0, bed.count + increment) } : bed
      )
    );
  };

  const handleSave = () => {
    const updatedBedTypes = bedTypes.map(bed => ({ id: bed.id, count: bed.count }));
    onSave(updatedBedTypes);
  };

  if (loading) {
    return <div>Loading bed types...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
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
      <Button className="w-full mt-4" onClick={handleSave}>
        <Save className="mr-2 h-4 w-4" />
        Save Bed Types
      </Button>
    </TabsContent>
  );
};

export default BedTypesTab;