import React, { useState, useEffect } from "react";
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
import { User } from "@/store/model/user"; // Ensure you have the User interface defined in your types

interface UserFormProps {
  user: User;
  onEditClick: () => void;
  header?: string;
  editButtonName?: string;
  showActiveStatus?: boolean;
  customStyles?: {
    userForm?: string;
    header?: string;
    editButton?: string;
    content?: string;
    profileSection?: string;
    imageContainer?: string;
    profileImage?: string;
    role?: string;
    status?: string;
    activeStatus?: string;
    inactiveStatus?: string;
    detailsSection?: string;
    detailItem?: string;
    error?: string;
  };
}

const UserForm: React.FC<UserFormProps> = ({
  user,
  onEditClick,
  header = "User Details",
  editButtonName = "Edit Profile",
  customStyles = {},
  showActiveStatus = true,
}) => {
  const styles = {
    userForm: customStyles.userForm || defaultStyles.userForm,
    header: customStyles.header || defaultStyles.header,
    editButton: customStyles.editButton || defaultStyles.editButton,
    content: customStyles.content || defaultStyles.content,
    profileSection: customStyles.profileSection || defaultStyles.profileSection,
    imageContainer: customStyles.imageContainer || defaultStyles.imageContainer,
    profileImage: customStyles.profileImage || defaultStyles.profileImage,
    role: customStyles.role || defaultStyles.role,
    status: customStyles.status || defaultStyles.status,
    activeStatus: customStyles.activeStatus || defaultStyles.activeStatus,
    inactiveStatus: customStyles.inactiveStatus || defaultStyles.inactiveStatus,
    detailsSection: customStyles.detailsSection || defaultStyles.detailsSection,
    detailItem: customStyles.detailItem || defaultStyles.detailItem,
    error: customStyles.error || defaultStyles.error,
  };

  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }

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
          <h3>
            {user.firstName} {user.lastName}
          </h3>
          <p className={styles.role}>{user.role.roleName}</p>
          {showActiveStatus && (
            <p
              className={`${styles.status} ${
                user.isActive ? styles.activeStatus : styles.inactiveStatus
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </p>
          )}
        </div>
        <div className={styles.detailsSection}>
          <DetailItem
            icon={<Mail size={22} />}
            title="Primary Email "
            content={user.contactDetails.primaryEmail || "N/A"}
          />
          <DetailItem
            icon={<Mail size={22} />}
            title="Alternate Email"
            content={user.contactDetails.secondaryEmail || "N/A"}
          />
          <DetailItem
            icon={<Phone size={22} />}
            title="Primary Phone"
            content={user.contactDetails.primaryPhone || "N/A"}
          />
          <DetailItem
            icon={<Phone size={22} />}
            title="Alternate Phone"
            content={user.contactDetails.secondaryPhone || "N/A"}
          />
          <DetailItem
            icon={<MapPin size={22} />}
            title="Address"
            content={
              `${user.addressLine1 || "N/A"}${
                user.addressLine2 ? `, ${user.addressLine2}` : ""
              }` || "N/A"
            }
          />
          <DetailItem
            icon={<Building size={22} />}
            title="City"
            content={user.city || "N/A"}
          />
          <DetailItem
            icon={<MapPin size={22} />}
            title="State"
            content={user.state || "N/A"}
          />
          <DetailItem
            icon={<Flag size={22} />}
            title="Country"
            content={user.country || "N/A"}
          />
          <DetailItem
            icon={<Hash size={22} />}
            title="Zipcode"
            content={user.zipcode || "N/A"}
          />
          <DetailItem
            icon={<Clock size={22} />}
            title="Last Login"
            content={new Date(user.lastLoginTime).toLocaleString() || "N/A"}
          />
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: JSX.Element;
  title: string;
  content: string | null;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, title, content }) => (
  <div className={defaultStyles.detailItem}>
    {icon}
    <div>
      <strong>{title} :</strong>
      <p>{content || "N/A"}</p>
    </div>
  </div>
);

export default UserForm;
