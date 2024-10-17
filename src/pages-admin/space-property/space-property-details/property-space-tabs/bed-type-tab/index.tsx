import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";

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
  propertySpaceBeds: PropertySpaceBed[];
  loading: boolean;
  error: string | null;
  onSave: (updatedBedTypes: Array<{ id: number; count: number }>) => void;
}

const BedTypesTab: React.FC<BedTypesTabProps> = ({
  propertySpaceBeds,
  loading,
  error,
  onSave,
}) => {
  const [bedTypes, setBedTypes] = useState<BedType[]>([]);
  useEffect(() => {
    if (propertySpaceBeds.length > 0) {
      const initialBedTypes = propertySpaceBeds.map(bed => ({
        id: bed.spaceBedType.id,
        name: bed.spaceBedType.bedType,
        count: bed.count
      }));
      setBedTypes(initialBedTypes);
    }
  }, [propertySpaceBeds]);

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
    return <div>Error loading bed types: {error}</div>;
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
      <div className="flex justify-center mt-4">
        <Button className="w-1/2 border-solid border-2 border-[#c7eaee] text-center bg-[#4b7a7f] text-[#fff] rounded" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Bed Types
        </Button>
      </div>
    </TabsContent>
  );
};

export default BedTypesTab;