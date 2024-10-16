import React from "react";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";

interface BedTypesTabProps {
  bedTypes: Array<{ id: number; name: string; count: number }>;
  handleBedCountChange: (id: number, increment: number) => void;
}

const BedTypesTab: React.FC<BedTypesTabProps> = ({ bedTypes, handleBedCountChange }) => {
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
      <Button className="w-full mt-4">
        <Save className="mr-2 h-4 w-4" />
        Save Bed Types
      </Button>
    </TabsContent>
  );
};

export default BedTypesTab;