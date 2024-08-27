import Box from "@mui/material/Box";
import { Button } from "@mui/material";

export default function BookingSummaryForm() {
  return (
    <Box
      height={900}
      width={700}
      my={5}
      gap={4}
      sx={{
        marginLeft: "28%",
        boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <div className="BookSum">
        <h1 className="pt-5 pb-5 SummaryHead">BOOKING SUMMARY</h1>
        <div className="ListSum">
          <li>Property : </li>
          <li>Check-in : </li>
          <li>Check-out : </li>
          <li>Total-Nights : </li>
          <li>Adults : </li>
          <li>Children : </li>
          <li>Pets : </li>
          <li>Season : </li>
          <li>Holiday : </li>
        </div>
      </div>

      <div className="PaySum">
        <h1 className="mt-4 mb-5 SummaryHead">PAYMENTS SUMMARY</h1>
        <div className="ListSum">
          <li>Cleaning Fee : </li>
          <li>Pet Fee : </li>
          <li>Total Amount Due : </li>
          <li>Date of Charge : </li>
        </div>

        <div className="PaySum">
          <h1 className="mt-4 mb-3 SummaryHead">NOTES</h1>
          <div className="ListSum">
            <textarea
              id="Textarea"
              name=""
              rows="4"
              cols="60"
              className="p-3"
            ></textarea>
          </div>
        </div>

        <div className="Btun p-4 mt-4">
          <Button className="cancelBtn"> Cancel</Button>
          <Button className="confirmBtn">Confirm Booking</Button>
        </div>
      </div>
    </Box>
  );
}
