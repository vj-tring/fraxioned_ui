import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './userproperty.module.css';
import userImage from '../../assets/images/profile.jpeg';
import { getuserbyproperty, getUserProperties } from '@/api';

interface PropertyUser {
  userId: number;
  firstName: string;
  lastName: string;
  imageURL: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
}

interface PropertyDetails {
  propertyId: number;
  propertyName: string;
  propertyShare: number;
  users: PropertyUser[];
}

interface UserPropertyDetails {
  noOfShare: number;
  acquisitionDate: string;
  year: number;
}

const PropertyUsers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(null);
  const [userProperties, setUserProperties] = useState<{ [key: number]: UserPropertyDetails }>({});

  useEffect(() => {
    const fetchPropertyUsers = async () => {
      try {
        const response = await getuserbyproperty(Number(id));
        setPropertyDetails(response.data);
      } catch (error) {
        console.error('Error fetching property users:', error);
      }
    };

    const fetchUserProperties = async () => {
      try {
        const response = await getUserProperties(Number(id));
        const currentYear = new Date().getFullYear();
        const userPropertiesMap: { [key: number]: UserPropertyDetails } = {};

        response.data[0].userProperties.forEach((userProperty: any) => {
          if (userProperty.year === currentYear) {
            userPropertiesMap[userProperty.user.id] = {
              noOfShare: userProperty.noOfShare,
              acquisitionDate: userProperty.acquisitionDate,
              year: userProperty.year,
            };
          }
        });

        setUserProperties(userPropertiesMap);
      } catch (error) {
        console.error('Error fetching user properties:', error);
      }
    };

    fetchPropertyUsers();
    fetchUserProperties();
  }, [id]);

  if (!propertyDetails) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.propertyUsersContainer}>
      <h2 className={styles.title}>{propertyDetails.propertyName} - Users</h2>
      <div className={styles.userCardContainer}>
        {propertyDetails.users.map((user) => {
          const userProperty = userProperties[user.userId];
          return (
            <div key={user.userId} className={styles.userCard}>
              <div className={styles.userImageContainer}>
                <img src={userImage} alt={`${user.firstName} ${user.lastName}`} className={styles.userImage} />
              </div>
              <div className={styles.userInfo}>
                <h3 className={styles.userName}>{`${user.firstName} ${user.lastName}`}</h3>
                <p className={styles.userId}>ID: {user.userId}</p>
                {userProperty && (
                  <>
                    <p className={styles.userShares}>
                      Shares: {userProperty.noOfShare}/{propertyDetails.propertyShare}
                    </p>
                    <p className={styles.userAcquisitionDate}>
                      Acquisition Date: {new Date(userProperty.acquisitionDate).toLocaleDateString()}
                    </p>
                  </>
                )}
                {user.addressLine1 && (
                  <address className={styles.userAddress}>
                    {user.addressLine1}
                    {user.addressLine2 && <>, {user.addressLine2}</>}
                    {user.city && <>, {user.city}</>}
                    {user.state && <>, {user.state}</>} {user.zipcode}
                    {user.country && <>, {user.country}</>}
                  </address>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyUsers;