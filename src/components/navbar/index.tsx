import { useState } from "react";
import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarLinks from "../navbar-links";
import ProfileMenu from "../profile-menu";
import UserProfileModal from "../user-profile-modal";
import useNavbarHandler from "@/utils/navbar-handler";
import InviteModal from "../send-invite-modal";
import ConfirmationModal from "../confirmation-modal";
import ResetPasswordModal from "../reset-password-modal";
import FormDialog from "../register-form-modal";
import styles from "./navbar.module.css";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";

interface CustomNavbarProps {
  logo?: string;
  links?: {
    disabled: boolean | undefined;
    name: string;
    href: string;
    onClick?: () => void;
  }[];
  userImage?: string;
  userName: string;
  onUserImageClick?: () => void;
}

const CustomNavbar = ({
  logo,
  links = [],
  userImage,
  userName,
}: CustomNavbarProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);
  const {
    showInviteModal,
    showLogoutModal,
    handleShowLogoutModal,
    handleCloseLogoutModal,
    handleLogout,
    showResetPasswordModal,
    handleCloseResetPasswordModal,
    handleOpenResetPasswordModal,
  } = useNavbarHandler();
  const [showUserForm, setShowUserForm] = useState(false);
  const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false);

  const handleOpenNewAccountModal = () => {
    setOpenNewAccountDialog(true);
  };

  const handleCloseNewAccountModal = () => {
    setOpenNewAccountDialog(false);
  };

  const handleProfileClick = () => {
    setShowUserForm(true);
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className={`p-2 ${styles.navbar}`}>
        {!isAdmin && (
          <Navbar.Brand>
            <Link to="/">
              <img src={logo} height="40" width="160" alt="Logo" />
            </Link>
          </Navbar.Brand>
        )}
        <Navbar.Toggle />
        <Navbar.Collapse>
          <NavbarLinks links={links} />
          <ProfileMenu
            userImage={userImage}
            userName={userName}
            onProfileClick={handleProfileClick}
            onResetPasswordClick={handleOpenResetPasswordModal}
            onLogoutClick={handleShowLogoutModal}
            onNewAccountClick={handleOpenNewAccountModal}
          />
        </Navbar.Collapse>
      </Navbar>

      {user && (
        <UserProfileModal
          userData={user}
          showUserForm={showUserForm}
          handleClose={handleCloseUserForm}
          isAdmin={isAdmin}
        />
      )}
      <InviteModal show={showInviteModal} onHide={handleCloseLogoutModal} />
      <ConfirmationModal
        show={showLogoutModal}
        onHide={handleCloseLogoutModal}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
      />
      <FormDialog
        open={openNewAccountDialog}
        handleClose={handleCloseNewAccountModal}
      />
      <ResetPasswordModal
        show={showResetPasswordModal}
        onHide={handleCloseResetPasswordModal}
      />
    </>
  );
};

export default CustomNavbar;
