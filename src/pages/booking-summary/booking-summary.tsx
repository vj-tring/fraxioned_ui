import React from "react";
import "../booking-summary/booking-summary.css";
import BookingSearchBar from "../../components/booking-search-bar";
import BookingSummaryForm from "./booking-summary-form";

const BookingSummary: React.FC = () => {
  return (
    <div className="home-content1">
      <div className="HomeImg1"></div>
      <div className="bookingsum">
        <BookingSearchBar />
      </div>

      <BookingSummaryForm />
    </div>
  );
};

export default BookingSummary;
