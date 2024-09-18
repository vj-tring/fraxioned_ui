import React, { useEffect, useState } from 'react';
import { getUserBookings } from '@/api';
import styles from './UserBookings.module.css';

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
    petFee: number;
}

const UserBookings: React.FC<BookingProps> = ({ userId }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(userId);
                const fetchedBookings = response.data.map((booking: any) => ({
                    ...booking,
                    propertyName: booking.property.propertyName
                }));
                setBookings(fetchedBookings);
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
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateTotalTransaction = (cleaning: number, pet: number) => {
        return cleaning + pet;
    };

    return (
        <div className={styles.bookingsContainer}>
            {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.bookingHeader}>
                        <span className={styles.bookingIdLabel}>Booking ID:</span>
                        <span className={styles.bookingId}>{booking.bookingId}</span>
                    </div>
                    <div className={styles.bookingContent}>
                        <h3 className={styles.propertyName}>{booking.propertyName}</h3>
                        <div className={styles.dateSection}>
                            <div className={styles.dateBox}>
                                <span className={styles.dateLabel}>Check-in</span>
                                <span className={styles.date}>{formatDate(booking.checkinDate)}</span>
                            </div>
                            <div className={styles.dateBox}>
                                <span className={styles.dateLabel}>Check-out</span>
                                <span className={styles.date}>{formatDate(booking.checkoutDate)}</span>
                            </div>
                        </div>
                        <div className={styles.infoContainer}>
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
                                <span className={styles.infoLabel}>Cleaning Fee</span>
                                <span className={styles.infoValue}>${booking.cleaningFee.toFixed(2)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Pet Fee</span>
                                <span className={styles.infoValue}>${booking.petFee.toFixed(2)}</span>
                            </div>
                            <div className={`${styles.infoItem} ${styles.totalTransaction}`}>
                                <span className={styles.infoLabel}>Total Transaction</span>
                                <span className={styles.infoValue}>
                                    ${calculateTotalTransaction(booking.cleaningFee, booking.petFee).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings;