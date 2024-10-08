import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import { RootState } from "@/store/reducers";
import { fetchUserDetails } from "@/store/slice/auth/userdetails";
import { fetchUserPropertyDetails } from "@/store/slice/auth/userproperties";
import styles from "./userproperty.module.css";
import { Building, Users, Calendar, Fingerprint } from "lucide-react";
import profile from "../../assets/images/profile.jpeg";

const PropertyUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { users, status: userStatus, error: userError } = useSelector((state: RootState) => state.userDetails);
  const { propertyDetails, loading: propertyLoading, error: propertyError } = useSelector((state: RootState) => state.userProperties);

  useEffect(() => {
    dispatch(fetchUserDetails());
    if (id) {
      dispatch(fetchUserPropertyDetails(Number(id)));
    }
  }, [dispatch, id]);

  if (userStatus === 'loading' || propertyLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (userStatus === 'failed' || propertyError) {
    return <div className={styles.error}>Error: {userError || propertyError}</div>;
  }

  if (!propertyDetails) {
    return <div className={styles.error}>Error: Property details not found.</div>;
  }

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, typeof users[0]>);

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
            const user = userMap[owner.userId];
            return (
              <div key={owner.userId} className={styles.userCard}>
                <div className={styles.userInfo1}>
                  <img src={profile} className={styles.usericon} alt="User profile" />
                  <span className={styles.userName}>
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : `User ${owner.userId}`}
                  </span>
                </div>
                <div className={styles.profileDetails}>
                  <div className={styles.userInfo}>
                    <Fingerprint size={15} className={styles.icon} />
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
                      Acquired: {new Date(owner.acquisitionDate).toLocaleDateString()}
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