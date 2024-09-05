import { useState, useEffect } from 'react';
import './booking.css';
import { Typography, Box, Tabs, Tab } from '@mui/material';
// import BookingSearchBar from '@/components/booking-search-bar';
import BookingGrid from '@/components/grid/BookingGrid';
import { BookingData, fetchBookings } from '@/store/slice/auth/bookingSlice';
import { AppDispatch } from '@/store';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@/store/reducers';
import { format } from 'date-fns';


const Booking = () => {

    const dispatch = useDispatch<AppDispatch>();

    const bookingdetails = useSelector((state: RootState) => state.bookings.bookings);
    // const properties = useSelector((state: RootState) => state.properties.cards);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const formattedDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, "MMM do, yyyy hh:mm a");
    };

    const details = bookingdetails.map((booking: BookingData) => {
        const guestDetails = `${booking.noOfAdults} Adults, ${booking.noOfChildren} Children, ${booking.noOfPets} Pet${booking.noOfPets > 1 ? 's' : ''}`;
        return {
            ...booking,
            property: booking.property.id,
            guest: guestDetails,
            checkinDate: formattedDate(booking.checkinDate),
            checkoutDate: formattedDate(booking.checkoutDate),
            createdAt: formattedDate(booking.createdAt),
        };
    });

    const handleEdit = (id: number) => {
        console.log(`Edit clicked for booking id: ${id}`);
    };

    const handleCancel = (id: number) => {
        console.log(`Cancel clicked for booking id: ${id}`);
    };

    return (
        <>
            {/* <div className="HomeImg">
            </div>
            <BookingSearchBar /> */}
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Bookings
                </Typography>
                <Tabs value={0}>
                    <Tab label="Upcoming" />
                    <Tab label="Completed" />
                    <Tab label="Cancelled" />
                    <Tab label="All" />
                </Tabs>
                <BookingGrid bookings={details} onEdit={handleEdit} onCancel={handleCancel} />
            </Box>

        </>
    );
};

export default Booking;
