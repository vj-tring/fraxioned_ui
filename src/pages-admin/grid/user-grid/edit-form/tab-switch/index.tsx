import React, { useState, useEffect } from "react";
import { Tabs, Tab, Button, IconButton } from "@mui/material";
import UserForm from "../userform";
import EditForm from "../useredit";
import PropertyTab from "../propertyUser";
import UserBookings from "../user-bookings";
import styles from "./tab.module.css";
import RefreshIcon from '@mui/icons-material/Refresh';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getUserById } from "@/api";

interface TabSwitchProps {
  onUserUpdated: () => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ onUserUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = parseInt(id || "0", 10);

  const getCurrentTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return parseInt(searchParams.get("tab") || "0", 10);
  };

  const [selectedTab, setSelectedTab] = useState(getCurrentTab());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId);
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }

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

  if (!userData) {
    return <div className={styles.loading}>Loading...</div>;
  }
    
   }, [userId]);

  const isOwner = userData.role.roleName === "Owner";

  return (
    <div className={styles.tabContainer}>
      <div className={styles.tabHeader}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="user edit tabs"
          className={styles.tabs}
        >
          <Tab label="General Details" />
          <Tab label="Property" disabled={!isOwner} />
          <Tab label="Booking" />
        </Tabs>
        <div className={styles.actionButtons}>
          <IconButton
            onClick={() => window.location.reload()}
            className={styles.refreshIcon}
            aria-label="refresh"
          >
            <RefreshIcon />
          </IconButton>
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
          <UserForm userId={userId} onEditClick={handleEditClick} header={""} editButtonName={""} showActiveStatus={false} />
        ) : (
          selectedTab === 0 &&
          isEditing && (
            <EditForm
              user={userData}
              onClose={() => setIsEditing(false)}
              onUserUpdated={handleUpdateSuccess} formTitle={""} />
          )
        )}

                {isOwner && selectedTab === 1 && (
                    <PropertyTab userId={userId} />
                )}

                {isOwner && selectedTab === 2 && (
                    <UserBookings userId={userId} />
                )}

      </div>
    </div>
  );
};

export default TabSwitch;