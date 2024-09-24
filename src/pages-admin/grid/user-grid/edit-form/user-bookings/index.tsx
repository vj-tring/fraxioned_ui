import React, { useEffect, useState } from 'react';
import { getUserBookings } from '@/api';
import styles from './userbookings.module.css';

interface BookingProps {
    userId: number;
}

interface Booking {
    id: number;
    bookingId: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    noOfPets: number;
    noOfAdults: number | null;
    noOfChildren: number | null;
    cleaningFee: number | null;
    petFee: number | null;
    property: {
        id: number;
        propertyName: string;
    };
}

const UserBookings: React.FC<BookingProps> = ({ userId }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(userId);
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
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

    const calculateTotalTransaction = (cleaning: number | null, pet: number | null) => {
        const cleaningFee = cleaning || 0;
        const petFee = pet || 0;
        return cleaningFee + petFee;
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Loading bookings...</div>;
    }

    if (bookings.length === 0) {
        return <div className={styles.noBookingsMessage}>No bookings available</div>;
    }

    return (
        <div className={styles.bookingsContainer}>
            {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingTile}>
                    <div className={styles.tileHeader}>
                        <h3 className={styles.propertyName}>{booking.property.propertyName}</h3>
                        <span className={styles.bookingId}>{booking.bookingId}</span>
                    </div>
                    <div className={styles.tileContent}>
                        <div className={styles.dateSection}>
                            <div className={styles.dateBox}>
                                <span className={styles.dateLabel}>Check-in: </span>
                                <span className={styles.date}>{formatDate(booking.checkinDate)}</span>
                            </div>
                            <div className={styles.dateBox}>
                                <span className={styles.dateLabel}>Check-out: </span>
                                <span className={styles.date}>{formatDate(booking.checkoutDate)}</span>
                            </div>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Booked Nights: </span>
                                <span className={styles.infoValue}>{booking.totalNights}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Adults: </span>
                                <span className={styles.infoValue}>{booking.noOfAdults ?? 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Children: </span>
                                <span className={styles.infoValue}>{booking.noOfChildren ?? 'N/A'}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Pets: </span>
                                <span className={styles.infoValue}>{booking.noOfPets}</span>
                            </div>
                        </div>
                        <div className={styles.feeSection}>
                            <div className={styles.feeItem}>
                                <span className={styles.feeLabel}>Cleaning Fee: </span>
                                <span className={styles.feeValue}>
                                    {booking.cleaningFee !== null ? `$${booking.cleaningFee.toFixed(2)}` : 'N/A'}
                                </span>
                            </div>
                            <div className={styles.feeItem}>
                                <span className={styles.feeLabel}>Pet Fee: </span>
                                <span className={styles.feeValue}>
                                    {booking.petFee !== null ? `$${booking.petFee.toFixed(2)}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.totalTransaction}>
                            <span className={styles.totalLabel}>Total Transaction: </span>
                            <span className={styles.totalValue}>
                                ${calculateTotalTransaction(booking.cleaningFee, booking.petFee).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings;