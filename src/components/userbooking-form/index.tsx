import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import moment from "moment";
import { getBookings, userdetails } from "@/api";
import { Edit, CalendarToday, Person, Home, CheckCircle, CancelOutlined, Group, Pets, AttachMoney, Schedule, Block } from '@mui/icons-material';
import imageone from '../../assests/blue-bear-lake.jpg';
import imagetwo from '../../assests/crown-jewel.jpg';
import imagethree from '../../assests/blue-bear-lake.jpg';
import styles from './userbooking.module.css';

interface BookingProps {
    openEvent: boolean;
    handleClose: () => void;
    eventId: number;
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
}

interface Booking {
    id: number;
    bookingId: string;
    checkinDate: string;
    checkoutDate: string;
    totalNights: number;
    noOfGuests: number;
    noOfPets: number;
    createdAt: string;
    updatedAt: string;
    cancelledAt: string | null;
    isLastMinuteBooking: number;
    noOfAdults: number;
    noOfChildren: number;
    notes: string;
    confirmationCode: string | null;
    cleaningFee: number;
    petFee: number;
    isCancelled: boolean;
    isCompleted: boolean;
    user: {
        id: number;
    };
    property: {
        id: number;
        propertyName: string;
    };
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
}

const ViewBookings: React.FC<BookingProps> = ({ openEvent, handleClose, eventId }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (openEvent) {
            fetchBookingDetails();
            fetchUsers();
        }
    }, [openEvent, eventId]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            const response = await getBookings();
            const bookingData = response.data.find((b: Booking) => b.id === eventId);
            if (bookingData) {
                setBooking(bookingData);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await userdetails();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const getUserName = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
    };

    const getPropertyImage = (propertyId: number) => {
        switch (propertyId) {
            case 1:
                return imageone;
            case 2:
                return imagetwo;
            case 3:
                return imagethree;
            default:
                return imageone;
        }
    };

    const handleEdit = () => {
        console.log("Edit clicked for booking:", booking);
    };

    return (
        <Dialog
            open={openEvent}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            className={styles.bookingDialog}
            maxWidth="lg"
            fullWidth
        >
            <div className={styles.dialogHeader}>
                <h2 className={styles.dialogTitle}>Booking Details</h2>
                <button onClick={handleEdit} className={styles.editButton}>
                    <Edit />
                </button>
            </div>
            <DialogContent className={styles.dialogContent}>
                {booking && (
                    <div className={styles.bookingDetailsContainer}>
                        <div className={styles.bookingInfo}>
                            <div className={styles.detailItem}>
                                <Home className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Property</span>
                                <span className={styles.detailValue}>{booking.property.propertyName}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Person className={styles.detailIcon} />
                                <span className={styles.detailLabel}>User</span>
                                <span className={styles.detailValue}>{getUserName(booking.user.id)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CheckCircle className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Check-in</span>
                                <span className={styles.detailValue}>{moment(booking.checkinDate).format('MMMM Do YYYY, h:mm a')}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CancelOutlined className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Check-out</span>
                                <span className={styles.detailValue}>{moment(booking.checkoutDate).format('MMMM Do YYYY, h:mm a')}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <CalendarToday className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Booked on</span>
                                <span className={styles.detailValue}>{moment(booking.createdAt).format('MMMM Do YYYY')}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Group className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Guests</span>
                                <span className={styles.detailValue}>{`Adults: ${booking.noOfAdults}, Children: ${booking.noOfChildren}`}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Pets className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Pets</span>
                                <span className={styles.detailValue}>{booking.noOfPets}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <AttachMoney className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Fees</span>
                                <span className={styles.detailValue}>{`Cleaning: $${booking.cleaningFee}, Pet: $${booking.petFee}`}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Block className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Cancelled</span>
                                <span className={styles.detailValue}>{booking.isCancelled ? 'Yes' : 'No'}</span>
                            </div>

                            <div className={styles.detailItem}>
                                <Schedule className={styles.detailIcon} />
                                <span className={styles.detailLabel}>Last-Minute</span>
                                <span className={styles.detailValue}>{booking.isLastMinuteBooking === 1 ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                        <div className={styles.bookingImage}>
                            <img src={getPropertyImage(booking.property.id)} alt="Property" />
                        </div>
                    </div>
                )}
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                <Button onClick={handleClose} color="primary" className={styles.closeButton}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ViewBookings;