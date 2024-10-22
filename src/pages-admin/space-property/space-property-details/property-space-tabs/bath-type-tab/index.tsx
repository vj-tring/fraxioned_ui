import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchAllSpaceBathroomTypes } from "@/store/slice/bathroom-slice";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsContent } from "@/components/ui/tabs";
import { RootState } from "@/store/reducers";

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
  bathTypes: PropertySpaceBath[] | null;
  loading: boolean;
  error: string | null;
  onSave: (updatedBathTypes: Array<{ id: number; count: number }>) => void;
}

const BathTypesTab: React.FC<BathTypesTabProps> = ({
  bathTypes: initialBathTypes,
  loading,
  error,
  onSave,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const spaceBathroomTypes = useSelector((state: RootState) => state.bathroom.spaceBathroomTypes);
  const [bathTypes, setBathTypes] = useState<BathType[]>([]);

  useEffect(() => {
    dispatch(fetchAllSpaceBathroomTypes());
  }, [dispatch]);

  useEffect(() => {
    if (spaceBathroomTypes && spaceBathroomTypes.length > 0) {
      let types: BathType[];
      if (!initialBathTypes) {
        types = spaceBathroomTypes.map(type => ({
          id: type.id,
          name: type.name,
          count: 0
        }));
      } else {
        const initialCounts = new Map(initialBathTypes.map(bath => [bath.spaceBathroomType.id, bath.count]));
        types = spaceBathroomTypes.map(type => ({
          id: type.id,
          name: type.name,
          count: initialCounts.get(type.id) || 0
        }));
      }
      setBathTypes(types);
    }
  }, [spaceBathroomTypes, initialBathTypes]);
  
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

  if (loading) {
    return <div>Loading bath types...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (bathTypes && bathTypes.length ===0) {
    return (
      <TabsContent value="bathTypes" className="space-y-4 h-full rounded-md border">
        <div className="h-full flex flex-column justify-center items-center">
          <p>No bath types available.</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="bathTypes" className="space-y-4 h-full rounded-md border">
      <div className="h-full flex flex-column">
        <ScrollArea className="h-100 w-full py-2 px-3">
          <div className="space-y-4">
            {bathTypes.map((bath) => (
              <div key={bath.id} className="flex items-center justify-between">
                <span className="text-md">{bath.name}</span>
                <div className="flex items-center space-x-2 text-md">
                  <Button
                    size="icon"
                    onClick={() => handleBathCountChange(bath.id, -1)}
                    disabled={bath.count === 0}
                    className="h-full w-5 rounded-none"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{bath.count}</span>
                  <Button
                    size="icon"
                    onClick={() => handleBathCountChange(bath.id, 1)}
                    className="h-full w-5 rounded-none"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-center mt-0 py-1">
          <Button className="w-1/2 border-solid border-2 border-[##4b7a7f] text-center bg-[#4b7a7f] text-[#fff] rounded" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Bath Types
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default BathTypesTab;