import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CancelPolicyProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelPolicy: React.FC<CancelPolicyProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="min-h-screen w-100">
      <Card className="max-w-5xl mx-auto">
        <CardHeader className="relative p-4">
          <CardTitle className="text-2xl font-bold text-left mr-2">Cancellation Policy</CardTitle>
          <X className="absolute top-0 right-3 h-6 w-6 cursor-pointer" onClick={onCancel} />
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">General Rules:</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 marker:text-black">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2 flex-shrink-0"></span>
                <span>Cancellations must be made at least 7 days before the check-in date.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2 flex-shrink-0"></span>
                <span>Last Minute Booking cannot be cancelled.</span>
              </li>
            </ul>
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Owner Cancellations:</h3>
            <ul className="list-disc pl-5 text-sm space-y-2 marker:text-black">
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2 flex-shrink-0"></span>
                <span>If you cancel a booking with more than seven nights before the scheduled start of your stay, the nights from the booking will be credited back to your total allotted annual nights.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2 flex-shrink-0"></span>
                <span>If you cancel a booking with less than seven nights notice before the scheduled start of your stay, the nights will not be credited back to your total allotted annual nights.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mt-2 mr-2 flex-shrink-0"></span>
                <span>Additionally, if the booking is not canceled prior to the check-in time, a cleaning fee will still be charged for the reservation.</span>
              </li>
            </ul>
          </section>
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              {/* <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div> */}
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Note</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>If you cancel your booking with less than seven nights' notice, you will not be able to reclaim any of your allotted holiday nights for that reservation.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={onConfirm}>Cancel Booking</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CancelPolicy;