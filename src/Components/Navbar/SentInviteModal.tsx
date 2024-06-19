import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendInvite from '../SendInvite/SendInvite';

interface InviteModalProps {
  show: boolean;
  onHide: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ show, onHide }) => {
  return (
    <Modal
      open={show}
      onClose={onHide}
      aria-labelledby="invite-modal-title"
      aria-describedby="invite-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" id="invite-modal-title">
            Send Invite
          </Typography>
          <IconButton aria-label="close" onClick={onHide}>
            <CloseIcon />
          </IconButton>
        </Box>
        <SendInvite />
      </Box>
    </Modal>
  );
};

export default InviteModal;
