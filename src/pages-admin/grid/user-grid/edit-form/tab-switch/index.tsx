import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserForm from '../userform';
import EditForm from '../useredit';
import PropertyTab from '../propertyUser';
import UserBookings from '../user-bookings';
import Availability from '../availablity';
import styles from './tab.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '@/api';

interface TabSwitchProps {
    onUserUpdated: () => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ onUserUpdated }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(null);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserById(Number(id));
                setUserData(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleUpdateSuccess = () => {
        setIsEditing(false);
        onUserUpdated();
    };

    const handleBackClick = () => {
        navigate('/admin/user');
    };

    if (!userData) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.tabContainer}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                aria-label="user edit tabs"
                className={styles.tabs}
            >
                <Tab label="General Details" />
                <Tab label="Property" />
                <Tab label="Booking" />
                <Tab label="Availability" />

                <IconButton
                    onClick={handleBackClick}
                    className={styles.backButton}
                    aria-label="back to user grid"
                >
                    <ArrowBackIcon />
                </IconButton>


            </Tabs>

            <div className={styles.content}>
                {selectedTab === 0 && !isEditing ? (
                    <UserForm
                        userId={Number(id)}
                        onEditClick={handleEditClick}
                    />
                ) : selectedTab === 0 && isEditing && (
                    <EditForm
                        user={userData}
                        onClose={() => setIsEditing(false)}
                        onUserUpdated={handleUpdateSuccess}
                    />
                )}

                {selectedTab === 1 && (
                    <PropertyTab Id={Number(id)} />
                )}

                {selectedTab === 2 && (
                    <UserBookings userId={Number(id)} />
                )}

                {selectedTab === 3 && (
                    <Availability userId={Number(id)} />
                )}
            </div>
        </div>
    );
};

export default TabSwitch;