import React, { useEffect, useState } from 'react';
import './bookingbar.css';
import Region from '../region';
import PropertyCarousel from '../property-carousel';
import GuestSelector from '../guest-selector';
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from '../calender';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { BookingData, saveBooking } from '@/store/slice/auth/bookingSlice';
import { selectSelectedPropertyDetails } from '@/store/slice/auth/property-slice';
import calendarData from '../calender/calendarData.json';
import CustomizedSnackbars from '../../components/customized-snackbar';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { AnyAction } from 'redux';

import PopoverCalendar from "./PopoverCalendar";
const BookingSearchBar: React.FC = () => {
    const today = new Date();
    const userId = '';
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [activeDate, setActiveDate] = useState<'check-in' | 'check-out' | null>(null);
    const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
    const bookingState = useSelector((state: RootState) => state.bookings);
    const isBookingLoading = bookingState?.isLoading;
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const selectedPropertyDetails = useSelector(selectSelectedPropertyDetails);

    // New state for snackbar
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleDateSelect = (range: DateRange | undefined) => {
        setDateRange(range);
        if (range?.from && !range.to) {
            setActiveDate('check-in');
        } else if (range?.from && range?.to) {
            setActiveDate('check-out');
        }
    };

    const handleRegionClick = (type: 'check-in' | 'check-out') => {
        setIsCalendarOpen(true);
        setActiveDate(type);
    };

    const isLastMinuteBooking = (checkInDate: Date) => {
        const diffInDays = (checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= calendarData.bookingRules.lastMinuteBooking.maxDays;
    };

    const showSnackbarMessage = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setShowSnackbar(true);
    };

    const handleBookingSubmit = () => {
        if (!dateRange?.from || !dateRange?.to) {
            showSnackbarMessage('Please select both check-in and check-out dates.', 'error');
            return;
        }

        if (!currentUser) {
            showSnackbarMessage('User is not logged in. Please log in to make a booking.', 'error');
            return;
        }

        if (!selectedPropertyDetails) {
            showSnackbarMessage('No property selected. Please select a property to book.', 'error');
            return;
        }

        const checkinDate = new Date(Date.UTC(dateRange.from.getFullYear(), dateRange.from.getMonth(), dateRange.from.getDate(), 12, 0, 0));
        const checkoutDate = new Date(Date.UTC(dateRange.to.getFullYear(), dateRange.to.getMonth(), dateRange.to.getDate(), 12, 0, 0));

        const bookingData: BookingData = {
            user: { id: currentUser.id },
            property: { id: selectedPropertyDetails.id },
            createdBy: { id: currentUser.id },
            checkinDate: checkinDate.toISOString(),
            checkoutDate: checkoutDate.toISOString(),
            noOfGuests: 2,
            noOfPets: 0,
            isLastMinuteBooking: isLastMinuteBooking(checkinDate),
            noOfAdults: 2,
            noOfChildren: 0,
            noOfInfants: 0,
            notes: 'Hi',
            confirmationCode: '',
            cleaningFee: 100,
            petFee: 0,
        };

        dispatch(saveBooking(bookingData));
    };


    useEffect(() => {
        if (!isBookingLoading && !errorMessage) {
            setDateRange(undefined);
        }

        if (bookingState.error) {
            showSnackbarMessage(bookingState.error, 'error');
        }
    }, [isBookingLoading, errorMessage, bookingState.successMessage, bookingState.error]);

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    };

    return (
        <div className="MainCard">
            <div className="card">
                <PropertyCarousel />
                <div className="vl p-2"></div>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <div>
                            <Region
                                label="Check In"
                                date={dateRange?.from}
                                onClick={() => handleRegionClick('check-in')}
                                isActive={isCalendarOpen && activeDate === 'check-in'}
                            />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="calendar-popover" align="start">
                        <DatePickerWithRange
                            onSelect={handleDateSelect}
                            initialRange={dateRange}
                            selectingFrom={activeDate === 'check-in'}
                            userId={userId}
                        />
                    </PopoverContent>
                </Popover>
                <div className="vl p-2"></div>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                        <div>
                            <Region
                                label="Check Out"
                                date={dateRange?.to}
                                onClick={() => handleRegionClick('check-out')}
                                isActive={isCalendarOpen && activeDate === 'check-out'}
                            />
                        </div>
                    </PopoverTrigger>
                </Popover>
                <div className="vl"></div>
                <GuestSelector />
                <div className="vl"></div>
                <button
                    onClick={handleBookingSubmit}
                    className="rounded-pill btn-book border-0"
                    disabled={isBookingLoading}
                >
                    Book Now
                </button>
            </div>
            <CustomizedSnackbars
                open={showSnackbar}
                handleClose={handleSnackbarClose}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </div>
    );
};

export default BookingSearchBar;