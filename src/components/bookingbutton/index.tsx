import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import styles from './booking.module.css';

const BookingButton = () => {
    return (
        <div className={styles.bookingLinkContainer}>
            <span className={styles.line}>|</span>
            <Link to="/admin/bookings-grid" className={styles.bookingLink}>
                <Calendar className={styles.icon} size={15} />
                Go to Bookings
            </Link>
        </div>
    );
};

export default BookingButton;