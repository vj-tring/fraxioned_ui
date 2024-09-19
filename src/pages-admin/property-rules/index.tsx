import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperrtDetailsbyId } from '@/api';
import EditButton from '@/components/edit';
import styles from './propertyrules.module.css';
import Loader from '@/components/loader';
import { Users, Dog, Clock, Wifi, Calendar, Moon, Sun } from 'lucide-react';

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
                <div className={styles.rulesContainer}>
                    <RuleCard icon={<Users />} title="Guests & Pets">
                        <p>Guests Allowed: {rulesData.noOfGuestsAllowed}</p>
                        <p>Pets Allowed: {rulesData.noOfPetsAllowed}</p>
                        <p>Pet Policy: {rulesData.petPolicy}</p>
                    </RuleCard>
                    <RuleCard icon={<Clock />} title="Check-in/out">
                        <p>Check-in: {formatTime(rulesData.checkInTime)}</p>
                        <p>Check-out: {formatTime(rulesData.checkOutTime)}</p>
                    </RuleCard>
                    <RuleCard icon={<Wifi />} title="WiFi">
                        <p>Network: {rulesData.wifiNetwork}</p>
                    </RuleCard>
                    <RuleCard icon={<Calendar />} title="Season Dates">
                        <p>Peak Start: {rulesData.peakSeasonStartDate}</p>
                        <p>Peak End: {rulesData.peakSeasonEndDate}</p>
                    </RuleCard>
                    <RuleCard icon={<Sun />} title="Peak Season">
                        <p>Allotted Nights: {rulesData.peakSeasonAllottedNights}</p>
                        <p>Holiday Nights: {rulesData.peakSeasonAllottedHolidayNights}</p>
                    </RuleCard>
                    <RuleCard icon={<Moon />} title="Off Season">
                        <p>Allotted Nights: {rulesData.offSeasonAllottedNights}</p>
                        <p>Holiday Nights: {rulesData.offSeasonAllottedHolidayNights}</p>
                    </RuleCard>
                </div>
            </div>
        </div>
    );
};

const RuleCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className={styles.ruleCard}>
        <div className={styles.cardIcon}>{icon}</div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardContent}>{children}</div>
    </div>
);

export default PropertyRules;