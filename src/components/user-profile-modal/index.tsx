import React, { useState, useCallback } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserForm from "@/pages-admin/grid/user-grid/edit-form/user-form";
import EditForm from "@/pages-admin/grid/user-grid/edit-form/user-edit";
import styles from "./user-profile.module.css";
import { User } from "@/store/model/user";

interface UserProfileModalProps {
  userData: User;
  showUserForm: boolean;
  handleClose: () => void;
  isAdmin: boolean;
}

const userFormStyles = {
  userForm: styles.userForm,
  header: styles.userFormHeader,
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userData,
  showUserForm,
  handleClose,
  isAdmin,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // Handlers wrapped with useCallback to prevent re-creation on every render
  const handleEditClick = useCallback(() => setIsEditing(true), []);
  const handleCloseEditForm = useCallback(() => setIsEditing(false), []);

  return (
    <Modal
      open={showUserForm}
      onClose={handleClose}
      aria-labelledby="user-form-modal"
      aria-describedby="user-form-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1400,
          height:550,
          bgcolor: "background.paper",
          p: 4,
          boxShadow: 24,
          borderRadius: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {!isEditing ? (
          <>
            <h2 className={styles.header}>My Profile</h2>
            <UserForm
              user={userData}
              onEditClick={handleEditClick}
              header=""
              editButtonName="Edit"
              customStyles={userFormStyles}
              showActiveStatus={false}
            />
          </>
        ) : (
          <>
            <h2 className={styles.header}>Edit Profile</h2>
            <EditForm
              user={userData}
              onClose={handleCloseEditForm}
              onUserUpdated={handleClose}
              formTitle=""
              isAdmin={false}
            />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
