import React, { useState, useEffect } from "react";
import { Tabs, Tab, Button } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "@/store/slice/user-slice";
import { RootState } from "@/store/reducers";
import UserForm from "../user-form";
import EditForm from "../user-edit";
import PropertyTab from "../propertyUser";
import UserBookings from "../user-bookings";
import DocumentManagerCard from "../document";
import styles from "./tab.module.css";
import { AppDispatch } from "@/store";

interface TabSwitchProps {
  onUserUpdated: () => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ onUserUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const userId = parseInt(id || "0", 10);

  const { user, loading, error } = useSelector((state: RootState) => state.user);

  const getCurrentTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return parseInt(searchParams.get("tab") || "0", 10);
  };

  const [selectedTab, setSelectedTab] = useState(getCurrentTab());

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", selectedTab.toString());
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  }, [selectedTab, navigate, location.pathname]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    onUserUpdated();
  };

  const handleBackClick = () => {
    navigate("/admin/user");
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.error}>User not found</div>;
  }

  const isOwner = user.role.roleName === "Owner";

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="user edit tabs"
          className={styles.tabs}
        >
          <Tab disableRipple label="General Details" />
          <Tab disableRipple label="Property" />
          <Tab disableRipple label="Booking" />
          <Tab disableRipple label="Document" />
        </Tabs>
        <div className={styles.actionButtons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackClick}
            className={styles.backButton}
          >
            Back
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {selectedTab === 0 && !isEditing ? (
          <UserForm
            user={user}
            onEditClick={handleEditClick}
            header={""}
            editButtonName={""}
            showActiveStatus={false}
          />
        ) : (
          selectedTab === 0 &&
          isEditing && (
            <EditForm
              user={user}
              onClose={() => setIsEditing(false)}
              onUserUpdated={handleUpdateSuccess}
              formTitle={""}
              isAdmin={true}
            />
          )
        )}

        {isOwner && selectedTab === 1 && <PropertyTab userId={userId} />}

        {isOwner && selectedTab === 2 && <UserBookings userId={userId} />}

        {isOwner && selectedTab === 3 && <DocumentManagerCard userId={userId} />}
      </div>
    </div>
  );
};

export default TabSwitch;
