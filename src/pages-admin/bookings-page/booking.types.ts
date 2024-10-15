export interface User {
    id: number;
    firstName: string;
    lastName: string;
  }
  
  export interface Property {
    id: number;
    propertyName: string;
  }
  
  export interface Booking {
    id: number;
    bookingId: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    isLastMinuteBooking: number;
    noOfPets: number;
    isCancelled: boolean;
    isCompleted: boolean;
    cleaningFee: number;
    petFee: number;
    userId: number;
    propertyId: number;
    userName: string;
    propertyName: string;
  }
  