import React, { useState, useEffect } from 'react';
import { 
    Typography, Box, CircularProgress, Paper, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { getUserById, propertydetailsapi } from '@/api';
import styles from './userform.module.css';

interface UserDetailsProps {
    userId: number;
    onClose: () => void;
}

interface ContactDetails {
    id: number;
    primaryEmail: string;
    secondaryEmail: string | null;
    optionalEmailOne: string | null;
    optionalEmailTwo: string | null;
    primaryPhone: string;
    secondaryPhone: string | null;
    optionalPhoneOne: string | null;
    optionalPhoneTwo: string | null;
    createdAt: string;
    updatedAt: string;
}

interface UserData {
    id: number;
    role: { id: number; roleName: string };
    firstName: string;
    lastName: string;
    imageURL: string | null;
    isActive: boolean;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    zipcode: string | null;
    lastLoginTime: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    contactDetails: ContactDetails;
}

interface PropertyData {
    propertyId: number;
    propertyName: string;
    owners: { userId: number }[];
}

const UserDetails: React.FC<UserDetailsProps> = ({ userId, onClose }) => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [properties, setProperties] = useState<PropertyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, propertiesResponse] = await Promise.all([
                    getUserById(userId),
                    propertydetailsapi()
                ]);
                setUserData(userResponse.data.user);
                setProperties(propertiesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const getUserProperties = (userId: number) => {
        return properties
            .filter(property => property.owners.some(owner => owner.userId === userId))
            .map(property => property.propertyName);
    };

    if (loading) {
        return (
            <Box className={styles.loadingContainer}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Box className={styles.errorContainer}>
                <Typography variant="h6" color="error">{error || 'User data not found'}</Typography>
            </Box>
        );
    }

    const userProperties = getUserProperties(userData.id);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.formContainer}>
                <div className={styles.staticHeader}>
                    <div className={styles.formHeader}>
                        <PersonIcon className={styles.headerIcon} />
                        <Typography variant="h4" className={styles.formTitle}>
                            {`${userData.firstName} ${userData.lastName}'s Information`}
                        </Typography>
                        <IconButton onClick={onClose} className={styles.closeButton}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div className={styles.scrollableContent}>
                    <Paper className={styles.formPaper}>
                        <div className={styles.detailsSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>Basic Information</Typography>
                            <DetailItem label="ID" value={userData.id.toString()} />
                            <DetailItem label="Role" value={userData.role.roleName} />
                            <DetailItem label="First Name" value={userData.firstName} />
                            <DetailItem label="Last Name" value={userData.lastName} />
                            <DetailItem label="Active" value={userData.isActive ? 'Yes' : 'No'} />
                            <DetailItem label="Last Login" value={new Date(userData.lastLoginTime).toLocaleString()} />
                        </div>

                        <div className={styles.detailsSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>Address</Typography>
                            <DetailItem label="Address Line 1" value={userData.addressLine1 || 'N/A'} />
                            <DetailItem label="Address Line 2" value={userData.addressLine2 || 'N/A'} />
                            <DetailItem label="City" value={userData.city || 'N/A'} />
                            <DetailItem label="State" value={userData.state || 'N/A'} />
                            <DetailItem label="Country" value={userData.country || 'N/A'} />
                            <DetailItem label="Zipcode" value={userData.zipcode || 'N/A'} />
                        </div>

                        <div className={styles.detailsSection}>
                            <Typography variant="h6" className={styles.sectionTitle}>Contact Details</Typography>
                            <DetailItem label="Primary Email" value={userData.contactDetails.primaryEmail} />
                            <DetailItem label="Secondary Email" value={userData.contactDetails.secondaryEmail || 'N/A'} />
                            <DetailItem label="Optional Email 1" value={userData.contactDetails.optionalEmailOne || 'N/A'} />
                            <DetailItem label="Optional Email 2" value={userData.contactDetails.optionalEmailTwo || 'N/A'} />
                            <DetailItem label="Primary Phone" value={userData.contactDetails.primaryPhone} />
                            <DetailItem label="Secondary Phone" value={userData.contactDetails.secondaryPhone || 'N/A'} />
                            <DetailItem label="Optional Phone 1" value={userData.contactDetails.optionalPhoneOne || 'N/A'} />
                            <DetailItem label="Optional Phone 2" value={userData.contactDetails.optionalPhoneTwo || 'N/A'} />
                        </div>

                        {userProperties.length > 0 && (
                            <div className={styles.detailsSection}>
                                <Typography variant="h6" className={styles.sectionTitle}>Properties</Typography>
                                {userProperties.map((property, index) => (
                                    <DetailItem key={index} label={`Property ${index + 1}`} value={property} />
                                ))}
                            </div>
                        )}
                    </Paper>
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className={styles.detailItem}>
        <Typography variant="subtitle2" className={styles.detailLabel}>{label}:</Typography>
        <Typography variant="body1" className={styles.detailValue}>{value}</Typography>
    </div>
);

export default UserDetails;