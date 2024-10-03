import React, { useEffect, useState } from 'react';
import { getUserBookings } from '@/api';
import styles from './userbookings.module.css';
import { Calendar, Users, DollarSign, Sparkles, Home, ChevronDown, ChevronUp } from 'lucide-react';

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
    const [expandedProperties, setExpandedProperties] = useState<Record<number, boolean>>({});

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await getUserBookings(userId);
                if (Array.isArray(response.data)) {
                    setBookings(response.data);
                    // Set the first property to be expanded by default
                    if (response.data.length > 0) {
                        const firstPropertyId = response.data[0].property.id;
                        setExpandedProperties({ [firstPropertyId]: true });
                    }
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

    const groupBookingsByProperty = (bookings: Booking[]) => {
        return bookings.reduce((acc, booking) => {
            const { property } = booking;
            if (!acc[property.id]) {
                acc[property.id] = {
                    propertyName: property.propertyName,
                    bookings: []
                };
            }
            acc[property.id].bookings.push(booking);
            return acc;
        }, {} as Record<number, { propertyName: string; bookings: Booking[] }>);
    };

    const togglePropertyExpansion = (propertyId: number) => {
        setExpandedProperties(prev => ({
            ...prev,
            [propertyId]: !prev[propertyId]
        }));
    };

    if (loading) return <div className={styles.message}>Loading bookings...</div>;
    if (error) return <div className={styles.message}>{error}</div>;
    if (bookings.length === 0) return <div className={styles.message}>No bookings available</div>;

    const groupedBookings = groupBookingsByProperty(bookings);

    return (
        <div className={styles.pageContainer}>
            {Object.entries(groupedBookings).map(([propertyId, { propertyName, bookings }]) => (
                <div key={propertyId} className={styles.propertyContainer}>
                    <div 
                        className={styles.propertyHeader}
                        onClick={() => togglePropertyExpansion(Number(propertyId))}
                    >
                        <h2 className={styles.propertyTitle}>
                            <Home className={styles.icon} size={20} />
                            {propertyName}
                        </h2>
                        {expandedProperties[Number(propertyId)] ? (
                            <ChevronUp className={styles.icon} size={20} />
                        ) : (
                            <ChevronDown className={styles.icon} size={20} />
                        )}
                    </div>
                    {expandedProperties[Number(propertyId)] && (
                        <div className={styles.bookingsContainer}>
                            {bookings.map((booking) => (
                                <div key={booking.id} className={styles.bookingTile}>
                                    <div className={styles.bookingId}># {booking.bookingId}</div>
                                    <div className={styles.bookingDetails}>
                                        <div className={styles.dateRange}>
                                            <Calendar size={14} />
                                            <span>{formatDate(booking.checkinDate)} - {formatDate(booking.checkoutDate)}</span>
                                        </div>
                                        <div className={styles.guests}>
                                            <Users size={14} />
                                            <span>{booking.noOfAdults || 0} Adults, {booking.noOfChildren || 0} Children, {booking.noOfPets} Pets</span>
                                        </div>
                                    </div>
                                    <div className={styles.bookingFees}>
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
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserBookings;