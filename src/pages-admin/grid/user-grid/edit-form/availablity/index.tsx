import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Tab, Box, Paper, Grid } from '@mui/material';
import { getUserProperties } from '@/api';
import styles from './availablity.module.css';

interface UserProperty {
    year: number;
    peakAllottedNights: number;
    peakUsedNights: number;
    peakBookedNights: number;
    peakCancelledNights: number;
    peakLostNights: number;
    peakRemainingNights: number;
    peakAllottedHolidayNights: number;
    peakUsedHolidayNights: number;
    peakBookedHolidayNights: number;
    peakRemainingHolidayNights: number;
    offAllottedNights: number;
    offUsedNights: number;
    offBookedNights: number;
    offCancelledNights: number;
    offLostNights: number;
    offRemainingNights: number;
    offAllottedHolidayNights: number;
    offUsedHolidayNights: number;
    offBookedHolidayNights: number;
    offRemainingHolidayNights: number;
    lastMinuteAllottedNights: number;
    lastMinuteUsedNights: number;
    lastMinuteBookedNights: number;
    lastMinuteRemainingNights: number;
}

interface Property {
    propertyName: string;
    userProperties: UserProperty[];
}

interface AvailabilityProps {
    userId: number;
}

const Availability: React.FC<AvailabilityProps> = ({ userId }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserProperties = async () => {
            try {
                const response = await getUserProperties(userId);
                setProperties(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user properties:', err);
                setError('Failed to fetch user properties. Please try again.');
                setLoading(false);
            }
        };

        fetchUserProperties();
    }, [userId]);

    const handleYearChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedYear(newValue);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={styles.container}>
            {properties.map((property) => (
                <Paper key={property.propertyName} className={styles.propertyCard}>
                    <Typography variant="h4" className={styles.propertyName}>
                        {property.propertyName}
                    </Typography>
                    <Tabs
                        value={selectedYear}
                        onChange={handleYearChange}
                        aria-label="Year tabs"
                        className={styles.yearTabs}
                    >
                        {property.userProperties.map((userProperty) => (
                            <Tab key={userProperty.year} label={userProperty.year} value={userProperty.year} />
                        ))}
                    </Tabs>
                    {property.userProperties.map((userProperty) => (
                        userProperty.year === selectedYear && (
                            <Box key={userProperty.year} className={styles.yearDetails}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={6}>
                                        <div className={styles.seasonCard}>
                                            <Typography variant="h5" className={styles.seasonTitle}>Peak Season</Typography>
                                            <ul className={styles.nightsList}>
                                                <li>Allotted Nights: <span>{userProperty.peakAllottedNights}</span></li>
                                                <li>Used Nights: <span>{userProperty.peakUsedNights}</span></li>
                                                <li>Booked Nights: <span>{userProperty.peakBookedNights}</span></li>
                                                <li>Cancelled Nights: <span>{userProperty.peakCancelledNights}</span></li>
                                                <li>Lost Nights: <span>{userProperty.peakLostNights}</span></li>
                                                <li>Remaining Nights: <span>{userProperty.peakRemainingNights}</span></li>
                                            </ul>
                                            <Typography variant="h6" className={styles.holidayTitle}>Holiday Nights</Typography>
                                            <ul className={styles.nightsList}>
                                                <li>Allotted: <span>{userProperty.peakAllottedHolidayNights}</span></li>
                                                <li>Used: <span>{userProperty.peakUsedHolidayNights}</span></li>
                                                <li>Booked: <span>{userProperty.peakBookedHolidayNights}</span></li>
                                                <li>Remaining: <span>{userProperty.peakRemainingHolidayNights}</span></li>
                                            </ul>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div className={styles.seasonCard}>
                                            <Typography variant="h5" className={styles.seasonTitle}>Off Season</Typography>
                                            <ul className={styles.nightsList}>
                                                <li>Allotted Nights: <span>{userProperty.offAllottedNights}</span></li>
                                                <li>Used Nights: <span>{userProperty.offUsedNights}</span></li>
                                                <li>Booked Nights: <span>{userProperty.offBookedNights}</span></li>
                                                <li>Cancelled Nights: <span>{userProperty.offCancelledNights}</span></li>
                                                <li>Lost Nights: <span>{userProperty.offLostNights}</span></li>
                                                <li>Remaining Nights: <span>{userProperty.offRemainingNights}</span></li>
                                            </ul>
                                            <Typography variant="h6" className={styles.holidayTitle}>Holiday Nights</Typography>
                                            <ul className={styles.nightsList}>
                                                <li>Allotted: <span>{userProperty.offAllottedHolidayNights}</span></li>
                                                <li>Used: <span>{userProperty.offUsedHolidayNights}</span></li>
                                                <li>Booked: <span>{userProperty.offBookedHolidayNights}</span></li>
                                                <li>Remaining: <span>{userProperty.offRemainingHolidayNights}</span></li>
                                            </ul>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={styles.lastMinuteCard}>
                                            <Typography variant="h5" className={styles.seasonTitle}>Last Minute Bookings</Typography>
                                            <ul className={styles.nightsList}>
                                                <li>Allotted Nights: <span>{userProperty.lastMinuteAllottedNights}</span></li>
                                                <li>Used Nights: <span>{userProperty.lastMinuteUsedNights}</span></li>
                                                <li>Booked Nights: <span>{userProperty.lastMinuteBookedNights}</span></li>
                                                <li>Remaining Nights: <span>{userProperty.lastMinuteRemainingNights}</span></li>
                                            </ul>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    ))}
                </Paper>
            ))}
        </div>
    );
};

export default Availability;
