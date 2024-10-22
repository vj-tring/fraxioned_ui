import { User } from "@/store/model";
import { BookingData } from "@/store/slice/auth/bookingSlice";

export interface ContactDetails {
    id: number;
    primaryEmail: string;
    secondaryEmail: string | null;
    optionalEmailOne: string | null;
    optionalEmailTwo: string | null;
    primaryPhone: string;
    secondaryPhone: string | null;
    optionalPhoneOne: string | null;
    optionalPhoneTwo: string | null;
    createdAt: string;
    updatedAt: string;
}


export interface UserFormProp {
    userId: number;
    onEditClick: () => void;
    header: string;
    editButtonName: string;
    showActiveStatus: boolean;
    customStyles?: {
        userForm?: string;
        header?: string;
        userName?: string;
        editButton?: string;
        content?: string;
        profileSection?: string;
        imageContainer?: string;
        profileImage?: string;
        role?: string;
        status?: string;
        activeStatus?: string;
        inactiveStatus?: string;
        detailsSection?: string;
        detailItem?: string;
        error?: string;
    };
}


export interface UserData {
    id: number;
    role: { id: number; roleName: string };
    firstName: string;
    lastName: string;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipcode: string | null;
    isActive: boolean;
    contactDetails: ContactDetails;
    createdBy: number;
    lastLoginTime: string;
    imageURL: string | null;
    password?: string;
    resetToken?: string;
    resetTokenExpires?: string;
    updatedBy?: number;
    properties?: string[];
}

export interface PropertyData {
    propertyId: number;
    propertyName: string;
    owners: { userId: number }[];
}


export interface UserFormProps {
    user: User;
    onEditClick: () => void;
    header?: string;
    editButtonName?: string;
    showActiveStatus?: boolean;
    customStyles?: {
        userForm?: string;
        header?: string;
        editButton?: string;
        content?: string;
        profileSection?: string;
        imageContainer?: string;
        profileImage?: string;
        role?: string;
        status?: string;
        activeStatus?: string;
        inactiveStatus?: string;
        detailsSection?: string;
        detailItem?: string;
        error?: string;
    };
}

export interface EditFormProps {
    user: User;
    onClose: () => void;
    onUserUpdated: () => void;
    showCloseIcon?: boolean;
    formTitle?: string;
    isAdmin: boolean;
}

export interface UserProperty {
    id: number;
    noOfShare: number;
    acquisitionDate: string;
    isActive: number;
    year: number;
    peakAllottedNights: number;
    peakUsedNights: number;
    peakBookedNights: number;
    peakCancelledNights: number;
    peakLostNights: number;
    peakRemainingNights: number;
    peakAllottedHolidayNights: number;
    peakUsedHolidayNights: number;
    peakBookedHolidayNights: number;
    peakRemainingHolidayNights: number;
    offAllottedNights: number;
    offUsedNights: number;
    offBookedNights: number;
    offCancelledNights: number;
    offLostNights: number;
    offRemainingNights: number;
    offAllottedHolidayNights: number;
    offUsedHolidayNights: number;
    offBookedHolidayNights: number;
    offRemainingHolidayNights: number;
    lastMinuteAllottedNights: number;
    lastMinuteUsedNights: number;
    lastMinuteBookedNights: number;
    lastMinuteRemainingNights: number;
}


export interface PropertyResponse {
    propertyId: number;
    propertyName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: number;
    isActive: boolean;
    userProperties: UserProperty[];
    propertyShare: number;
}

export interface EnhancedPropertyTabProps {
    userId: number;
}


export interface BookingProps {
    userId: number;
}
export interface Booking extends BookingData {
    id: string;
    bookingId: string;
    totalNights: number;
    noOfGuests: number;
    property: {
        id: string;
        propertyName: string;
    };
}

export interface GroupedBookings {
    [key: string]: {
        propertyName: string;
        bookings: Booking[];
    };
}

