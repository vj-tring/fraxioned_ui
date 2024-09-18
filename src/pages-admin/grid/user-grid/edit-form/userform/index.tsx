import React, { useState, useEffect } from 'react';
import { getUserById } from '@/api';
import { Edit, Mail, Phone, MapPin, Building, Flag, Hash, Clock } from 'lucide-react';
import defaultProfile from '../../../../../assets/images/profile.jpeg';
import styles from './userform.module.css';

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
    onEditClick: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userId, onEditClick }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserById(userId);
                setUser(response.data.user);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Failed to fetch user data. Please try again.');
            }
        };

        fetchUser();
    }, [userId]);

    if (error) return <div className={styles.error}>{error}</div>;
    if (!user) return <div className={styles.error}>User not found</div>;

    return (
        <div className={styles.userForm}>
            <div className={styles.header}>
                <h2>User Details</h2>
                <button className={styles.editButton} onClick={onEditClick}>
                    <Edit size={16} />
                    Edit Profile
                </button>
            </div>
            <div className={styles.content}>
                <div className={styles.profileSection}>
                    <img
                        src={user.imageURL || defaultProfile}
                        alt={`${user.firstName} ${user.lastName}`}
                        className={styles.profileImage}
                    />
                    <h3>{user.firstName} {user.lastName}</h3>
                    <p className={styles.role}>{user.role.roleName}</p>
                    <p className={`${styles.status} ${user.isActive ? styles.activeStatus : styles.inactiveStatus}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                    </p>
                </div>
                <div className={styles.detailsSection}>
                    <div className={styles.detailItem}>
                        <Mail size={20} />
                        <div>
                            <strong>Email</strong>
                            <p>{user.contactDetails.primaryEmail}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <Phone size={20} />
                        <div>
                            <strong>Phone</strong>
                            <p>{user.contactDetails.primaryPhone}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <MapPin size={20} />
                        <div>
                            <strong>Address</strong>
                            <p>{user.addressLine1}{user.addressLine2 ? `, ${user.addressLine2}` : ''}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <Building size={20} />
                        <div>
                            <strong>City</strong>
                            <p>{user.city || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <MapPin size={20} />
                        <div>
                            <strong>State</strong>
                            <p>{user.state || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <Flag size={20} />
                        <div>
                            <strong>Country</strong>
                            <p>{user.country || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <Hash size={20} />
                        <div>
                            <strong>Zipcode</strong>
                            <p>{user.zipcode || 'N/A'}</p>
                        </div>
                    </div>
                    <div className={styles.detailItem}>
                        <Clock size={20} />
                        <div>
                            <strong>Last Login</strong>
                            <p>{new Date(user.lastLoginTime).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserForm;