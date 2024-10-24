import React, { useState, useEffect } from "react";
import styles from "./availablity.module.css";
import { getUserProperties } from "@/store/services";

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
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await getUserProperties(userId);
        setProperties(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user properties:", err);
        setError("Failed to fetch user properties. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, [userId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  const renderNightInfo = (label: string, value: number) => (
    <div className={styles.nightInfo}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      {properties.map((property) => (
        <div key={property.propertyName} className={styles.propertyCard}>
          <h2 className={styles.propertyName}>{property.propertyName}</h2>
          <div className={styles.yearSelector}>
            {property.userProperties.map((userProperty) => (
              <button
                key={userProperty.year}
                className={`${styles.yearButton} ${
                  selectedYear === userProperty.year ? styles.active : ""
                }`}
                onClick={() => setSelectedYear(userProperty.year)}
              >
                {userProperty.year}
              </button>
            ))}
          </div>
          {property.userProperties.map(
            (userProperty) =>
              userProperty.year === selectedYear && (
                <div key={userProperty.year} className={styles.propertyDetails}>
                  <div className={styles.seasonSection}>
                    <h3 className={styles.sectionTitle}>Peak Season</h3>
                    <div className={styles.nightsGrid}>
                      {renderNightInfo(
                        "Allotted Nights",
                        userProperty.peakAllottedNights
                      )}
                      {renderNightInfo(
                        "Used Nights",
                        userProperty.peakUsedNights
                      )}
                      {renderNightInfo(
                        "Booked Nights",
                        userProperty.peakBookedNights
                      )}
                      {renderNightInfo(
                        "Cancelled Nights",
                        userProperty.peakCancelledNights
                      )}
                      {renderNightInfo(
                        "Lost Nights",
                        userProperty.peakLostNights
                      )}
                      {renderNightInfo(
                        "Remaining Nights",
                        userProperty.peakRemainingNights
                      )}
                    </div>
                    <h4 className={styles.subSectionTitle}>Holiday Nights</h4>
                    <div className={styles.nightsGrid}>
                      {renderNightInfo(
                        "Allotted Nights",
                        userProperty.peakAllottedHolidayNights
                      )}
                      {renderNightInfo(
                        "Used Nights",
                        userProperty.peakUsedHolidayNights
                      )}
                      {renderNightInfo(
                        "Booked Nights",
                        userProperty.peakBookedHolidayNights
                      )}
                      {renderNightInfo(
                        "Remaining Nights",
                        userProperty.peakRemainingHolidayNights
                      )}
                    </div>
                  </div>
                  <div className={styles.seasonSection}>
                    <h3 className={styles.sectionTitle}>Off Season</h3>
                    <div className={styles.nightsGrid}>
                      {renderNightInfo(
                        "Allotted Nights",
                        userProperty.offAllottedNights
                      )}
                      {renderNightInfo(
                        "Used Nights",
                        userProperty.offUsedNights
                      )}
                      {renderNightInfo(
                        "Booked Nights",
                        userProperty.offBookedNights
                      )}
                      {renderNightInfo(
                        "Cancelled Nights",
                        userProperty.offCancelledNights
                      )}
                      {renderNightInfo(
                        "Lost Nights",
                        userProperty.offLostNights
                      )}
                      {renderNightInfo(
                        "Remaining  Nights",
                        userProperty.offRemainingNights
                      )}
                    </div>
                    <h4 className={styles.subSectionTitle}>Holiday Nights</h4>
                    <div className={styles.nightsGrid}>
                      {renderNightInfo(
                        "Allotted Nights",
                        userProperty.offAllottedHolidayNights
                      )}
                      {renderNightInfo(
                        "Used Nights",
                        userProperty.offUsedHolidayNights
                      )}
                      {renderNightInfo(
                        "Booked Nights",
                        userProperty.offBookedHolidayNights
                      )}
                      {renderNightInfo(
                        "Remaining Nights",
                        userProperty.offRemainingHolidayNights
                      )}
                    </div>
                  </div>
                  <div className={styles.seasonSection}>
                    <h3 className={styles.sectionTitle}>
                      Last Minute Bookings
                    </h3>
                    <div className={styles.nightsGrid}>
                      {renderNightInfo(
                        "AllottedNights",
                        userProperty.lastMinuteAllottedNights
                      )}
                      {renderNightInfo(
                        "Used Nights",
                        userProperty.lastMinuteUsedNights
                      )}
                      {renderNightInfo(
                        "Booked Nights",
                        userProperty.lastMinuteBookedNights
                      )}
                      {renderNightInfo(
                        "Remaining Nights",
                        userProperty.lastMinuteRemainingNights
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      ))}
    </div>
  );
};

export default Availability;
