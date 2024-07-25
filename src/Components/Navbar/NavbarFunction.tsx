import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../Api/Logout";



function useNavbarHandler() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  const navigate = useNavigate();



  const handleOpenInviteModal = () => setShowInviteModal(true);
  const handleCloseInviteModal = () => setShowInviteModal(false);

  const handleShowLogoutModal = () => setShowLogoutModal(true);
  const handleCloseLogoutModal = () => setShowLogoutModal(false);

  const handleShowUserDetailsModal = () => setShowUserDetailsModal(true);
  const handleCloseUserDetailsModal = () => setShowUserDetailsModal(false);

  const handleLogout = async () => {
    try {
      const response = await logout();
      
      if (response.status === 201) {
        console.log('User logged out successfully');
        handleCloseLogoutModal();
        localStorage.clear();
        navigate('/login');
      } else {
        console.error('Error logging out:', response.status);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    showInviteModal,
    showLogoutModal,
    showUserDetailsModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleShowLogoutModal,
    handleCloseLogoutModal,
    handleShowUserDetailsModal,
    handleCloseUserDetailsModal,

    handleLogout,
  };
}

export default useNavbarHandler;

