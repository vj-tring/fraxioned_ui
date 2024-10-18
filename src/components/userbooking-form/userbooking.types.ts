export interface User {
    id: number;
    firstName: string;
    lastName: string;
}

export interface Booking {
    id: number;
    bookingId: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    noOfPets: number;
    createdAt: string;
    updatedAt: string;
    cancelledAt: string | null;
    isLastMinuteBooking: number;
    noOfAdults: number;
    noOfChildren: number;
    notes: string;
    confirmationCode: string | null;
    cleaningFee: number;
    petFee: number;
    isCancelled: boolean;
    isCompleted: boolean;
    user: {
        id: number;
    };
    property: {
        id: number;
        propertyName: string;
    };
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
}

export interface BookingProps {
    openEvent: boolean;
    handleClose: () => void;
    eventId: number;
}
