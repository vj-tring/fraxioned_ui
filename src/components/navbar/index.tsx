import { useEffect, useState } from "react";
import { Navbar } from "react-bootstrap";
import NavbarLinks from "../navbar-links";
import ProfileMenu from "../profile-menu";
import UserProfileModal from "../user-profile-modal";
import useNavbarHandler from "@/utils/navbar-handler";
import InviteModal from "../send-invite-modal";
import ConfirmationModal from "../confirmation-modal";
import ResetPasswordModal from "../reset-password-modal";
import FormDialog from "../register-form-modal";
import styles from "./navbar.module.css";
import { getUserById } from "@/api";

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
  const [userData, setUserData] = useState<any>(null);
  const [userFormData, setUserFormData] = useState<any>(null);
  const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false);

  const handleOpenNewAccountModal = () => {
    setOpenNewAccountDialog(true);
  };

  const handleCloseNewAccountModal = () => {
    setOpenNewAccountDialog(false);
  };
  useEffect(() => {
    const userDataString = localStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    setUserData(userData);
  }, []);

  const fetchUserData = async (userId: number) => {
    try {
      const response = await getUserById(userId);
      console.log("user Response", response.data.user);
      setUserFormData(response.data.user);
      console.log("userFormData", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleProfileClick = () => {
    setShowUserForm(true);
  };
  const handleProfileMenuClick = () => {
    const userId = userData?.id || 0;
    if (userId) {
      fetchUserData(userId);
    }
  };

  const handleCloseUserForm = () => {
    setShowUserForm(false);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className={`p-2 ${styles.navbar}`}>
        <Navbar.Brand href="/">
          <img src={logo} height="40" width="160" alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse >
          <NavbarLinks links={links} />
          <ProfileMenu
            userImage={userImage}
            userName={userName}
            onProfileMenuClick={handleProfileMenuClick}
            onProfileClick={handleProfileClick}
            onResetPasswordClick={handleOpenResetPasswordModal}
            onLogoutClick={handleShowLogoutModal}
            onNewAccountClick={handleOpenNewAccountModal}
          />
        </Navbar.Collapse>
      </Navbar>

      <UserProfileModal
        userData={userFormData}
        showUserForm={showUserForm}
        handleClose={handleCloseUserForm}
      />
      <InviteModal show={showInviteModal} onHide={handleCloseLogoutModal} />
      <ConfirmationModal
        show={showLogoutModal}
        onHide={handleCloseLogoutModal}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        children={undefined}
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
