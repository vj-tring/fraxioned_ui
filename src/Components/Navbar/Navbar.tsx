import React, { useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css'
import useNavbarHandler from './NavbarFunction'
import Avatar from '@mui/material/Avatar'
import ListItemIcon from '@mui/material/ListItemIcon'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import LogoutIcon from '@mui/icons-material/Logout'
import InviteModal from './SentInviteModal'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import ResetPasswordModal from './ResetPasswordModal'
import FormDialog from '../RegisterFormPopUp/RegisterForm'
import '../Navbar/Navbar.css'

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
}) => {
  const {
    showInviteModal,
    showLogoutModal,
    showResetPasswordModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleShowLogoutModal,
    handleCloseLogoutModal,
    handleOpenResetPasswordModal,
    handleCloseResetPasswordModal,
    handleShowUserDetailsModal,
    handleLogout,
  } = useNavbarHandler()

  const [open, setOpen] = useState(false)
  const [openNewAccountDialog, setOpenNewAccountDialog] = useState(false)

  const handleToggle = () => {
    setOpen(!open)
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
          <Dropdown show={open} onToggle={handleToggle}>
            <Dropdown.Toggle
              variant="light"
              id="dropdown-basic"
              className="username-dropdown-toggle"
            >
              <h6 className="username ">
                {userName ? userName : 'siva@tringapps.com'}
              </h6>
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
                      marginLeft: 3,
                    }}
                  />
                ) : userName ? (
                  userName.charAt(0).toUpperCase()
                ) : (
                  'M'
                )}
              </Avatar>
            </Dropdown.Toggle>

            <Dropdown.Menu className="Drop-menu">
              <Dropdown.Item onClick={handleShowUserDetailsModal}>
                <ListItemIcon>
                  <Avatar /> <span className="profile">Profile</span>
                </ListItemIcon>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOpenInviteModal}>
                <ListItemIcon>
                  <Avatar /> <span className="profile">Send Invite</span>
                </ListItemIcon>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleOpenResetPasswordModal}>
                <ListItemIcon>
                  <Avatar /> <span className="profile">Reset Password</span>
                </ListItemIcon>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleOpenNewAccountModal}>
                <ListItemIcon>
                  <PersonAddIcon fontSize="small" />
                </ListItemIcon>
                <span className="profile1">Add another account</span>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleShowLogoutModal}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <span className="profile1">Logout</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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