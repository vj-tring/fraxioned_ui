import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperrtDetailsbyId, getpropertycodes } from '@/api';
import EditButton from '@/components/edit';
import styles from './propertyrules.module.css';
import Loader from '@/components/loader';
import { Users, Clock, Wifi, Calendar, Home, DollarSign, PawPrint } from 'lucide-react';

interface PropertyRulesData {
    noOfGuestsAllowed: number;
    noOfPetsAllowed: number;
    checkInTime: number;
    checkOutTime: number;
    feePerPet: number;
    squareFootage: number;
    wifiNetwork: string;
    peakSeasonStartDate: string;
    peakSeasonEndDate: string;
    petPolicy: string;
}

interface PropertyCode {
    propertyCodeType: string;
    propertyCode: string;
}

const PropertyRules: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [rulesData, setRulesData] = useState<PropertyRulesData | null>(null);
    const [propertyCodes, setPropertyCodes] = useState<PropertyCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rulesResponse, codesResponse] = await Promise.all([
                    getProperrtDetailsbyId(Number(id)),
                    getpropertycodes()
                ]);
                setRulesData(rulesResponse.data);
                setPropertyCodes(codesResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch property data. Please try again.');
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleEdit = () => {
        navigate(`/admin/property/${id}/rules/edit`);
    };

    const formatTime = (hour: number): string => {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:00 ${ampm}`;
    };

    const getWifiPassword = (): string => {
        const wifiPassword = propertyCodes.find(code => code.propertyCodeType === "Wifi Password");
        return wifiPassword ? wifiPassword.propertyCode : "Not available";
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
                    <div className={`${styles.ruleCard} ${styles.seasonCard}`}>
                        <div className={styles.cardIcon}><Calendar size={24} /></div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>Season Dates</h3>
                            <p><Calendar size={16} /> Peak Start: {rulesData.peakSeasonStartDate}</p>
                            <p><Calendar size={16} /> Peak End: {rulesData.peakSeasonEndDate}</p>
                        </div>
                    </div>
                    <div className={styles.ruleCard}>
                        <div className={styles.cardIcon}><Users size={24} /></div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>Guests & Pets</h3>
                            <p><Users size={16} /> Guests: {rulesData.noOfGuestsAllowed}</p>
                            <p><PawPrint size={16} /> Pets: {rulesData.noOfPetsAllowed}</p>
                            <p><DollarSign size={16} /> Pet Fee: ${rulesData.feePerPet}/pet</p>
                        </div>
                    </div>
                    <div className={styles.ruleCard}>
                        <div className={styles.cardIcon}><Clock size={24} /></div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.cardTitle}>Check-in/out</h3>
                            <p><Clock size={16} /> In: {formatTime(rulesData.checkInTime)}</p>
                            <p><Clock size={16} /> Out: {formatTime(rulesData.checkOutTime)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyRules;
