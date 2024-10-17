import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";

interface BathType {
  id: number;
  name: string;
  count: number;
}

interface PropertySpaceBath {
  id: number;
  spaceBathroomType: {
    id: number;
    name: string;
  };
  count: number;
}

interface BathTypesTabProps {
  bathTypes: PropertySpaceBath[];
  loading: boolean;
  error: string | null;
  onSave: (updatedBathTypes: Array<{ id: number; count: number }>) => void;
}

const BathTypesTab: React.FC<BathTypesTabProps> = ({ bathTypes: initialBathTypes, onSave }) => {
  const [bathTypes, setBathTypes] = useState<BathType[]>([]);

  useEffect(() => {
    if (initialBathTypes.length > 0) {
      const initialTypes = initialBathTypes.map(bath => ({
        id: bath.spaceBathroomType.id,
        name: bath.spaceBathroomType.name,
        count: bath.count
      }));
      setBathTypes(initialTypes);
    }
  }, [initialBathTypes]);

  const handleBathCountChange = (id: number, increment: number) => {
    setBathTypes(prevBathTypes =>
      prevBathTypes.map(bath =>
        bath.id === id ? { ...bath, count: Math.max(0, bath.count + increment) } : bath
      )
    );
  };

  const handleSave = () => {
    const updatedBathTypes = bathTypes.map(bath => ({ id: bath.id, count: bath.count }));
    onSave(updatedBathTypes);
  };

  return (
    <TabsContent value="bathTypes" className="space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {bathTypes.map((bath) => (
            <div key={bath.id} className="flex items-center justify-between">
              <span className="text-lg">{bath.name}</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBathCountChange(bath.id, -1)}
                  disabled={bath.count === 0}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{bath.count}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleBathCountChange(bath.id, 1)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-center mt-4">
        <Button className="w-1/2 border-solid border-2 border-[##4b7a7f] text-center bg-[#4b7a7f] text-[#fff] rounded" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Bath Types
        </Button>
      </div>
    </TabsContent>
  );
};

export default BathTypesTab;