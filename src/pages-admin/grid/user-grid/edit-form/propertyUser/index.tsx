import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography } from "@mui/material";
import { getUserProperties } from "@/api";
import styles from "./propertyTab.module.css";
import { Image as ImageIcon } from "lucide-react";
import imageone from '../../../../../assests/bear-lake-bluffs.jpg';
import imagetwo from '../../../../../assests/crown-jewel.jpg';
import imagethree from '../../../../../assests/lake-escape.jpg';

interface UserProperty {
  id: number;
  noOfShare: number;
  acquisitionDate: string;
  isActive: number;
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

interface PropertyResponse {
  propertyId: number;
  propertyName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  isActive: boolean;
  userProperties: UserProperty[];
  propertyShare: number;
}

interface EnhancedPropertyTabProps {
  userId: number;
}

const PropertyTab: React.FC<EnhancedPropertyTabProps> = ({ userId }) => {
  const [propertyData, setPropertyData] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<{ [key: number]: number }>({});

  const images = [imageone, imagetwo, imagethree];

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await getUserProperties(userId);
        setPropertyData(response.data);

        const initialYears: { [key: number]: number } = {};
        response.data.forEach((prop: PropertyResponse) => {
          initialYears[prop.propertyId] = new Date().getFullYear();
        });
        setSelectedYears(initialYears);
      } catch (err) {
        console.error("Error fetching property data:", err);
        setError("Failed to fetch property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [userId]);

  if (loading) return <Typography className={styles.loadingText}>Loading...</Typography>;
  if (error) return <Typography className={styles.errorText} color="error">{error}</Typography>;

  const renderNightInfoBlock = (userProperty: UserProperty, season: 'peak' | 'off' | 'lastMinute') => {
    const getNightInfo = (type: string) => {
      switch (season) {
        case 'peak':
          return userProperty[`peak${type}Nights` as keyof UserProperty];
        case 'off':
          return userProperty[`off${type}Nights` as keyof UserProperty];
        case 'lastMinute':
          return userProperty[`lastMinute${type}Nights` as keyof UserProperty];
        default:
          return 0;
      }
    };

    return (
      <div className={`${styles.nightInfoBlock} ${styles[`${season}Block`]}`}>
        <Typography variant="subtitle2" className={styles.seasonTitle}>
          {season === 'lastMinute' ? 'Last Minute' : `${season.charAt(0).toUpperCase() + season.slice(1)} Season`}
        </Typography>
        <div className={styles.nightInfoContent}>
          <div className={styles.nightInfoColumn}>
            <Typography variant="caption" className={styles.nightInfoSubtitle}>Nights</Typography>
            <div className={styles.nightInfoRow}>
              <span className={styles.nightInfoLabel}>Total:</span>
              <span className={styles.nightInfoValue}>{getNightInfo('Allotted')}</span>
            </div>
            <div className={styles.nightInfoRow}>
              <span className={styles.nightInfoLabel}>Used:</span>
              <span className={styles.nightInfoValue}>{getNightInfo('Used')}</span>
            </div>
            <div className={styles.nightInfoRow}>
              <span className={styles.nightInfoLabel}>Booked:</span>
              <span className={styles.nightInfoValue}>{getNightInfo('Booked')}</span>
            </div>
            <div className={styles.nightInfoRow}>
              <span className={styles.nightInfoLabel}>Remaining:</span>
              <span className={styles.nightInfoValue}>{getNightInfo('Remaining')}</span>
            </div>
          </div>
          {season !== 'lastMinute' && (
            <div className={styles.nightInfoColumn}>
              <Typography variant="caption" className={styles.nightInfoSubtitle}>Holiday Nights</Typography>
              <div className={styles.nightInfoRow}>
                <span className={styles.nightInfoLabel}>Total:</span>
                <span className={styles.nightInfoValue}>{getNightInfo('AllottedHoliday')}</span>
              </div>
              <div className={styles.nightInfoRow}>
                <span className={styles.nightInfoLabel}>Used:</span>
                <span className={styles.nightInfoValue}>{getNightInfo('UsedHoliday')}</span>
              </div>
              <div className={styles.nightInfoRow}>
                <span className={styles.nightInfoLabel}>Booked:</span>
                <span className={styles.nightInfoValue}>{getNightInfo('BookedHoliday')}</span>
              </div>
              <div className={styles.nightInfoRow}>
                <span className={styles.nightInfoLabel}>Remaining:</span>
                <span className={styles.nightInfoValue}>{getNightInfo('RemainingHoliday')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.propertyTabContainer}>
      {propertyData.map((prop: PropertyResponse, index: number) => {
        const userProperty = prop.userProperties.find(up => up.year === selectedYears[prop.propertyId]);
        if (!userProperty) return null;

        const shareFraction = `${userProperty.noOfShare}/${prop.propertyShare}`;
        const randomImage = images[index % images.length];

        return (
          <Card key={prop.propertyId} className={styles.propertyCard}>
            <div className={styles.propertyContent}>
              <div className={styles.propertyLeftContent}>
                <div className={styles.propertyImageWrapper}>
                  {randomImage ? (
                    <img src={randomImage} alt={prop.propertyName} className={styles.propertyImage} />
                  ) : (
                    <div className={styles.propertyNoImage}>
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <CardContent className={styles.propertyInfo}>
                  <div className={styles.propertyInfoContainer}>
                    <Typography variant="h6" className={styles.propertyName}>
                      {prop.propertyName}
                    </Typography>
                    <Typography variant="body2" className={styles.propertyAddress}>
                      {prop.address}, {prop.city}, {prop.state}, {prop.zipcode}
                    </Typography>
                    <div className={styles.propertyDetails}>
                      <div className={styles.propertyDetailItem}>
                        <span className={styles.propertyDetailLabel}>Shares:</span>
                        <span className={styles.propertyDetailValue}>{shareFraction}</span>
                      </div>
                      <div className={styles.propertyDetailItem}>
                        <span className={styles.propertyDetailLabel}>Acquired:</span>
                        <span className={styles.propertyDetailValue}>
                          {new Date(userProperty.acquisitionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
              <div className={styles.propertyRightContent}>
                <div className={styles.propertyYearSelector}>
                  {prop.userProperties.map((up) => (
                    <Button
                      key={up.year}
                      variant={selectedYears[prop.propertyId] === up.year ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setSelectedYears(prev => ({ ...prev, [prop.propertyId]: up.year }))}
                      className={`${styles.propertyYearButton} ${selectedYears[prop.propertyId] === up.year ? styles.propertyYearButtonSelected : ''}`}
                    >
                      {up.year}
                    </Button>
                  ))}
                </div>
                <div className={styles.propertyAvailabilityContainer}>
                  <div className={styles.propertyAvailabilityInfo}>
                    {renderNightInfoBlock(userProperty, 'peak')}
                    {renderNightInfoBlock(userProperty, 'off')}
                    {renderNightInfoBlock(userProperty, 'lastMinute')}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PropertyTab;