import React, { useState, useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LogoutIcon from '@mui/icons-material/Logout'
import InviteModal from './SentInviteModal'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import ResetPasswordModal from './ResetPasswordModal'
import '../Navbar/Navbar.css'
import FormDialog from './RegisterFormModal'

import useNavbarHandler from './NavbarFunction'
import { Typography } from '@mui/material'

interface CustomNavbarProps {
  logo: string
  links: {
    disabled: boolean | undefined
    name: string
    href: string
    onClick?: () => void
  }[]
  userImage?: string
  userName: string
  onUserImageClick?: () => void
}


const CustomNavbar: React.FC<CustomNavbarProps> = ({
  logo,
  links,
  userImage,
  userName,
  onUserImageClick,
}) => {
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
    

  } = useNavbarHandler()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false)
  const [storedName, setStoredName] = useState('');


  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const firstName = userData?.firstName || '';
    const lastName = userData?.lastName || '';
    setStoredName(`${firstName} ${lastName}`);
  }, []);

  
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleOpenNewAccountModal = () => {
    setOpenNewAccountDialog(true)
  }

  const handleCloseNewAccountModal = () => {
    setOpenNewAccountDialog(false)
  }
 
  return (
    <>
      <Navbar bg="light" expand="lg" className="p-2">
        <Navbar.Brand href="#home" className="p-2">
          <img
            src={logo}
            height="40"
            width="160"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {links.map((link, index) => (
              <Nav.Link
                key={index}
                href={link.href}
                onClick={link.onClick}
                className="nav-link-with-margin"
                disabled={link.disabled}
              >
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>

        <Nav className="ml-auto">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip  title="Account settings">
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
                    <Typography variant="body2" color="textPrimary">
                      {storedName}
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary">
                      {email}
                    </Typography> */}
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
            </Tooltip>
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
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
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
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
          >
            <MenuItem onClick={onUserImageClick}>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem onClick={handleOpenResetPasswordModal}>
              <Avatar /> Reset 
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleOpenNewAccountModal}>
              <ListItemIcon>
                <PersonAddIcon fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleShowLogoutModal}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
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
  )
}

export default CustomNavbar
