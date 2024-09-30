import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
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
  const [storedName, setStoredName] = useState("");
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const firstName = userData?.firstName || "";
    const lastName = userData?.lastName || "";
    setStoredName(`${firstName} ${lastName}`);
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onProfileMenuClick();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (callback: () => void) => {
    callback();
    handleClose();
  };
  return (
    <>
      <IconButton onClick={handleClick} size="small" sx={{
        ":hover": {
          bgcolor: "transparent",
        },
        ":active":{
            bgcolor: "transparent",
        }
        
      }} disableRipple>
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            color="textPrimary"
            className={`monsterrat p-2 ${styles["UserName"]}`}
            sx={{
              fontWeight: 600,
              color: "#00636D",
              textTransform: "uppercase",
            }}
          >
            {storedName}
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
        <MenuItem onClick={() => handleMenuItemClick(onProfileClick)}>
          <ListItemIcon>
            <AccountCircleOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        {!isAdmin && (
          <>
            <MenuItem
              // onClick={handleResetPasswordClick}

              style={{
                height: "2.4rem",
              }}
            >
              <ListItemIcon>
                <ConfirmationNumberOutlinedIcon
                  style={{
                    width: "80%",
                  }}
                />
              </ListItemIcon>
              <ListItemText>Tickets</ListItemText>
            </MenuItem>

            <MenuItem
              // onClick={handleResetPasswordClick}
              style={{
                height: "2.4rem",
              }}
            >
              <ListItemIcon>
                <MenuBookOutlinedIcon
                  style={{
                    width: "80%",
                  }}
                />
              </ListItemIcon>
              <ListItemText>GuideBooks</ListItemText>
            </MenuItem>
            <MenuItem
              // onClick={handleResetPasswordClick}
              style={{
                height: "2.4rem",
              }}
            >
              <ListItemIcon>
                <LiveHelpOutlinedIcon
                  style={{
                    width: "80%",
                  }}
                />
              </ListItemIcon>
              <ListItemText>Faq</ListItemText>
            </MenuItem>
            <MenuItem
              // onClick={handleResetPasswordClick}
              style={{
                height: "2.4rem",
              }}
            >
              <ListItemIcon>
                <ContactPageOutlinedIcon
                  style={{
                    width: "80%",
                  }}
                />
              </ListItemIcon>
              <ListItemText>Contact us</ListItemText>
            </MenuItem>
          </>
        )}
        {isAdmin && (
          <MenuItem
            onClick={() => handleMenuItemClick(onNewAccountClick)}
            style={{
              height: "2.4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListItemIcon>
              <PersonAddAlt1OutlinedIcon
                style={{
                  width: "80%",
                }}
              />
            </ListItemIcon>
            <ListItemText>Send Invite</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleMenuItemClick(onResetPasswordClick)}>
          <ListItemIcon>
            <LockResetOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Reset Password</ListItemText>
        </MenuItem>
        <hr className="opacity-15 my-1.5" />
        <MenuItem onClick={() => handleMenuItemClick(onLogoutClick)}>
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
