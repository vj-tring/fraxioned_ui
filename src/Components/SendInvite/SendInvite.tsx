import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PortURL } from '../config';
const SendInvite: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const roleId=1;
      const response = await axios.post(`${PortURL}/authentication/invite`, { email,roleId });
      console.log(`Invite sent to: ${email}`);
      setStatus('success');
    } catch (error) {
      console.error('Failed to send invite:', error);
      setErrorMessage('Failed to send the invite. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formEmail">
        <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{padding:10,borderRadius:3,marginTop:20,marginBottom:20}}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3 " disabled={status === 'loading'}>
        {status === 'loading' ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Send Invite'}
      </Button>

      {status === 'success' && (
        <Alert variant="success" className="mt-3">
          Invite sent successfully!
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="danger" className="mt-3">
          {errorMessage}
        </Alert>
      )}
    </Form>
  );
};

export default SendInvite;
