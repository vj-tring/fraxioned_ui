import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import InviteModal from '../send-invite-modal';
import ConfirmationModal from '../confirmation-modal';
import ResetPasswordModal from '../reset-password-modal';
import { NavLink } from 'react-router-dom';
import useNavbarHandler from './navbar-handler';
import Typography from '@mui/material/Typography';
import './navbar.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/reducers';
import { useLocation } from 'react-router-dom';
import FormDialog from '../register-form-modal';
import { ListItemText } from '@mui/material';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';



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

const CustomNavbar: React.FC<CustomNavbarProps> = ({
  logo,
  links = [],
  userImage,
  userName,
  // onUserImageClick,
}) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin');

  const {
    showInviteModal,
    showLogoutModal,
    handleOpenResetPasswordModal,
    handleCloseInviteModal,
    handleCloseLogoutModal,
    handleShowLogoutModal,
    handleLogout,
    showResetPasswordModal,
    handleCloseResetPasswordModal,
  } = useNavbarHandler();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false);
  const [storedName, setStoredName] = useState('');
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    setStoredName(`${firstName} ${lastName}`);
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleProfileClick = () => {
  //   onUserImageClick?.();
  //   handleClose();
  // };

  const handleResetPasswordClick = () => {
    handleOpenResetPasswordModal();
    handleClose();
  };

  const handleAddAccountClick = () => {
    handleOpenNewAccountModal();
    handleClose();
  };

  const handleLogoutClick = () => {
    handleShowLogoutModal();
    handleClose();
  };

  const handleOpenNewAccountModal = () => {
    setOpenNewAccountDialog(true);
  };

  const handleCloseNewAccountModal = () => {
    setOpenNewAccountDialog(false);
  };


  return (
    <>
      <Navbar bg="light" expand="lg" className="p-2" style={{ height: '4.3rem' }}>
        {!isAdminDashboard && (
          <Navbar.Brand href="#home" className="p-2">
            <img
              src={logo}
              height="40"
              width="160"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {links.map((link, index) => (
              <NavLink
                key={index}
                to={link.href}
                onClick={(e) => {
                  if (link.disabled) {
                    e.preventDefault();
                  }
                }}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
                aria-disabled={link.disabled ? 'true' : 'false'}
              >
                {link.name}
              </NavLink>
            ))}
          </Nav>
        </Navbar.Collapse>

        <Nav className="ml-auto">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>

            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              disableRipple
            >
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  borderRadius: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" color="textPrimary" className="monsterrat p-2" sx={{
                    fontWeight: 600,
                    color: '#00636D',
                    textTransform: 'uppercase'
                  }}>
                    {storedName}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    marginLeft: 1,
                  }}
                >
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="User"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : userName ? (
                    userName.charAt(0).toUpperCase()
                  ) : (
                    'M'
                  )}
                </Avatar>
              </Box>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                width: '230px',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 2.4,
                padding: '.5rem 0',
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
          >
            {/* <MenuItem onClick={handleProfileClick}>
              <Avatar /> Profile
            </MenuItem> */}
            <MenuItem onClick={handleResetPasswordClick} style={{
              height: '2.4rem'
            }} >
              <ListItemIcon>
                <LockResetOutlinedIcon style={{
                  width: '80%',
                }} />
              </ListItemIcon>
              <ListItemText>Reset</ListItemText>
            </MenuItem>
            {isAdmin && (
              <MenuItem onClick={handleAddAccountClick} style={{
                height: '2.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ListItemIcon>
                  <PersonAddAlt1OutlinedIcon style={{
                    width: '80%'
                  }} />
                </ListItemIcon>
                <ListItemText>Send Invite</ListItemText>
                {/* <ListItemIcon>
                  <PersonAddIcon fontSize="medium" />
                </ListItemIcon>
                Add another account */}
              </MenuItem>
            )}
            <hr style={{
              margin: '.3rem 0',
              opacity: .12
            }} />
            <MenuItem onClick={handleLogoutClick} style={{
              height: '2.4rem'
            }} >
              <ListItemIcon >
                <LogoutOutlinedIcon style={{
                  width: '80%'
                }} />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>

          </Menu>
        </Nav>
      </Navbar>

      <InviteModal show={showInviteModal} onHide={handleCloseInviteModal} />
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
