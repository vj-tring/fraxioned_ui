import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { logout } from '../../Api/Logout'

function useNavbarHandler() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const navigate = useNavigate();

  const handleOpenInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleShowUserDetailsModal = () => setShowUserDetailsModal(true);
  const handleCloseUserDetailsModal = () => setShowUserDetailsModal(false);

  const handleOpenResetPasswordModal = () => setShowResetPasswordModal(true);
  const handleCloseResetPasswordModal = () => setShowResetPasswordModal(false);

  const handleLogout = async () => {
    handleCloseLogoutModal();

    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    localStorage.clear();

    if (rememberedEmail) {
      localStorage.setItem("rememberedEmail", rememberedEmail);
    }
    if (rememberedPassword) {
      localStorage.setItem("rememberedPassword", rememberedPassword);
    }

    navigate("/login");
  };

  return {
    showInviteModal,
    showLogoutModal,
    showUserDetailsModal,
    showResetPasswordModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleShowLogoutModal,
    handleCloseLogoutModal,
    handleShowUserDetailsModal,
    handleCloseUserDetailsModal,
    handleOpenResetPasswordModal,
    handleCloseResetPasswordModal,
    handleLogout,
  };
}

export default useNavbarHandler;
