import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CancelPolicyProps {
  onConfirm: () => void;
  onCancel: () => void;
  showActions?: boolean;
}

const CancelPolicy: React.FC<CancelPolicyProps> = ({ onConfirm, onCancel,showActions = true }) => {
  return (
    <Card className="w-[800px] bg-white rounded-xl shadow-lg">
      <CardHeader className="relative border-b py-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Cancellation Policy</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="absolute right-4 top-2">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-4 max-h-[60vh] overflow-y-auto">
        <section>
          <h3 className="text-base font-semibold mb-2">General Rules:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
              <span className="text-sm">Cancellations must be made at least 7 days before the check-in date.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
              <span className="text-sm">Last Minute Booking cannot be cancelled.</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-base font-semibold mb-2">Owner Cancellations:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
              <span className="text-sm">If you cancel a booking with more than seven nights before the scheduled start of your stay, the nights from the booking will be credited back to your total allotted annual nights.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
              <span className="text-sm">If you cancel a booking with less than seven nights notice before the scheduled start of your stay, the nights will not be credited back to your total allotted annual nights.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
              <span className="text-sm">Additionally, if the booking is not canceled prior to the check-in time, a cleaning fee will still be charged for the reservation.</span>
            </li>
          </ul>
        </section>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h3 className="text-sm font-medium text-green-800 mb-1">Note</h3>
          <p className="text-sm text-green-700">
            If you cancel your booking with less than seven nights' notice, you will not be able to reclaim any of your allotted holiday nights for that reservation.
          </p>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-end gap-4 border-t p-3">
        <Button 
          variant="destructive" 
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Cancel Booking
        </Button>
      </CardFooter>
      )}
      
    </Card>
  );
}

export default CancelPolicy;