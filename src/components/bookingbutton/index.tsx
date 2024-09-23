import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './booking.module.css';

const BookingButton: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin/bookings-grid');
    };

    return (
        <div className={styles.bookingButtonContainer}>
            <button className={styles.bookingButton} onClick={handleClick}>
                Bookings
            </button>
        </div>
    );
};

export default BookingButton;