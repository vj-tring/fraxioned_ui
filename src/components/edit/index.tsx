import React from 'react';
import styles from './edit.module.css';

interface EditButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button 
      className={styles.editButton} 
      onClick={onClick} 
      disabled={disabled}
    >
      Edit
    </button>
  );
};

export default EditButton;