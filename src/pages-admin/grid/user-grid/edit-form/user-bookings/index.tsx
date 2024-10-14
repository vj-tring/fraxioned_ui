import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings, BookingData } from "@/store/slice/auth/bookingSlice";
import { RootState } from "@/store/reducers";
import styles from "./userbookings.module.css";
import {
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  Home,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppDispatch } from "@/store";

interface BookingProps {
  userId: number;
}
interface Booking extends BookingData {
  id: string;
  bookingId: string;
  totalNights: number;
  noOfGuests: number;
  property: {
    id: string;
    propertyName: string;
  };
}

interface GroupedBookings {
  [key: string]: {
    propertyName: string;
    bookings: Booking[];
  };
}

const UserBookings: React.FC<BookingProps> = ({ userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userBookings, isLoading, error } = useSelector((state: RootState) => state.bookings);
  const [expandedProperties, setExpandedProperties] = React.useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchUserBookings(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (Array.isArray(userBookings) && userBookings.length > 0 && userBookings[0].property) {
      const firstPropertyId = userBookings[0].property.id;
      setExpandedProperties({ [firstPropertyId]: true });
    }
  }, [userBookings]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateTotalTransaction = (
    cleaning: number | null,
    pet: number | null
  ) => {
    return (cleaning || 0) + (pet || 0);
  };

  const groupBookingsByProperty = (bookings: Booking[]): GroupedBookings => {
    if (!Array.isArray(bookings)) {
      console.error("Expected bookings to be an array, but got:", bookings);
      return {};
    }
    return bookings.reduce((acc, booking) => {
      if (booking && booking.property) {
        const { property } = booking;
        if (!acc[property.id]) {
          acc[property.id] = {
            propertyName: property.propertyName,
            bookings: [],
          };
        }
        acc[property.id].bookings.push(booking);
      }
      return acc;
    }, {} as GroupedBookings);
  };

  const togglePropertyExpansion = (propertyId: string) => {
    setExpandedProperties((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  if (isLoading) return <div className={styles.message}>Loading bookings...</div>;
  if (error) return <div className={styles.message}>Error: {error}</div>;
  if (!userBookings || !Array.isArray(userBookings) || userBookings.length === 0)
    return <div className={styles.message}>No bookings available</div>;

  const bookings = userBookings as Booking[];
  const groupedBookings = groupBookingsByProperty(bookings);

  return (
    <div className={styles.pageContainer}>
      {Object.entries(groupedBookings).map(
        ([propertyId, { propertyName, bookings }]) => (
          <div key={propertyId} className={styles.propertyContainer}>
            <div
              className={styles.propertyHeader}
              onClick={() => togglePropertyExpansion(propertyId)}
            >
              <h2 className={styles.propertyTitle}>
                <Home className={styles.icon} size={20} />
                {propertyName}
              </h2>
              {expandedProperties[propertyId] ? (
                <ChevronUp className={styles.icon} size={20} />
              ) : (
                <ChevronDown className={styles.icon} size={20} />
              )}
            </div>
            {expandedProperties[propertyId] && (
              <div className={styles.bookingsContainer}>
                {bookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingTile}>
                    <div className={styles.bookingId}>
                      # {booking.bookingId}
                    </div>
                    <div className={styles.bookingDetails}>
                      <div className={styles.dateRange}>
                        <Calendar size={14} />
                        <span>
                          {formatDate(booking.checkinDate)} -{" "}
                          {formatDate(booking.checkoutDate)}
                        </span>
                      </div>
                      <div className={styles.guests}>
                        <Users size={14} />
                        <span>
                          {booking.noOfAdults || 0} Adults,{" "}
                          {booking.noOfChildren || 0} Children,{" "}
                          {booking.noOfPets} Pets
                        </span>
                      </div>
                    </div>
                    <div className={styles.bookingFees}>
                      <div className={styles.feeItem}>
                        <Sparkles size={14} />
                        <span>
                          Cleaning: ${booking.cleaningFee?.toFixed(2) || "N/A"}
                        </span>
                      </div>
                      <div className={styles.feeItem}>
                        <Sparkles size={14} />
                        <span>Pet: ${booking.petFee?.toFixed(2) || "N/A"}</span>
                      </div>
                      <div className={styles.totalItem}>
                        <DollarSign size={14} />
                        <span>
                          Total: $
                          {calculateTotalTransaction(
                            booking.cleaningFee,
                            booking.petFee
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default UserBookings;