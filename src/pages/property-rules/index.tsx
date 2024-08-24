import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperrtDetailsbyId } from '@/api';
import EditButton from '@/components/edit';
import styles from './propertyrules.module.css';

interface PropertyRulesData {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
    checkInTime: number;
    checkOutTime: number;
    wifiNetwork: string;
    peakSeasonStartDate: string;
    peakSeasonEndDate: string;
    petPolicy: string;
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!rulesData) return <div>No rules data found.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h2 className={styles.title}>Property Rules</h2>
                <EditButton onClick={handleEdit} />
            </div>
            <div className={styles.rulesGrid}>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Guests Allowed:</span>
                    <span className={styles.value}>{rulesData.noOfGuestsAllowed}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Pets Allowed:</span>
                    <span className={styles.value}>{rulesData.noOfPetsAllowed}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Check-in Time:</span>
                    <span className={styles.value}>{formatTime(rulesData.checkInTime)}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Check-out Time:</span>
                    <span className={styles.value}>{formatTime(rulesData.checkOutTime)}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>WiFi Network:</span>
                    <span className={styles.value}>{rulesData.wifiNetwork}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Peak Season Start:</span>
                    <span className={styles.value}>{new Date(rulesData.peakSeasonStartDate).toLocaleDateString()}</span>
                </div>
                <div className={styles.ruleItem}>
                    <span className={styles.label}>Peak Season End:</span>
                    <span className={styles.value}>{new Date(rulesData.peakSeasonEndDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyRules;