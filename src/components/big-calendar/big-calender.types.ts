export interface User {
    id: number;
    firstName: string;
    lastName: string;
  }
  
  export interface Booking {
    id: number;
    createdAt: string;
    bookingId: string;
    checkinDate: string;
    isLastMinuteBooking: number;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    property: {
      id: number;
      propertyName: string;
    };
    user: {
      id: number;
    };
  }
  
  export interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    desc: string;
    propertyId: number;
    userId: number;
    createdAt: string;
  }