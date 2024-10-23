import { axiosInstance } from "../axiosSetup";

export const getBookings = () => axiosInstance.get("/bookings");

export const getUserBookings = (userId: number) =>
    axiosInstance.get(`/bookings/user/${userId}`);

export const createBooking = (bookingData: void) =>
    axiosInstance.post(`/bookings/booking`, bookingData);

export const createBookingSummary = (bookingData: void) =>
    axiosInstance.post(`/bookings/booking/booking-summary`, bookingData);

export const modifyBooking = (bookingId: number, updatedBookingData: any) =>
    axiosInstance.patch(`/bookings/booking/${bookingId}`, updatedBookingData);

export const cancelBooking = (bookingId: number, userId: number) =>
    axiosInstance.post(`/bookings/${bookingId}/${userId}/cancel`);

