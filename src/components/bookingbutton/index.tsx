import React from 'react';
import { Link } from 'react-router-dom';
import styles from './booking.module.css';

const BookingButton: React.FC = () => {
    return (
        <div className={styles.bookingLinkContainer}>
            <Link to="/admin/bookings-grid" className={styles.bookingLink}>
                Go to Bookings
            </Link>
        </div>
    );
};

export default BookingButton;