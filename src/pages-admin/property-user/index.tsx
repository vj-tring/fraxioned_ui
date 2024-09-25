import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './userproperty.module.css';
import userImage from '../../assets/images/profile.jpeg';
import pic1 from '../../assets/images/photo1.jpeg';
import pic2 from '../../assets/images/photo2.jpeg';
import { getuserbyproperty, userdetails } from '@/api';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  imageURL: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  country: string | null;
  city: string | null;
  zipcode: string | null;
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
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: number;
  owners: PropertyUser[];
}

const PropertyUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [userDetails, setUserDetails] = useState<Record<number, User>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertyResponse, usersResponse] = await Promise.all([
          getuserbyproperty(Number(id)),
          userdetails()
        ]);

        setPropertyDetails(propertyResponse.data);

        const userMap: Record<number, User> = {};
        usersResponse.data.users.forEach((user: User) => {
          userMap[user.id] = user;
        });
        setUserDetails(userMap);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    return <div className={styles.error}>Error: Property details not found.</div>;
  }

  return (
    <div className={styles.propertyUsersContainer}>
      <h2 className={styles.title}>{propertyDetails.propertyName} - Users</h2>
      {propertyDetails.owners.length === 0 ? (
        <div className={styles.noUsers}>No Users available for this property.</div>
      ) : (
        <div className={styles.userCardContainer}>
          {propertyDetails.owners.map((owner) => {
            const user = userDetails[owner.userId];
            return (
              <div key={owner.userId} className={styles.userCard}>
                <div className={styles.userImageContainer}>
                  <img
                    src={user?.imageURL || userImage}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    className={styles.userImage}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h3 className={styles.userName}>
                    {user ? `${user.firstName} ${user.lastName}` : `User ${owner.userId}`}
                  </h3>
                  <p className={styles.userId}>ID: {owner.userId}</p>
                  <p className={styles.userShares}>
                    Shares: {owner.noOfShare}/{propertyDetails.propertyShare}
                  </p>
                  <p className={styles.userAcquisitionDate}>
                    Acquisition Date: {new Date(owner.acquisitionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PropertyUsers;