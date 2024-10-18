
import { Booking } from './booking.types'; 

export const exportBookingsToCSV = (filteredBookings: Booking[]) => {
  const headers = [
    "Booking ID",
    "User Name",
    "Property Name",
    "Check-in Date",
    "Check-in Time",
    "Check-out Date",
    "Check-out Time",
    "Last Minute Booking",
    "Total Nights",
    "Number of Guests",
    "Number of Pets",
    "Cancelled",
    "Completed",
    "Cleaning Fee",
    "Pet Fee",
  ];

  const csvContent = [
    headers.join(","),
    ...filteredBookings.map((booking) =>
      [
        booking.bookingId,
        booking.userName,
        booking.propertyName,
        booking.checkinDate,
        booking.checkoutDate,
        booking.isLastMinuteBooking,
        booking.totalNights,
        booking.noOfGuests,
        booking.noOfPets,
        booking.isCancelled ? "Yes" : "No",
        booking.isCompleted ? "Yes" : "No",
        booking.cleaningFee,
        booking.petFee,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "bookings.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
