import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  Typography,
} from "@mui/material";
import MenuOptions from "./menu-options";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";
import styles from "./profile.module.css";

interface ProfileMenuProps {
  userImage?: string;
  userName: string;
  onLogoutClick: () => void;
  onResetPasswordClick: () => void;
  onProfileClick: () => void;
  onProfileMenuClick: () => void;
  onNewAccountClick: () => void;
}


const ProfileMenu: React.FC<ProfileMenuProps> = ({
  userImage,
  userName,
  onLogoutClick,
  onResetPasswordClick,
  onProfileClick,
  onProfileMenuClick,
  onNewAccountClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [storedName, setStoredName] = useState<string>("");
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      const { firstName, lastName } = JSON.parse(userDataString);
      setStoredName(`${firstName || ""} ${lastName || ""}`);
    }
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onProfileMenuClick();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleMenuItemClick = useCallback(
    (callback: () => void) => {
      callback();
      handleClose();
    },
    []
  );

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          ":hover": { bgcolor: "transparent" },
          ":active": { bgcolor: "transparent" },
        }}
        disableRipple
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#00636D",
              textTransform: "uppercase",
              padding: "0.5rem",
            }}
            className={`monsterrat ${styles.UserName}`}
          >
            {storedName || userName}
          </Typography>
          <Avatar sx={{ width: 32, height: 32 }}>
            {userImage ? (
              <img
                src={userImage}
                alt="User"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              userName?.charAt(0).toUpperCase()
            )}
          </Avatar>
        </Box>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              width: "230px",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 2.4,
              padding: ".5rem 0",
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
      >
        <MenuOptions
          isAdmin={isAdmin}
          handleMenuItemClick={handleMenuItemClick}
          onProfileClick={onProfileClick}
          onNewAccountClick={onNewAccountClick}
          onResetPasswordClick={onResetPasswordClick}
          onLogoutClick={onLogoutClick}
        />
      </Menu>
    </>
  );
};

export default React.memo(ProfileMenu);
