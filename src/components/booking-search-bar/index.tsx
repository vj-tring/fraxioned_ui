import React from 'react'
import './bookingbar.css'
import Region from '../region'
import PropertyCarousel from '../property-carousel'
import GuestSelector from '../guest-selector'
import Calendar from '../calender'

const BookingSearchBar: React.FC = () => {
  return (
    <div className="MainCard">
      <div className="card">
        <PropertyCarousel />
        <div className="vl p-2"></div>
        <Calendar />
        <div className="vl p-2"></div>
        <Region />
        <div className="vl"></div>
        <GuestSelector />
      </div>
    </div>
  )
}

export default BookingSearchBar
