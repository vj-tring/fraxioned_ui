import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { fetchUserById } from "@/store/slice/user-slice";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Flag,
  Hash,
  Clock,
} from "lucide-react";
import defaultProfile from "../../../../../assets/images/profile.jpeg";
import defaultStyles from "./userform.module.css";
import { AppDispatch } from "@/store";
import { UserFormProp } from "../../user.types";

const UserForm: React.FC<UserFormProp> = ({
  userId,
  onEditClick,
  header = "User Details",
  editButtonName = "Edit Profile",
  customStyles = {},
  showActiveStatus = true
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  const styles = {
    userForm: customStyles.userForm || defaultStyles.userForm,
    header: customStyles.header || defaultStyles.header,
    editButton: customStyles.editButton || defaultStyles.editButton,
    content: customStyles.content || defaultStyles.content,
    profileSection: customStyles.profileSection || defaultStyles.profileSection,
    imageContainer: customStyles.imageContainer || defaultStyles.imageContainer,
    userName: customStyles.userName || defaultStyles.userName,
    profileImage: customStyles.profileImage || defaultStyles.profileImage,
    role: customStyles.role || defaultStyles.role,
    status: customStyles.status || defaultStyles.status,
    activeStatus: customStyles.activeStatus || defaultStyles.activeStatus,
    inactiveStatus: customStyles.inactiveStatus || defaultStyles.inactiveStatus,
    detailsSection: customStyles.detailsSection || defaultStyles.detailsSection,
    detailItem: customStyles.detailItem || defaultStyles.detailItem,
    error: customStyles.error || defaultStyles.error,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!user) return <div className={styles.error}>User not found</div>;

  return (
    <div className={styles.userForm}>
      <div className={styles.header}>
        <h2>{header}</h2>
        <button className={styles.editButton} onClick={onEditClick}>
          <Edit size={16} />
          {editButtonName}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.profileSection}>
          <div className={styles.imageContainer}>
            <img
              src={user.imageURL || defaultProfile}
              alt={`${user.firstName} ${user.lastName}`}
              className={styles.profileImage}
            />
          </div>
          <h3 className={styles.userName}>
            {user.firstName} {user.lastName}
          </h3>
          <p className={styles.role}>{user.role.roleName}</p>
          {showActiveStatus && (
            <p
              className={`${styles.status} ${user.isActive ? styles.activeStatus : styles.inactiveStatus
                }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </p>
          )}
        </div>
        <div className={styles.detailsSection}>
          <div className={styles.detailItem}>
            <Mail size={20} />
            <div>
              <strong>Primary Email</strong>
              <p>{user.contactDetails.primaryEmail}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Mail size={20} />
            <div>
              <strong>Alternate Email</strong>
              <p>{user.contactDetails.secondaryEmail || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Phone size={20} />
            <div>
              <strong>Primary Phone</strong>
              <p>{user.contactDetails.primaryPhone}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Phone size={20} />
            <div>
              <strong>Alternate Phone</strong>
              <p>{user.contactDetails.secondaryPhone || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <MapPin size={20} />
            <div>
              <strong>Address</strong>
              <p>
                {user.addressLine1}
                {user.addressLine2 ? `, ${user.addressLine2}` : ""}
              </p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Building size={20} />
            <div>
              <strong>City</strong>
              <p>{user.city || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <MapPin size={20} />
            <div>
              <strong>State</strong>
              <p>{user.state || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Flag size={20} />
            <div>
              <strong>Country</strong>
              <p>{user.country || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Hash size={20} />
            <div>
              <strong>Zipcode</strong>
              <p>{user.zipcode || "N/A"}</p>
            </div>
          </div>
          <div className={styles.detailItem}>
            <Clock size={20} />
            <div>
              <strong>Last Login</strong>
              <p>{new Date(user.lastLoginTime).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;