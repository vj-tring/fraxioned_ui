import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PortURL } from '../config';

const useSendInviteHandler = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await axios.post(`${PortURL}/authentication/invite`, { email, roleId: selectedRole });
      console.log(`Invite sent to: ${email}`);
      setStatus('success');
    } catch (error) {
      console.error('Failed to send invite:', error);
      setErrorMessage('Failed to send the invite. Please try again later.');
      setStatus('error');
    }
  };

  return {
    email,
    status,
    errorMessage,
    handleSubmit,
    setEmail,
    selectedRole,
    setSelectedRole
  };
};

export default useSendInviteHandler;
