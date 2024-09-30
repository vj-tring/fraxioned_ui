import React, { useEffect, useState } from 'react';
import { getUserBookings } from '@/api';
import styles from './userbookings.module.css';
import { Calendar, Users, DollarSign, Sparkles } from 'lucide-react';

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
                <div key={booking.id} className={styles.bookingTile}>
                    <div className={styles.tileHeader}>
                        <span className={styles.bookingId}>{booking.bookingId}</span>
                        <h3 className={styles.propertyName}>{booking.property.propertyName}</h3>
                    </div>
                    <div className={styles.tileContent}>
                        <div className={styles.infoSection}>
                            <div className={styles.infoItem}>
                                <Calendar size={14} />
                                <span>{formatDate(booking.checkinDate)} - {formatDate(booking.checkoutDate)}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <Users size={14} />
                                <span>{booking.noOfAdults || 0} Adults, {booking.noOfChildren || 0} Children, {booking.noOfPets} Pets</span>
                            </div>
                        </div>
                        <div className={styles.feesSection}>
                            <div className={styles.feeItem}>
                                <Sparkles size={14} />
                                <span>Cleaning: ${booking.cleaningFee?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className={styles.feeItem}>
                                <Sparkles size={14} />
                                <span>Pet: ${booking.petFee?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className={styles.totalItem}>
                                <DollarSign size={14} />
                                <span>Total: ${calculateTotalTransaction(booking.cleaningFee, booking.petFee).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserBookings;