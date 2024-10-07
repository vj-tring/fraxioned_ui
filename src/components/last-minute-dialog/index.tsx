import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LastMinuteBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChoice: (choice: 'lastMinute' | 'regular') => void;
}

const LastMinuteBookingDialog: React.FC<LastMinuteBookingDialogProps> = ({ isOpen, onClose, onChoice }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold mb-2">Last-Minute Booking</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-left">
          This is a last-minute booking. Would you prefer to proceed with this last-minute reservation, or would you like to opt for a regular booking instead?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button 
            variant="default" 
            onClick={() => onChoice('lastMinute')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Last-Minute Booking
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onChoice('regular')}
            className="border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded ml-2 hover:bg-gray-100"
          >
            Regular Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LastMinuteBookingDialog;
