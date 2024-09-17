import React, { useState, useEffect } from 'react';
import { getUserById } from '@/api';
import { Edit } from 'lucide-react';
import profile from '../../../../../assets/images/profile.jpeg';
import styles from './userform.module.css';
import Loader from '@/components/loader';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    imageURL: string | null;
    isActive: number;
    addressLine1: string | null;
    addressLine2: string | null;
    state: string | null;
    country: string | null;
    city: string | null;
    zipcode: string | null;
    lastLoginTime: string;
    contactDetails: {
        primaryEmail: string;
        primaryPhone: string;
    };
    role: {
        roleName: string;
    };
}

interface UserFormProps {
    userId: number;
    onClose: () => void;
    onEditClick: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userId, onClose, onEditClick }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);
                setUser(response.data.user);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to fetch user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <Loader />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div className={styles.error}>User not found</div>;

    return (
        <div className={styles.userForm}>
            <div className={styles.header}>
                <h2>User Details</h2>
                <button onClick={onClose} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.content}>
                <div className={styles.profileSection}>
                    <img
                        src={user.imageURL || profile}
                        alt={`${user.firstName} ${user.lastName}`}
                        className={styles.profileImage}
                    />
                </div>
                <div className={styles.detailsSection}>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className={styles.role}>{user.role.roleName}</p>
                    <div className={styles.detailItem}>
                        <strong>Email:</strong> {user.contactDetails.primaryEmail}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Phone:</strong> {user.contactDetails.primaryPhone}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Address:</strong> {user.addressLine1}, {user.addressLine2}, {user.city}, {user.state}, {user.country}, {user.zipcode}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Last Login:</strong> {new Date(user.lastLoginTime).toLocaleString()}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}
                    </div>
                </div>
            </div>
            <div className={styles.footer}>
                <button className={styles.editButton} onClick={onEditClick}>
                    <Edit size={16} />
                    Edit
                </button>
            </div>
        </div>
    );
};

export default UserForm;