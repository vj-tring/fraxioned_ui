import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./userproperty.module.css";
import { getuserbyproperty, userdetails } from "@/api";
import { User, Building, Users, Calendar, Fingerprint } from "lucide-react";
import profile from "../../assets/images/profile.jpeg";
// import { Fingerprint } from "@mui/icons-material";
interface User {
  id: number;
  firstName: string;
  lastName: string;
}

interface PropertyUser {
  userId: number;
  noOfShare: number;
  acquisitionDate: string;
}

interface PropertyDetails {
  propertyId: number;
  propertyName: string;
  propertyShare: number;
  owners: PropertyUser[];
}

const PropertyUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyDetails, setPropertyDetails] =
    useState<PropertyDetails | null>(null);
  const [userDetails, setUserDetails] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse, usersResponse] = await Promise.all([
          getuserbyproperty(Number(id)),
          userdetails(),
        ]);

        setPropertyDetails(propertyResponse.data);

        const userMap: Record<number, User> = {};
        usersResponse.data.users.forEach((user: User) => {
          userMap[user.id] = user;
        });
        setUserDetails(userMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!propertyDetails) {
    return (
      <div className={styles.error}>Error: Property details not found.</div>
    );
  }

  return (
    <div className={styles.propertyUsersContainer}>
      <h2 className={styles.title}>
        <Building size={20} className={styles.titleIcon} />
        {propertyDetails.propertyName} - Users
      </h2>
      <div className={styles.cardContainer}>
        {propertyDetails.owners.length === 0 ? (
          <div className={styles.noUsers}>
            No Users available for this property.
          </div>
        ) : (
          propertyDetails.owners.map((owner) => {
            const user = userDetails[owner.userId];
            return (
              <div key={owner.userId} className={styles.userCard}>
                <div className={styles.userInfo1}>
                  {/* <User size={10}  /> */}
                  <img src={profile} className={styles.usericon}></img>
                  <span className={styles.userName}>
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : `User ${owner.userId}`}
                  </span>
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.userInfo}>
                    <Fingerprint size={15} className={styles.icon} />
                    {/* <Hash size={15} className={styles.icon} /> */}
                    <span className={styles.userId}>ID: {owner.userId}</span>
                  </div>
                  <div className={styles.userInfo}>
                    <Users size={15} className={styles.icon} />
                    <span className={styles.userShares}>
                      Shares: {owner.noOfShare}/{propertyDetails.propertyShare}
                    </span>
                  </div>
                  <div className={styles.userInfo}>
                    <Calendar size={15} className={styles.icon} />
                    <span className={styles.userAcquisitionDate}>
                      Acquired:{" "}
                      {new Date(owner.acquisitionDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PropertyUsers;
