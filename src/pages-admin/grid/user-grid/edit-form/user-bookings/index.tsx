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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(userId);
                if (Array.isArray(response.data)) {
                    setBookings(response.data);
                } else {
                    setError('No bookings available');
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Error fetching bookings. Please try again later.');
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
        return (cleaning || 0) + (pet || 0);
    };

    if (loading) return <div className={styles.message}>Loading bookings...</div>;
    if (error) return <div className={styles.message}>{error}</div>;
    if (bookings.length === 0) return <div className={styles.message}>No bookings available</div>;

    return (
        <div className={styles.bookingsContainer}>
            {bookings.map((booking) => (
                <div key={booking.id} className={styles.bookingCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.propertyName}>{booking.property.propertyName}</h3>
                        <span className={styles.bookingId}>{booking.bookingId}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.dateInfo}>
                            <div>
                                <span className={styles.label}>Check-in:</span>
                                <span className={styles.value}>{formatDate(booking.checkinDate)}</span>
                            </div>
                            <div>
                                <span className={styles.label}>Check-out:</span>
                                <span className={styles.value}>{formatDate(booking.checkoutDate)}</span>
                            </div>
                        </div>
                        <div className={styles.guestInfo}>
                            <div>
                                <span className={styles.label}>Guests:</span>
                                <span className={styles.value}>
                                    {booking.noOfAdults || 0} Adults, {booking.noOfChildren || 0} Children
                                </span>
                            </div>
                            <div>
                                <span className={styles.label}>Pets:</span>
                                <span className={styles.value}>{booking.noOfPets}</span>
                            </div>
                        </div>
                        <div className={styles.feeInfo}>
                            <div>
                                <span className={styles.label}>Cleaning Fee:</span>
                                <span className={styles.value}>
                                    {booking.cleaningFee !== null ? `$${booking.cleaningFee.toFixed(2)}` : 'N/A'}
                                </span>
                            </div>
                            <div>
                                <span className={styles.label}>Pet Fee:</span>
                                <span className={styles.value}>
                                    {booking.petFee !== null ? `$${booking.petFee.toFixed(2)}` : 'N/A'}
                                </span>
                            </div>
                        </div>
                        <div className={styles.totalTransaction}>
                            <span className={styles.label}>Total:</span>
                            <span className={styles.value}>
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