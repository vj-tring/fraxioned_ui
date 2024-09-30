import React, { useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserForm from "@/pages-admin/grid/user-grid/edit-form/userform";
import EditForm from "@/pages-admin/grid/user-grid/edit-form/useredit";
import styles from "./user-profile.module.css";

interface UserProfileModalProps {
  userData: any;
  showUserForm: boolean;
  handleClose: () => void;
}
const userFormStyles = {
  userForm: styles.userForm,
  header: styles.userFormHeader,
};

const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userData,
  showUserForm,
  handleClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);

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
          width: 1200,
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
              userId={userData?.id}
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
              onClose={() => setIsEditing(false)}
              onUserUpdated={handleClose}
              formTitle={""}
            />
          </>
        )}
      </Box>
    </Modal>
  );
};

export default UserProfileModal;
