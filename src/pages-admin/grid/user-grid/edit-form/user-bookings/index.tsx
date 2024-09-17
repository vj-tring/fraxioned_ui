import React, { useEffect, useState } from 'react';
import { getUserBookings } from '@/api';
import styles from './userbookings.module.css';

interface BookingProps {
    userId: number;
}

interface Booking {
    id: number;
    bookingId: string;
    propertyName: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfAdults: number;
    noOfChildren: number;
    noOfPets: number;
    cleaningFee: number;
}

interface GroupedBookings {
    [key: string]: Booking[];
}

const UserBookings: React.FC<BookingProps> = ({ userId }) => {
    const [groupedBookings, setGroupedBookings] = useState<GroupedBookings>({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(userId);
                const bookings = response.data.map((booking: any) => ({
                    ...booking,
                    propertyName: booking.property.propertyName
                }));
                const grouped = bookings.reduce((acc: GroupedBookings, booking: Booking) => {
                    if (!acc[booking.propertyName]) {
                        acc[booking.propertyName] = [];
                    }
                    acc[booking.propertyName].push(booking);
                    return acc;
                }, {});
                setGroupedBookings(grouped);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };
        fetchBookings();
    }, [userId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.bookingsContainer}>
            {Object.entries(groupedBookings).map(([propertyName, bookings]) => (
                <div key={propertyName} className={styles.propertyGroup}>
                    <h2 className={styles.propertyName}>{propertyName}</h2>
                    <div className={styles.bookingsList}>
                        {bookings.map((booking) => (
                            <div key={booking.id} className={styles.bookingCard}>
                                <div className={styles.bookingHeader}>
                                    <span className={styles.bookingId}>{booking.bookingId}</span>
                                </div>
                                <div className={styles.bookingDetails}>
                                    <div className={styles.bookingDates}>
                                        <div className={styles.dateBox}>
                                            <span className={styles.dateLabel}>Check-in</span>
                                            <span className={styles.date}>{formatDate(booking.checkinDate)}</span>
                                        </div>
                                        <div className={styles.dateBox}>
                                            <span className={styles.dateLabel}>Check-out</span>
                                            <span className={styles.date}>{formatDate(booking.checkoutDate)}</span>
                                        </div>
                                    </div>
                                    <div className={styles.bookingInfo}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Nights</span>
                                            <span className={styles.infoValue}>{booking.totalNights}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Adults</span>
                                            <span className={styles.infoValue}>{booking.noOfAdults}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Children</span>
                                            <span className={styles.infoValue}>{booking.noOfChildren}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Pets</span>
                                            <span className={styles.infoValue}>{booking.noOfPets}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Cleaning Fee:</span>
                                            <span className={styles.infoValue}>${booking.cleaningFee}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings;