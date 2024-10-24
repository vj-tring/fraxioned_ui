import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ShowMoreProps {
  description?: string;
}

const ShowMore: React.FC<ShowMoreProps> = ({ description }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showMore] = useState(false);

  const fullContent = `*March/April Specials* This brand new townhome is located just minutes away from the beautiful Bear Lake. We have filled the home with every amenity that you need to have an incredible family vacation in Garden City. With a fully stocked kitchen, cozy beds, large family room, game tables, baby and toddler necessities, and a garage full of toys. There's no better place to stay when visiting Bear Lake with the family!`;

  return (
    <div>
      <div className="max-w-2xl">
        <div className="space-y-2">
          <p className="text-sm">
            {(description || fullContent).slice(0, 470) + '...'}
          </p>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="h-auto p-0 font-bold text-black hover:no-underline"
              >
                {showMore ? '< Show less' : 'Show more >'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl" >
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="font-sans">Property Details</span>
                
                </DialogTitle>
              </DialogHeader>
              <div className="font-sans">
                {description || fullContent}
              </div>
              <DialogFooter className="sm:justify-end">
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ShowMore;