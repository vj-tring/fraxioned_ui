import { fontFamily } from '@mui/system';
import React from 'react';

interface CancelPolicyProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const CancelPolicy: React.FC<CancelPolicyProps> = ({ onConfirm, onCancel }) => {
  return (
    <>
      <div style={titleStyle}>
        Are you sure you want to cancel this booking?
      </div>

      <div style={policyContainerStyle}>
        <strong style={policyTitleStyle}>
          Cancellation Policy Reminder:
        </strong>

        <ul style={policyListStyle}>
          <li style={policyItemStyle}>
            <span style={bulletStyle}>&bull;</span> Cancellations can be made up until the start of your stay.
          </li>
          <li style={policyItemStyle}>
            <span style={bulletStyle}>&bull;</span> Cancellations made at least 7 days before check-in will receive a refund.
          </li>
          <li style={policyItemStyle}>
            <span style={bulletStyle}>&bull;</span> Cancellations made less than 7 days before check-in will not receive a refund.
          </li>
          <li style={policyItemStyle}>
            <span style={bulletStyle}>&bull;</span> Any cancellations made after check-in will not be refunded, and additional charges for the cleaning fee may apply.
          </li>
          <li style={policyItemStyle}>
            <span style={bulletStyle}>&bull;</span> <b>Stays longer than 7 nights:</b> Canceling a stay of more than 7 nights will return the total booked nights to your annual total.
          </li>
        </ul>
      </div>

      <div style={buttonContainerStyle}>
        <button onClick={onCancel} style={keepButtonStyle}>
          Keep Booking
        </button>
        <button onClick={onConfirm} style={cancelButtonStyle}>
          Cancel Booking
        </button>
      </div>
      </>
  );
};

// Styling to match a cleaner look with the updated content
const containerStyle = {
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  fontFamily: 'Montserrat, sans-serif',
};

const titleStyle = {
  fontSize: '16px',
  marginBottom: '1rem',
  color: '#333',
};

const policyContainerStyle = {
  padding: '20px',
  backgroundColor: '#f7f7f7',
  borderRadius: '8px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
};

const policyTitleStyle = {
  fontSize: '14px',
  marginBottom: '10px',
  color: '#555',
};

const policyListStyle = {
  listStyleType: 'none',
  paddingLeft: 0,
  marginBottom: '1.5rem',
  marginTop: '10px',
};

const policyItemStyle = {
  fontSize: '14px',
  marginBottom: '15px',
  color: 'black',
};

const bulletStyle = {
  fontSize: '16px',
  marginRight: '10px',
  color: '#333',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginTop: '20px',
};

const keepButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  color: '#fff',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Montserrat, sans-serif',
};

const cancelButtonStyle = {
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'Montserrat, sans-serif',
};

export default CancelPolicy;