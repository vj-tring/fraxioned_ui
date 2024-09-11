import React from "react";
import "../booking-summary/booking-summary.css";
import BookingSearchBar from "../../components/booking-search-bar";
import "../booking/booking-bar.css";
const BookingBar: React.FC = () => {
  return (
    <div className="home-content2">
      <div className="HomeImg2"></div>
      <div className="bookingsum1">
        <BookingSearchBar />
      </div>

    </div>
  );
};

export default BookingBar;
