import React from "react";
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  PersonAddAlt1Outlined,
  LogoutOutlined,
  AccountCircleOutlined,
  LockResetOutlined,
  ConfirmationNumberOutlined,
  MenuBookOutlined,
  LiveHelpOutlined,
  ContactPageOutlined,
} from "@mui/icons-material";

const MenuOptions = ({
  isAdmin,
  handleMenuItemClick,
  onProfileClick,
  onNewAccountClick,
  onResetPasswordClick,
  onLogoutClick,
}: {
  isAdmin: boolean;
  handleMenuItemClick: (callback: () => void) => void;
  onProfileClick: () => void;
  onNewAccountClick: () => void;
  onResetPasswordClick: () => void;
  onLogoutClick: () => void;
}) => (
  <div>
    <MenuItem onClick={() => handleMenuItemClick(onProfileClick)}>
      <ListItemIcon>
        <AccountCircleOutlined />
      </ListItemIcon>
      <ListItemText>Profile</ListItemText>
    </MenuItem>

    {!isAdmin && (
      <div>
        <CustomMenuItem icon={ConfirmationNumberOutlined} label="Tickets" />
        <CustomMenuItem icon={MenuBookOutlined} label="GuideBooks" />
        <CustomMenuItem icon={LiveHelpOutlined} label="FAQ" />
        <CustomMenuItem icon={ContactPageOutlined} label="Contact Us" />
      </div>
    )}

    {isAdmin && (
      <MenuItem onClick={() => handleMenuItemClick(onNewAccountClick)}>
        <ListItemIcon>
          <PersonAddAlt1Outlined />
        </ListItemIcon>
        <ListItemText>Send Invite</ListItemText>
      </MenuItem>
    )}

    <MenuItem onClick={() => handleMenuItemClick(onResetPasswordClick)}>
      <ListItemIcon>
        <LockResetOutlined />
      </ListItemIcon>
      <ListItemText>Reset Password</ListItemText>
    </MenuItem>

    <hr className="opacity-15 my-1.5" />

    <MenuItem onClick={() => handleMenuItemClick(onLogoutClick)}>
      <ListItemIcon>
        <LogoutOutlined />
      </ListItemIcon>
      <ListItemText>Logout</ListItemText>
    </MenuItem>
  </div>
);

const CustomMenuItem = ({
  icon: IconComponent,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) => (
  <MenuItem>
    <ListItemIcon>
      <IconComponent />
    </ListItemIcon>
    <ListItemText>{label}</ListItemText>
  </MenuItem>
);
export default MenuOptions;
