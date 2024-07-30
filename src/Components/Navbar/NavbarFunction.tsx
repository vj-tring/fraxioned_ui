import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { logout } from '../../Api/Logout'
import { logoutUser } from '../../Redux/slice/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../Redux/store/index';

function useNavbarHandler() {
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate()

  const handleOpenInviteModal = () => setShowInviteModal(true)
  const handleCloseInviteModal = () => setShowInviteModal(false)

  const handleShowLogoutModal = () => setShowLogoutModal(true)
  const handleCloseLogoutModal = () => setShowLogoutModal(false)

  const handleShowUserDetailsModal = () => setShowUserDetailsModal(true)
  const handleCloseUserDetailsModal = () => setShowUserDetailsModal(false)

  // const handleLogout = async () => {
  //   try {
  //     const response = await logout()

  //     if (response.status === 201) {
  //       console.log('User logged out successfully')
  //       handleCloseLogoutModal()
  //       localStorage.clear()
  //       navigate('/login')
  //     } else {
  //       console.error('Error logging out:', response.status)
  //     }
  //   } catch (error) {
  //     console.error('Error logging out:', error)
  //   }
  // }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // setSnackbarMessage('Logout failed. Please try again.');
      // setSnackbarOpen(true);
    } finally {
      // setShowLogoutConfirmation(false);
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
  }
}

export default useNavbarHandler
