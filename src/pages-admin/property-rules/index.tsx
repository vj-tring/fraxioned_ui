import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperrtDetailsbyId } from '@/api';
import EditButton from '@/components/edit';
import styles from './propertyrules.module.css';
import Loader from '@/components/loader';

interface PropertyRulesData {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
    checkInTime: number;
    checkOutTime: number;
    wifiNetwork: string;
    peakSeasonStartDate: string;
    peakSeasonEndDate: string;
    petPolicy: string;
    peakSeasonAllottedNights: string;
    offSeasonAllottedNights: string;
    peakSeasonAllottedHolidayNights: string;
    offSeasonAllottedHolidayNights: string;
    lastMinuteBookingAllottedNights: string;
}

const PropertyRules: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rulesData, setRulesData] = useState<PropertyRulesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRulesData = async () => {
            try {
                const response = await getProperrtDetailsbyId(Number(id));
                setRulesData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching property rules:', err);
                setError('Failed to fetch property rules. Please try again.');
                setLoading(false);
            }
        };
        fetchRulesData();
    }, [id]);

    const handleEdit = () => {
        navigate(`/admin/property/${id}/rules/edit`);
    };

    const formatTime = (hour: number): string => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:00 ${ampm}`;
    };

    if (loading) return <Loader />;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!rulesData) return <div className={styles.noData}>No rules data found.</div>;

    return (
        <div className={styles.fullContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Property Rules</h2>
                    <EditButton onClick={handleEdit} />
                </div>
                <div className={styles.rulesGrid}>
                    <InfoItem label="Guests Allowed" value={rulesData.noOfGuestsAllowed} />
                    <InfoItem label="Pet Policy" value={rulesData.petPolicy} />
                    <InfoItem label="Pets Allowed" value={rulesData.noOfPetsAllowed} />
                    <InfoItem label="Check-in Time" value={formatTime(rulesData.checkInTime)} />
                    <InfoItem label="Check-out Time" value={formatTime(rulesData.checkOutTime)} />
                    <InfoItem label="WiFi Network" value={rulesData.wifiNetwork} />
                    <InfoItem label="Peak Season Start" value={rulesData.peakSeasonStartDate} />
                    <InfoItem label="Peak Season End" value={rulesData.peakSeasonEndDate} />
                    <InfoItem label="Peak Season Alloted Nights" value={rulesData.peakSeasonAllottedNights} />
                    <InfoItem label="Off Season Alloted Nights" value={rulesData.offSeasonAllottedNights} />
                    <InfoItem label="Peak Season Alloted Holiday Nights" value={rulesData.peakSeasonAllottedHolidayNights} />
                    <InfoItem label="Off Season Alloted Holiday Nights" value={rulesData.offSeasonAllottedHolidayNights} />
                    <InfoItem label="Last Minute Booking Alloted Nights" value={rulesData.lastMinuteBookingAllottedNights} />
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className={styles.infoItem}>
        <span className={styles.label}>{label}:</span>
        <span className={styles.value}>{value}</span>
    </div>
);

export default PropertyRules;