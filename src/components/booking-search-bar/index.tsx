//@ts-nocheck
import React from "react";
import "./bookingbar.css";
// import Region from '../region'
import PropertyCarousel from "../property-carousel";
import GuestSelector from "../guest-selector";

import PopoverCalendar from "./PopoverCalendar";
const BookingSearchBar: React.FC = () => {
  return (
    <div className="MainCard">
      <div className="card">
        <PropertyCarousel />
        <div className="vl"></div>
        <PopoverCalendar  />
        <div className="vl"></div>
        <GuestSelector />
      </div>
    </div>
  );
};

export default BookingSearchBar;
