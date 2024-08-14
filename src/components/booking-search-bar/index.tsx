import React from 'react'
import './bookingbar.css'
import Region from '../region'
import PropertyCarousel from '../property-carousel'
import GuestSelector from '../guest-selector'

const BookingSearchBar: React.FC = () => {
  return (
    <div className="MainCard">
      <div className="card">
        <PropertyCarousel />
        <div className="vl p-2"></div>
        <Region />
        <div className="vl p-2"></div>
        <div className="d-flex align-items-start flex-column">
        <span className="DateHead1 monsterrat">Check Out</span>
        <p className="property1 monsterrat">Add Dates</p>
        </div>
        <div className="vl"></div>
        <GuestSelector />
      </div>
    </div>
  )
}

export default BookingSearchBar
