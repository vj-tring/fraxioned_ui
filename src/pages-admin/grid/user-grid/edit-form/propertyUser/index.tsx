import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography } from "@mui/material";
import { getUserProperties } from "@/api/api-endpoints";
import styles from "./propertyTab.module.css";
import { Image as ImageIcon } from "lucide-react";
import imageone from '../../../../../assests/bear-lake-bluffs.jpg';
import imagetwo from '../../../../../assests/crown-jewel.jpg';
import imagethree from '../../../../../assests/lake-escape.jpg';
import { UserProperty, PropertyResponse, EnhancedPropertyTabProps } from '../../user.types';

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
      let value: number;
      switch (season) {
        case 'peak':
          value = userProperty[`peak${type}Nights` as keyof UserProperty] as number;
          break;
        case 'off':
          value = userProperty[`off${type}Nights` as keyof UserProperty] as number;
          break;
        case 'lastMinute':
          value = userProperty[`lastMinute${type}Nights` as keyof UserProperty] as number;
          break;
        default:
          value = 0;
      }
      return value !== null && value !== undefined ? value : 0;
    };

    const renderNightInfoRow = (label: string, usedType: string, totalType: string) => {
      const used = getNightInfo(usedType);
      const total = getNightInfo(totalType);
      return (
        <div className={styles.nightInfoRow}>
          <span className={styles.nightInfoLabel}>{label}:</span>
          <span className={styles.nightInfoValue}>{used}/{total}</span>
        </div>
      );
    };



    return (
      <div className={`${styles.nightInfoBlock} ${styles[`${season}Block`]}`}>
        <Typography variant="subtitle2" className={styles.seasonTitle}>
          {season === 'lastMinute' ? 'Last Minute' : `${season.charAt(0).toUpperCase() + season.slice(1)} Season`}
        </Typography>
        <div className={styles.nightInfoContent}>
          <div className={styles.nightInfoColumn}>
            <Typography variant="caption" className={styles.nightInfoSubtitle}>Regular Nights</Typography>
            {renderNightInfoRow('Used', 'Used', 'Allotted')}
            {renderNightInfoRow('Booked', 'Booked', 'Allotted')}
            {renderNightInfoRow('Remaining', 'Remaining', 'Allotted')}
          </div>
          {season !== 'lastMinute' && (
            <div className={styles.nightInfoColumn}>
              <Typography variant="caption" className={styles.nightInfoSubtitle}>Holiday Nights</Typography>
              {renderNightInfoRow('Used', 'UsedHoliday', 'AllottedHoliday')}
              {renderNightInfoRow('Booked', 'BookedHoliday', 'AllottedHoliday')}
              {renderNightInfoRow('Remaining', 'RemainingHoliday', 'AllottedHoliday')}
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