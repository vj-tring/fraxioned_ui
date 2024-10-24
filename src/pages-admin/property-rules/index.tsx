import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyDetailsById } from "@/store/slice/auth/propertiesSlice";
import { getAllPropertyCodes } from "@/store/services"
import EditButton from "@/components/edit";
import styles from "./propertyrules.module.css";
import Loader from "@/components/loader";
import { Users, Clock, Calendar, DollarSign, PawPrint } from "lucide-react";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";

interface PropertyCode {
  propertyCodeType: string;
  propertyCode: string;
}

const PropertyRules: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [propertyCodes, setPropertyCodes] = useState<PropertyCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rulesData = useSelector(
    (state: RootState) => state.property.selectedPropertyDetails
  );
  const status = useSelector((state: RootState) => state.property.status);
  const reduxError = useSelector((state: RootState) => state.property.error);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          dispatch(fetchPropertyDetailsById(Number(id)));
        }
        const codesResponse = await getAllPropertyCodes();
        setPropertyCodes(codesResponse.data);
      } catch (err) {
        console.error("Error fetching property codes:", err);
        setError("Failed to fetch property codes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch]);

  const handleEdit = () => {
    navigate(`/admin/property/${id}/rules/edit`);
  };

  const formatTime = (hour: number): string => {
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:00 ${ampm}`;
  };

  if (status === "loading" || loading) return <Loader />;
  if (reduxError || error)
    return <div className={styles.error}>{reduxError || error}</div>;
  if (!rulesData)
    return <div className={styles.noData}>No rules data found.</div>;

  return (
    <div className={styles.fullContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Property Rules</h2>
          <EditButton onClick={handleEdit} />
        </div>
        <div className={styles.rulesContainer}>
          <div className={`${styles.ruleCard} ${styles.seasonCard}`}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>
                <Calendar size={14} color="white" />
                Season Dates
              </h3>
              <p>
                <Calendar size={16} color="orange" /> Peak Start:{" "}
                {rulesData.peakSeasonStartDate}
              </p>
              <p>
                <Calendar size={16} color="orange" /> Peak End:{" "}
                {rulesData.peakSeasonEndDate}
              </p>
            </div>
          </div>

          <div className={styles.ruleCard}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle1}>
                <Users size={14} />
                Guests & Pets
              </h3>
              <p>
                <Users size={16} /> Guests: {rulesData.noOfGuestsAllowed}
              </p>
              <p>
                <PawPrint size={16} /> Pets: {rulesData.noOfPetsAllowed}
              </p>
              <p>
                <DollarSign size={16} /> Pet Fee: ${rulesData.feePerPet}/pet
              </p>
            </div>
          </div>
          <div className={styles.ruleCard}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle1}>
                <Clock size={14} />
                Check-in/out
              </h3>
              <p>
                <Clock size={16} /> In: {formatTime(rulesData.checkInTime)}
              </p>
              <p>
                <Clock size={16} /> Out: {formatTime(rulesData.checkOutTime)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyRules;
