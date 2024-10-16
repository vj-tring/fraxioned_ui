import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";

interface BathType {
  id: number;
  name: string;
}

interface BathTypesTabProps {
  bathTypes: BathType[];
  onSave: (selectedBathTypeId: number) => void;
}

const BathTypesTab: React.FC<BathTypesTabProps> = ({ bathTypes, onSave }) => {
  const [selectedBathTypeId, setSelectedBathTypeId] = useState<number | null>(null);

  const handleSave = () => {
    if (selectedBathTypeId !== null) {
      onSave(selectedBathTypeId);
    }
  };

  return (
    <TabsContent value="bathTypes" className="space-y-4">
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
        <RadioGroup
          value={selectedBathTypeId?.toString() || ""}
          onValueChange={(value) => setSelectedBathTypeId(Number(value))}
        >
          {bathTypes.map((bathType) => (
            <div key={bathType.id} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={bathType.id.toString()} id={`bath-type-${bathType.id}`} />
              <Label htmlFor={`bath-type-${bathType.id}`}>{bathType.name}</Label>
            </div>
          ))}
        </RadioGroup>
      </ScrollArea>
      <Button className="w-full mt-4" onClick={handleSave} disabled={selectedBathTypeId === null}>
        <Save className="mr-2 h-4 w-4" />
        Save Bath Type
      </Button>
    </TabsContent>
  );
};

export default BathTypesTab;